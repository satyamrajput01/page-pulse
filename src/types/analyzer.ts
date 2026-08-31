export interface AuditRequest {
  url: string;
}

export interface AuditResult {
  status: number;
  responseTime: string; // e.g., "321 ms"
  responseTimeMs: number;
  title: string;
  metaDescription: string;
  h1Count: number;
  imagesWithoutAlt: number;
  wordCount: number;
  // Extended diagnostic metrics for senior engineering depth
  canonicalUrl?: string;
  contentType?: string;
  totalImagesCount?: number;
  h1List?: string[];
  healthScore?: number; // 0 - 100
  analyzedAt: string;
  targetUrl: string;
}

export interface AuditErrorResponse {
  error: string;
  details?: string;
  code?: string;
  status?: number;
}

export interface MetricRating {
  label: string;
  status: 'optimal' | 'warning' | 'critical';
  score: number;
  message: string;
}

export interface OverallReportHealth {
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  ratings: {
    status: MetricRating;
    responseTime: MetricRating;
    title: MetricRating;
    metaDescription: MetricRating;
    h1: MetricRating;
    altTags: MetricRating;
    wordCount: MetricRating;
  };
  recommendations: string[];
}
