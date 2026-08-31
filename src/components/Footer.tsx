import React from 'react';
import { Heart, Activity, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-8 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        {/* Brand & Mission */}
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Page Pulse</span>
          <span>— Fast, Production-Grade Web Auditor Engine</span>
        </div>

        {/* Center Tagline */}
        <div className="flex items-center space-x-1.5 font-medium">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Built for Modern Web Engineers & Creators</span>
          </span>
        </div>

        {/* Copyright */}
        <div className="flex items-center space-x-1 text-slate-400 dark:text-slate-500">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for speed & precision</span>
        </div>
      </div>
    </footer>
  );
};
