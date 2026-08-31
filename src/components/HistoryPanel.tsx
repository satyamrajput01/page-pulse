import React from 'react';
import { History, X, Trash2, ArrowRight, Clock } from 'lucide-react';
import { AuditResult } from '../types/analyzer';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: AuditResult[];
  onSelectAudit: (item: AuditResult) => void;
  onRemoveItem: (url: string) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onSelectAudit,
  onRemoveItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Audit History</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stored locally in your browser cache ({history.length} items)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History Item List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No previous audit reports found.</p>
              <p className="text-xs mt-1">Audit any website URL to record history.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.targetUrl + item.analyzedAt}
                className="group p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-all flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => {
                    onSelectAudit(item);
                    onClose();
                  }}
                  className="cursor-pointer flex-1 min-w-0"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.targetUrl}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 200
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      HTTP {item.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>Latency: {item.responseTime}</span>
                    <span>•</span>
                    <span>Score: {item.healthScore || 'N/A'}/100</span>
                    <span>•</span>
                    <span>{new Date(item.analyzedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      onSelectAudit(item);
                      onClose();
                    }}
                    className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors"
                    title="Load report"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.targetUrl)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                    title="Remove from history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Click any URL to inspect report</span>
            <button
              onClick={onClearHistory}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold hover:underline"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
