import { AuditResult, OverallReportHealth, MetricRating } from '../types/analyzer';

export function formatWordCount(count: number): string {
  return new Intl.NumberFormat('en-US').format(count);
}

export function estimateReadingTime(wordCount: number): string {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  if (minutes <= 1) return 'Less than 1 min read';
  return `~${minutes} min read`;
}

export function evaluateAuditMetrics(result: AuditResult): OverallReportHealth {
  // 1. Status Code Evaluation
  let statusRating: MetricRating;
  if (result.status === 200) {
    statusRating = {
      label: 'HTTP Status',
      status: 'optimal',
      score: 100,
      message: '200 OK — Website is live and responding normally.',
    };
  } else if (result.status >= 200 && result.status < 400) {
    statusRating = {
      label: 'HTTP Status',
      status: 'warning',
      score: 80,
      message: `HTTP ${result.status} — Webpage returned redirect status code.`,
    };
  } else {
    statusRating = {
      label: 'HTTP Status',
      status: 'critical',
      score: 20,
      message: `HTTP ${result.status} — Target page returned client or server error.`,
    };
  }

  // 2. Response Time Evaluation
  let responseTimeRating: MetricRating;
  if (result.responseTimeMs < 800) {
    responseTimeRating = {
      label: 'Response Time',
      status: 'optimal',
      score: 100,
      message: `Ultra fast response (${result.responseTime}). Excellent server response speed.`,
    };
  } else if (result.responseTimeMs < 2000) {
    responseTimeRating = {
      label: 'Response Time',
      status: 'warning',
      score: 70,
      message: `Moderate response time (${result.responseTime}). Could benefit from server optimization or caching.`,
    };
  } else {
    responseTimeRating = {
      label: 'Response Time',
      status: 'critical',
      score: 30,
      message: `Slow response time (${result.responseTime}). Significantly exceeds recommended 1.0s limit.`,
    };
  }

  // 3. Title Evaluation
  let titleRating: MetricRating;
  const titleLen = result.title.length;
  if (result.title === 'No title tag found') {
    titleRating = {
      label: 'Page Title',
      status: 'critical',
      score: 0,
      message: 'Missing <title> tag. Essential for search engine indexation and browser tab display.',
    };
  } else if (titleLen >= 30 && titleLen <= 60) {
    titleRating = {
      label: 'Page Title',
      status: 'optimal',
      score: 100,
      message: `Optimal title length (${titleLen} characters). Fits search engine SERP display limits.`,
    };
  } else if (titleLen < 30) {
    titleRating = {
      label: 'Page Title',
      status: 'warning',
      score: 75,
      message: `Title is short (${titleLen} characters). Recommended: 30–60 characters for maximum SEO relevance.`,
    };
  } else {
    titleRating = {
      label: 'Page Title',
      status: 'warning',
      score: 75,
      message: `Title is long (${titleLen} characters). May be truncated in search results (>60 chars).`,
    };
  }

  // 4. Meta Description Evaluation
  let metaRating: MetricRating;
  const metaLen = result.metaDescription.length;
  if (result.metaDescription === 'No meta description found') {
    metaRating = {
      label: 'Meta Description',
      status: 'critical',
      score: 0,
      message: 'Missing meta description. Search engines will automatically generate snippets from body text.',
    };
  } else if (metaLen >= 120 && metaLen <= 160) {
    metaRating = {
      label: 'Meta Description',
      status: 'optimal',
      score: 100,
      message: `Ideal length (${metaLen} characters). Perfect for Google snippet preview cards.`,
    };
  } else if (metaLen < 120) {
    metaRating = {
      label: 'Meta Description',
      status: 'warning',
      score: 75,
      message: `Meta description is concise (${metaLen} characters). Consider expanding to ~150 chars.`,
    };
  } else {
    metaRating = {
      label: 'Meta Description',
      status: 'warning',
      score: 75,
      message: `Meta description is long (${metaLen} characters). May get cut off in SERP snippets (>160 chars).`,
    };
  }

  // 5. H1 Count Evaluation
  let h1Rating: MetricRating;
  if (result.h1Count === 1) {
    h1Rating = {
      label: 'H1 Tag',
      status: 'optimal',
      score: 100,
      message: 'Single H1 tag found. Perfectly aligns with HTML5 semantic and SEO best practices.',
    };
  } else if (result.h1Count === 0) {
    h1Rating = {
      label: 'H1 Tag',
      status: 'critical',
      score: 10,
      message: 'No <h1> tag detected. H1 is vital for establishing document hierarchy and primary topic.',
    };
  } else {
    h1Rating = {
      label: 'H1 Tag',
      status: 'warning',
      score: 60,
      message: `Multiple H1 tags found (${result.h1Count}). Best practice recommends using exactly 1 main H1 tag.`,
    };
  }

  // 6. ALT Text Evaluation
  let altRating: MetricRating;
  if (result.imagesWithoutAlt === 0) {
    altRating = {
      label: 'Image Accessibility',
      status: 'optimal',
      score: 100,
      message: result.totalImagesCount && result.totalImagesCount > 0
        ? `All ${result.totalImagesCount} image(s) have alt attributes. Great WCAG accessibility!`
        : 'No images without alt tags found on this page.',
    };
  } else {
    const statusType = result.imagesWithoutAlt > 5 ? 'critical' : 'warning';
    altRating = {
      label: 'Image Accessibility',
      status: statusType,
      score: Math.max(0, 100 - result.imagesWithoutAlt * 15),
      message: `${result.imagesWithoutAlt} image(s) missing alt text. Screen readers cannot describe these images.`,
    };
  }

  // 7. Word Count Evaluation
  let wordRating: MetricRating;
  if (result.wordCount >= 600) {
    wordRating = {
      label: 'Word Count',
      status: 'optimal',
      score: 100,
      message: `Substantial content body (${formatWordCount(result.wordCount)} words). Strong search engine indexable depth.`,
    };
  } else if (result.wordCount >= 250) {
    wordRating = {
      label: 'Word Count',
      status: 'warning',
      score: 80,
      message: `Moderate content (${formatWordCount(result.wordCount)} words). Good for concise landing pages.`,
    };
  } else {
    wordRating = {
      label: 'Word Count',
      status: 'critical',
      score: 40,
      message: `Thin content (${formatWordCount(result.wordCount)} words). Pages with under 250 words risk thin content classification.`,
    };
  }

  // Overall Score Calculation
  const totalScore = Math.round(
    statusRating.score * 0.2 +
      responseTimeRating.score * 0.15 +
      titleRating.score * 0.15 +
      metaRating.score * 0.15 +
      h1Rating.score * 0.15 +
      altRating.score * 0.1 +
      wordRating.score * 0.1
  );

  let grade: OverallReportHealth['grade'] = 'A+';
  if (totalScore >= 95) grade = 'A+';
  else if (totalScore >= 85) grade = 'A';
  else if (totalScore >= 75) grade = 'B';
  else if (totalScore >= 60) grade = 'C';
  else if (totalScore >= 45) grade = 'D';
  else grade = 'F';

  // Actionable recommendations
  const recommendations: string[] = [];
  if (result.status !== 200) recommendations.push(`Fix HTTP status code (currently ${result.status}). Ensure server returns 200 OK.`);
  if (result.responseTimeMs > 1000) recommendations.push('Optimize server response time. Enable gzip/brotli compression, server-side caching, or CDN delivery.');
  if (result.title === 'No title tag found') recommendations.push('Add an HTML <title> tag between 30 and 60 characters long.');
  if (result.metaDescription === 'No meta description found') recommendations.push('Add a <meta name="description"> tag summarizing the page in 120–160 characters.');
  if (result.h1Count === 0) recommendations.push('Add a single prominent <h1> tag to define the page title or primary heading.');
  if (result.h1Count > 1) recommendations.push('Reduce multiple <h1> tags to exactly 1 main H1 heading, using <h2> and <h3> for subheadings.');
  if (result.imagesWithoutAlt > 0) recommendations.push(`Add descriptive alt="..." text to ${result.imagesWithoutAlt} image(s) for WCAG AA compliance.`);
  if (result.wordCount < 300) recommendations.push('Expand page copy with informative, engaging text to improve content authority.');

  if (recommendations.length === 0) {
    recommendations.push('Outstanding work! Your webpage meets all core performance, accessibility, and SEO quality standards.');
  }

  return {
    score: result.healthScore ?? totalScore,
    grade,
    ratings: {
      status: statusRating,
      responseTime: responseTimeRating,
      title: titleRating,
      metaDescription: metaRating,
      h1: h1Rating,
      altTags: altRating,
      wordCount: wordRating,
    },
    recommendations,
  };
}
