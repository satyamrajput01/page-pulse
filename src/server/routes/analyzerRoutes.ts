import { Router } from 'express';
import { handleAnalyzeUrl } from '../controllers/analyzerController';

const router = Router();

/**
 * POST /api/analyze
 * Accepts JSON { "url": "https://example.com" }
 * Audits the given webpage and returns metrics JSON.
 */
router.post('/analyze', handleAnalyzeUrl);

export default router;
