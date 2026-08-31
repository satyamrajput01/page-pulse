import { AuditResult, AuditErrorResponse } from '../types/analyzer';

export async function analyzeUrl(url: string): Promise<AuditResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s client safeguard

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw {
        error: `Unexpected server response format (${response.status}).`,
        details: text.slice(0, 200),
      } as AuditErrorResponse;
    }

    if (!response.ok) {
      throw {
        error: data.error || `Server responded with status ${response.status}`,
        details: data.details,
        status: response.status,
      } as AuditErrorResponse;
    }

    return data as AuditResult;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err && typeof err === 'object' && 'error' in err) {
      throw err as AuditErrorResponse;
    }

    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw {
          error: 'Request timed out after 15 seconds.',
          details: 'The client abandoned the request because the server took too long to answer.',
        } as AuditErrorResponse;
      }
      throw {
        error: err.message || 'Failed to connect to Page Pulse backend server.',
        details: 'Check your network connection and verify the server is running.',
      } as AuditErrorResponse;
    }

    throw {
      error: 'An unknown communication error occurred.',
    } as AuditErrorResponse;
  }
}
