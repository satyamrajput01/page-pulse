import React from 'react';
import { Search, Loader2, Globe, X, History, ArrowRight } from 'lucide-react';

interface UrlInputFormProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onOpenHistory?: () => void;
  historyCount?: number;
}

const PRESET_SITES = [
  { label: 'Stripe', url: 'https://stripe.com' },
  { label: 'Wikipedia', url: 'https://wikipedia.org' },
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Example', url: 'https://example.com' },
];

export const UrlInputForm: React.FC<UrlInputFormProps> = ({
  url,
  setUrl,
  onSubmit,
  isLoading,
  onOpenHistory,
  historyCount = 0,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && url.trim()) {
      onSubmit();
    }
  };

  const handlePresetClick = (presetUrl: string) => {
    setUrl(presetUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative group">
          {/* Outer glow ring on focus */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-600 rounded-2xl blur-md opacity-25 group-hover:opacity-40 transition duration-300 group-focus-within:opacity-75"></div>

          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 transition-all">
            {/* Globe Icon */}
            <div className="pl-3 text-slate-400 dark:text-slate-500 flex items-center pointer-events-none">
              <Globe className="w-5 h-5 text-indigo-500" />
            </div>

            {/* URL Input */}
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g. example.com or https://example.com)"
              disabled={isLoading}
              className="w-full py-3 px-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base font-medium focus:outline-none disabled:opacity-50"
            />

            {/* Clear button */}
            {url && !isLoading && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Analyze Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none min-w-[130px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick presets & History trigger */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 px-1 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="font-medium mr-1 text-slate-400 dark:text-slate-500">Presets:</span>
            {PRESET_SITES.map((site) => (
              <button
                key={site.url}
                type="button"
                onClick={() => handlePresetClick(site.url)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors border border-slate-200/60 dark:border-slate-700/60"
              >
                {site.label}
              </button>
            ))}
          </div>

          {/* History Button */}
          {onOpenHistory && historyCount > 0 && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 font-medium transition-colors ml-auto"
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({historyCount})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
