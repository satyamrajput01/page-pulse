import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import { performance } from 'perf_hooks';
import { AuditResult } from '../../types/analyzer';

export class AnalyzerCustomError extends Error {
  statusCode: number;
  details?: string;

  constructor(message: string, statusCode: number = 400, details?: string) {
    super(message);
    this.name = 'AnalyzerCustomError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function analyzeWebsiteUrl(targetUrl: string): Promise<AuditResult> {
  const startTime = performance.now();

  let response;
  try {
    response = await axios.get(targetUrl, {
      timeout: 10000, // 10 seconds timeout
      maxRedirects: 5,
      validateStatus: () => true, // Accept any status code so we can inspect status (e.g. 404, 500)
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 PagePulseAuditor/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      responseType: 'text',
    });
  } catch (err: unknown) {
    const elapsedMs = Math.round(performance.now() - startTime);
    const axiosErr = err as AxiosError;

    if (axiosErr.code === 'ECONNABORTED' || axiosErr.code === 'ETIMEDOUT') {
      throw new AnalyzerCustomError(
        'Connection timed out after 10 seconds. The target server took too long to respond.',
        504,
        `Elapsed time: ${elapsedMs} ms before timeout.`
      );
    }

    if (axiosErr.code === 'ENOTFOUND' || axiosErr.code === 'EAI_AGAIN') {
      throw new AnalyzerCustomError(
        'Could not resolve website domain address. Please verify the URL is correct and public.',
        404,
        `DNS lookup failed for target URL: ${targetUrl}`
      );
    }

    if (axiosErr.code === 'ECONNREFUSED' || axiosErr.code === 'EHOSTUNREACH') {
      throw new AnalyzerCustomError(
        'Failed to establish connection. Target website server actively refused connection or is unreachable.',
        502,
        `Connection error code: ${axiosErr.code}`
      );
    }

    if (axiosErr.code === 'ERR_TLS_CERT_ALTNAME_INVALID' || axiosErr.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
      throw new AnalyzerCustomError(
        'SSL/TLS certificate verification failed for the target website.',
        502,
        `SSL Error: ${axiosErr.message}`
      );
    }

    throw new AnalyzerCustomError(
      `Unable to fetch webpage: ${axiosErr.message || 'Unknown network error'}`,
      500,
      `Error code: ${axiosErr.code || 'UNKNOWN'}`
    );
  }

  const endTime = performance.now();
  const responseTimeMs = Math.round(endTime - startTime);
  const responseTime = `${responseTimeMs} ms`;

  const statusCode = response.status;
  const contentType = (response.headers['content-type'] || '').toString().toLowerCase();

  // Validate response type: reject non-HTML responses
  const isHtml =
    contentType.includes('text/html') ||
    contentType.includes('application/xhtml+xml') ||
    contentType.includes('text/xml') ||
    contentType.includes('application/xml');

  if (!isHtml && response.data) {
    throw new AnalyzerCustomError(
      `Non-HTML response received. Page Pulse only analyzes HTML web pages. Received content type: "${contentType || 'unknown'}".`,
      422,
      `The requested URL returned resource format "${contentType}", which cannot be parsed as an HTML document.`
    );
  }

  const rawHtml = typeof response.data === 'string' ? response.data : String(response.data || '');

  if (!rawHtml.trim()) {
    throw new AnalyzerCustomError(
      'Target URL returned an empty HTTP response body with no HTML content.',
      422,
      'The server returned status ' + statusCode + ' but zero content.'
    );
  }

  // Parse HTML using Cheerio
  const $ = cheerio.load(rawHtml);

  // 1. Extract Title
  let title = $('title').first().text().trim();
  if (!title) {
    title = $('meta[property="og:title"]').attr('content')?.trim() || '';
  }
  if (!title) {
    title = $('meta[name="twitter:title"]').attr('content')?.trim() || '';
  }
  if (!title) {
    title = 'No title tag found';
  }

  // 2. Extract Meta Description
  let metaDescription =
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="og:description"]').attr('content')?.trim() ||
    $('meta[name="twitter:description"]').attr('content')?.trim() ||
    '';
  if (!metaDescription) {
    metaDescription = 'No meta description found';
  }

  // 3. Extract H1 tags
  const h1Elements = $('h1');
  const h1Count = h1Elements.length;
  const h1List: string[] = [];
  h1Elements.each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text) h1List.push(text);
  });

  // 4. Extract Images Missing ALT attribute
  const images = $('img');
  const totalImagesCount = images.length;
  let imagesWithoutAlt = 0;

  images.each((_, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined || alt === null || alt.trim() === '') {
      imagesWithoutAlt++;
    }
  });

  // 5. Calculate Word Count
  // Clone body or html to extract text without script/style tags
  const cleanDom = cheerio.load(rawHtml);
  cleanDom('script, style, noscript, svg, iframe, style, code, textarea, head, nav, footer').remove();
  const rawText = cleanDom('body').text() || cleanDom.text();
  const normalizedText = rawText.replace(/\s+/g, ' ').trim();
  const wordsArray = normalizedText ? normalizedText.split(' ').filter((w) => w.length > 0) : [];
  const wordCount = wordsArray.length;

  // Canonical link if available
  const canonicalUrl = $('link[rel="canonical"]').attr('href')?.trim();

  // Compute Overall Health Score (0 - 100)
  let healthScore = 100;
  if (statusCode !== 200) healthScore -= 30;
  if (responseTimeMs > 2000) healthScore -= 15;
  else if (responseTimeMs > 1000) healthScore -= 5;

  if (title === 'No title tag found') healthScore -= 15;
  else if (title.length < 10 || title.length > 70) healthScore -= 5;

  if (metaDescription === 'No meta description found') healthScore -= 15;
  else if (metaDescription.length < 50 || metaDescription.length > 160) healthScore -= 5;

  if (h1Count === 0) healthScore -= 15;
  else if (h1Count > 1) healthScore -= 5; // SEO best practice: exactly one H1 tag per page

  if (imagesWithoutAlt > 0) {
    const penalty = Math.min(20, imagesWithoutAlt * 4);
    healthScore -= penalty;
  }

  if (wordCount < 100) healthScore -= 10;

  healthScore = Math.max(0, Math.min(100, healthScore));

  return {
    status: statusCode,
    responseTime,
    responseTimeMs,
    title,
    metaDescription,
    h1Count,
    imagesWithoutAlt,
    wordCount,
    canonicalUrl,
    contentType,
    totalImagesCount,
    h1List,
    healthScore,
    analyzedAt: new Date().toISOString(),
    targetUrl,
  };
}
