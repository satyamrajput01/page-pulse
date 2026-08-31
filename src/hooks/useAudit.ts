import { useState, useEffect, useCallback } from 'react';
import { AuditResult, AuditErrorResponse } from '../types/analyzer';
import { analyzeUrl } from '../services/api';

const HISTORY_STORAGE_KEY = 'page_pulse_audit_history_v1';

export function useAudit() {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('Initializing analysis...');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<AuditErrorResponse | null>(null);
  const [history, setHistory] = useState<AuditResult[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 10));
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save history helper
  const saveToHistory = useCallback((newResult: AuditResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.targetUrl !== newResult.targetUrl);
      const updated = [newResult, ...filtered].slice(0, 10);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  }, []);

  const runAudit = useCallback(
    async (overrideUrl?: string) => {
      const target = (overrideUrl || url).trim();
      if (!target) {
        setError({
          error: 'Please enter a valid website URL.',
          details: 'Example: https://example.com or example.com',
        });
        return;
      }

      setIsLoading(true);
      setError(null);
      setResult(null);

      // Simulated step notifications during load
      setLoadingStep('Validating website URL structure...');
      const step1 = setTimeout(() => setLoadingStep('Establishing secure HTTP connection...'), 600);
      const step2 = setTimeout(() => setLoadingStep('Fetching HTML page content stream...'), 1400);
      const step3 = setTimeout(() => setLoadingStep('Parsing DOM structure & SEO tags...'), 2200);

      try {
        const data = await analyzeUrl(target);
        setResult(data);
        saveToHistory(data);
      } catch (err) {
        setError(err as AuditErrorResponse);
      } finally {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
        setIsLoading(false);
      }
    },
    [url, saveToHistory]
  );

  const clearAudit = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const removeFromHistory = useCallback((targetUrl: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.targetUrl !== targetUrl);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return {
    url,
    setUrl,
    isLoading,
    loadingStep,
    result,
    error,
    history,
    runAudit,
    clearAudit,
    removeFromHistory,
    clearHistory,
  };
}
