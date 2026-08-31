import React from 'react';
import { AlertTriangle, RefreshCw, Globe, HelpCircle, ShieldAlert } from 'lucide-react';
import { AuditErrorResponse } from '../types/analyzer';

interface ErrorCardProps {
  error: AuditErrorResponse;
  onRetry: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ error, onRetry }) => {
  // Determine error category & advice
  let errorCategory = 'Analysis Failed';
  let adviceList: string[] = [
    'Check that the website URL is spelled correctly.',
    'Verify that the target server is active and publicly accessible.',
    'Ensure the website address starts with http:// or https://.',
  ];

  const errMessage = (error.error || '').toLowerCase();

  if (errMessage.includes('timeout') || errMessage.includes('timed out')) {
    errorCategory = 'Connection Timeout (504)';
    adviceList = [
      'The target website took longer than 10 seconds to respond.',
      'Check if the website is experiencing high load or DDoS protection bottlenecks.',
      'Try analyzing the page again after a few seconds.',
    ];
  } else if (errMessage.includes('dns') || errMessage.includes('domain') || errMessage.includes('resolve')) {
    errorCategory = 'Domain Name Resolution Error (404)';
    adviceList = [
      'The domain name could not be found via DNS lookup.',
      'Double check for typos in the domain extension (e.g., .com, .org, .co).',
      'Ensure the domain is actively registered and published on public DNS servers.',
    ];
  } else if (errMessage.includes('non-html') || errMessage.includes('content type')) {
    errorCategory = 'Non-HTML Resource Error (422)';
    adviceList = [
      'Page Pulse only audits HTML documents (webpages).',
      'The target URL points directly to an image, PDF file, JSON API endpoint, or binary file.',
      'Provide a direct URL to a standard website HTML page.',
    ];
  } else if (errMessage.includes('refused') || errMessage.includes('unreachable') || errMessage.includes('ssl')) {
    errorCategory = 'Network Connection Error (502)';
    adviceList = [
      'The target web server actively rejected the connection or has SSL certificate issues.',
      'Verify if the website requires custom VPN credentials or basic authentication.',
      'Try accessing the URL in a standard browser tab first.',
    ];
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 shadow-xl overflow-hidden transition-all">
        {/* Top Error Banner Header */}
        <div className="bg-red-50 dark:bg-red-950/40 p-5 border-b border-red-100 dark:border-red-900/40 flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                {errorCategory}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {error.error || 'Unable to audit requested website.'}
            </h3>
            {error.details && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono bg-red-100/50 dark:bg-red-950/80 p-2 rounded-lg border border-red-200/50 dark:border-red-900/50">
                {error.details}
              </p>
            )}
          </div>
        </div>

        {/* Troubleshooting Advice */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-semibold text-sm">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Recommended Troubleshooting Steps:</span>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {adviceList.map((tip, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>Page Pulse Auto Error Protection</span>
            </div>

            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
