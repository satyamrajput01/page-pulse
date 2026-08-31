import { Request, Response, NextFunction } from 'express';

export function errorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[PagePulse Backend Error]:', err.stack || err.message);

  const status = (err as unknown as { statusCode?: number }).statusCode || 500;
  const message = err.message || 'An unexpected server error occurred while processing your request.';

  res.status(status).json({
    error: message,
    details: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
