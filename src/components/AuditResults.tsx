import React, { useState } from 'react';
import {
  Server,
  Zap,
  Heading1,
  FileText,
  Image as ImageIcon,
  BookOpen,
  Award,
  Copy,
  Check,
  RotateCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
} from 'lucide-react';
import { AuditResult } from '../types/analyzer';
import { evaluateAuditMetrics, formatWordCount, estimateReadingTime } from '../utils/formatting';
import { MetricCard } from './MetricCard';

interface AuditResultsProps {
  result: AuditResult;
  onReAnalyze: () => void;
}

export const AuditResults: React.FC<AuditResultsProps> = ({ result, onReAnalyze }) => {
  const [copied, setCopied] = useState(false);
  const [showH1List, setShowH1List] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);

  const health = evaluateAuditMetrics(result);

  const handleCopyReport = () => {
    const reportText = `Page Pulse Audit Report for ${result.targetUrl}
Date: ${new Date(result.analyzedAt).toLocaleString()}
Overall Score: ${health.score}/100 (Grade ${health.grade})

• HTTP Status: ${result.status}
• Response Time: ${result.responseTime}
• Page Title: "${result.title}"
• Meta Description: "${result.metaDescription}"
• H1 Count: ${result.h1Count}
• Images Missing ALT Text: ${result.imagesWithoutAlt}${result.totalImagesCount ? ` of ${result.totalImagesCount}` : ''}
• Word Count: ${formatWordCount(result.wordCount)} words

Audited with Page Pulse`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `page-pulse-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800';
    if (score >= 70) return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800';
    if (score >= 50) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header: Target URL + Score + Action Buttons */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Target Website Details */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-200/60 dark:border-indigo-800/60">
                Target Website
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Analyzed at {new Date(result.analyzedAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white truncate max-w-xl">
                {result.targetUrl}
              </h2>
              <a
                href={result.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                title="Open URL in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Content-Type: {result.contentType || 'text/html'} {result.canonicalUrl ? `• Canonical: ${result.canonicalUrl}` : ''}
            </p>
          </div>

          {/* Health Score Box & Actions */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Health Score Pill */}
            <div className={`p-4 rounded-2xl border flex items-center space-x-4 ${getScoreColor(health.score)}`}>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-xs">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs uppercase font-bold tracking-wider opacity-80">Page Pulse Score</div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black tracking-tight">{health.score}</span>
                  <span className="text-xs font-semibold opacity-75">/ 100</span>
                  <span className="ml-2 px-2 py-0.5 rounded text-xs font-extrabold bg-white/90 dark:bg-slate-900/90 shadow-2xs">
                    Grade {health.grade}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onReAnalyze}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm transition-colors flex items-center space-x-1.5"
                title="Re-run audit"
              >
                <RotateCw className="w-4 h-4" />
                <span className="hidden sm:inline">Re-analyze</span>
              </button>

              <button
                type="button"
                onClick={handleCopyReport}
                className="p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-medium text-xs sm:text-sm transition-colors flex items-center space-x-1.5 border border-indigo-200/50 dark:border-indigo-800/50"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowJsonModal((prev) => !prev)}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium text-xs sm:text-sm transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Viewer Modal / Collapsible */}
      {showJsonModal && (
        <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs shadow-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400 font-bold">Raw Backend JSON Response:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadJson}
                className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-sans font-medium flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 font-sans"
              >
                Close
              </button>
            </div>
          </div>
          <pre className="overflow-x-auto p-3 bg-slate-950 rounded-xl max-h-60 text-slate-300">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Grid of 7 Required Audit Cards */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Core Audit Results</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              7/7 Metrics Validated
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: HTTP Status */}
          <MetricCard
            title="HTTP Status Code"
            value={result.status}
            subtitle={result.status === 200 ? '200 OK — Successful Response' : `HTTP Status ${result.status}`}
            rating={health.ratings.status}
            icon={<Server className="w-5 h-5" />}
          />

          {/* Card 2: Response Time */}
          <MetricCard
            title="Response Time"
            value={result.responseTime}
            subtitle={`${result.responseTimeMs} ms total connection latency`}
            rating={health.ratings.responseTime}
            icon={<Zap className="w-5 h-5" />}
          />

          {/* Card 3: Page Title */}
          <MetricCard
            title="Page Title"
            value={result.title}
            subtitle={`${result.title.length} characters long`}
            rating={health.ratings.title}
            icon={<FileText className="w-5 h-5" />}
          />

          {/* Card 4: Meta Description */}
          <MetricCard
            title="Meta Description"
            value={result.metaDescription}
            subtitle={`${result.metaDescription.length} characters long`}
            rating={health.ratings.metaDescription}
            icon={<FileText className="w-5 h-5" />}
          />

          {/* Card 5: Number of H1 Tags */}
          <MetricCard
            title="H1 Tag Count"
            value={result.h1Count}
            subtitle={result.h1Count === 1 ? '1 main heading detected' : `${result.h1Count} H1 tags detected`}
            rating={health.ratings.h1}
            icon={<Heading1 className="w-5 h-5" />}
            extendedDetails={
              result.h1List && result.h1List.length > 0 ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowH1List((prev) => !prev)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>View H1 Tag Content ({result.h1List.length})</span>
                    {showH1List ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showH1List && (
                    <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                      {result.h1List.map((h1, i) => (
                        <li key={i} className="truncate italic">
                          "{h1}"
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : undefined
            }
          />

          {/* Card 6: Images Missing ALT Text */}
          <MetricCard
            title="Images Missing ALT Text"
            value={result.imagesWithoutAlt}
            subtitle={
              result.totalImagesCount !== undefined
                ? `${result.imagesWithoutAlt} out of ${result.totalImagesCount} image(s) missing alt tag`
                : `${result.imagesWithoutAlt} image(s) missing alt text`
            }
            rating={health.ratings.altTags}
            icon={<ImageIcon className="w-5 h-5" />}
          />

          {/* Card 7: Approximate Word Count */}
          <MetricCard
            title="Approximate Word Count"
            value={formatWordCount(result.wordCount)}
            subtitle={`${estimateReadingTime(result.wordCount)} • Visible HTML Body Copy`}
            rating={health.ratings.wordCount}
            icon={<BookOpen className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Executive Recommendations Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <span>Actionable SEO & Performance Recommendations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {health.recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
