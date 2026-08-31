import { Request, Response, NextFunction } from 'express';
import { validateAndNormalizeUrl } from '../utils/urlValidator';
import { analyzeWebsiteUrl, AnalyzerCustomError } from '../services/analyzerService';

export async function handleAnalyzeUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { url } = req.body || {};

    // 1. Check if URL was provided
    if (!url || typeof url !== 'string' || !url.trim()) {
      res.status(400).json({
        error: 'URL parameter is missing or empty. Please enter a valid website address.',
        details: 'Expected body format: { "url": "https://example.com" }',
      });
      return;
    }

    // 2. Validate and normalize URL format
    const validation = validateAndNormalizeUrl(url);
    if (!validation.isValid || !validation.normalizedUrl) {
      res.status(400).json({
        error: validation.error || 'Invalid URL provided.',
        details: 'URL must be a properly formatted web address.',
      });
      return;
    }

    // 3. Execute webpage analysis service
    const auditResult = await analyzeWebsiteUrl(validation.normalizedUrl);

    // 4. Return exact JSON schema required by Task A specs
    res.status(200).json(auditResult);
  } catch (err: unknown) {
    if (err instanceof AnalyzerCustomError) {
      res.status(err.statusCode).json({
        error: err.message,
        details: err.details,
      });
      return;
    }

    // Pass to global error middleware if unhandled
    next(err);
  }
}
