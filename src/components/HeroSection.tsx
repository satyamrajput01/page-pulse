import React from 'react';
import { Gauge, SearchCheck, Sparkles, FileCode, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="text-center pt-8 pb-6 sm:pt-12 sm:pb-8 max-w-3xl mx-auto px-4">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>Instant Webpage Performance & SEO Audit Tool</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
        Analyze Any Webpage <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
          In Milliseconds
        </span>
      </h1>

      {/* Description */}
      <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
        Enter any website address to inspect HTTP connectivity, response latency, HTML document structure, SEO meta descriptors, heading tags, image accessibility, and total body copy volume.
      </p>

      {/* Highlights pill grid */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
          <Gauge className="w-3.5 h-3.5 text-indigo-500" />
          <span>Real-time Response Timer</span>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
          <FileCode className="w-3.5 h-3.5 text-sky-500" />
          <span>HTML & Cheerio Scraper</span>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
          <SearchCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>SEO & Accessibility Audit</span>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
          <span>Production Ready</span>
        </div>
      </div>
    </section>
  );
};
