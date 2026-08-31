/**
 * URL Validator & Sanitizer Utility
 * Sanitizes and validates user-submitted web addresses.
 */

export interface ValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  error?: string;
}

export function validateAndNormalizeUrl(rawUrl: string): ValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      isValid: false,
      error: 'URL parameter is required and must be a string.',
    };
  }

  let trimmed = rawUrl.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'URL cannot be empty.',
    };
  }

  // Auto-prepend https:// if protocol is missing
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);

    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'Only HTTP and HTTPS website protocols are supported.',
      };
    }

    // Must have a valid hostname with at least a dot or localhost
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return {
        isValid: false,
        error: 'Invalid hostname provided in URL.',
      };
    }

    // Basic regex check for standard domain formatting
    const isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    const hasValidDomainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(parsed.hostname);

    if (!isLocalhost && !hasValidDomainPattern && !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname)) {
      return {
        isValid: false,
        error: 'Please enter a valid web domain address (e.g. example.com or https://example.com).',
      };
    }

    return {
      isValid: true,
      normalizedUrl: parsed.toString(),
    };
  } catch {
    return {
      isValid: false,
      error: 'Malformed URL format. Please enter a valid URL (e.g. https://example.com).',
    };
  }
}
