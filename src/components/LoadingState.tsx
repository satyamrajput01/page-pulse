import React from 'react';
import { Loader2, Activity, Check } from 'lucide-react';

interface LoadingStateProps {
  currentStep: string;
}

const STEPS = [
  'Validating website URL structure',
  'Establishing secure HTTP connection',
  'Fetching HTML page content stream',
  'Parsing DOM structure & SEO tags',
  'Calculating metrics & accessibility score',
];

export const LoadingState: React.FC<LoadingStateProps> = ({ currentStep }) => {
  const currentStepIndex = STEPS.findIndex((step) => step === currentStep);
  const activeIdx = currentStepIndex >= 0 ? currentStepIndex : 2;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Active Progress Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-inner">
          <Activity className="w-7 h-7 animate-pulse" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span>Analyzing Webpage</span>
            <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{currentStep}</p>
        </div>

        {/* Progress Stepper Bar */}
        <div className="max-w-md mx-auto pt-2">
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {STEPS.map((step, idx) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx < activeIdx
                    ? 'bg-indigo-600 dark:bg-indigo-500'
                    : idx === activeIdx
                    ? 'bg-indigo-400 animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="space-y-1 text-left max-w-sm mx-auto text-xs text-slate-500 dark:text-slate-400 pt-2">
            {STEPS.map((step, idx) => (
              <div
                key={step}
                className={`flex items-center space-x-2 transition-opacity duration-200 ${
                  idx <= activeIdx ? 'opacity-100 font-medium' : 'opacity-40'
                }`}
              >
                {idx < activeIdx ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : idx === activeIdx ? (
                  <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                )}
                <span className={idx === activeIdx ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
            <div className="h-8 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
