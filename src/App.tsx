import { useState, useEffect } from 'react';
import { useAudit } from './hooks/useAudit';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { UrlInputForm } from './components/UrlInputForm';
import { LoadingState } from './components/LoadingState';
import { ErrorCard } from './components/ErrorCard';
import { AuditResults } from './components/AuditResults';
import { HistoryPanel } from './components/HistoryPanel';
import { Footer } from './components/Footer';
import { AuditResult } from './types/analyzer';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return true; // Default to dark for Sleek Interface theme
    }
    return true;
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const {
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
  } = useAudit();

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSelectHistoryItem = (item: AuditResult) => {
    setUrl(item.targetUrl);
    runAudit(item.targetUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Search & Audit Input Form */}
        <section className="mt-2 mb-8">
          <UrlInputForm
            url={url}
            setUrl={setUrl}
            onSubmit={() => runAudit()}
            isLoading={isLoading}
            onOpenHistory={() => setIsHistoryOpen(true)}
            historyCount={history.length}
          />
        </section>

        {/* Dynamic State Rendering */}
        {isLoading && <LoadingState currentStep={loadingStep} />}

        {!isLoading && error && (
          <ErrorCard error={error} onRetry={() => runAudit()} />
        )}

        {!isLoading && !error && result && (
          <AuditResults result={result} onReAnalyze={() => runAudit()} />
        )}

        {!isLoading && !error && !result && (
          <div className="max-w-2xl mx-auto text-center px-4 py-12">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Ready to audit your first website
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Type any valid URL in the input bar above (or select one of the quick preset buttons) to generate a full HTTP latency, SEO meta tag, and document accessibility audit.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* History Drawer Modal */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectAudit={handleSelectHistoryItem}
        onRemoveItem={removeFromHistory}
        onClearHistory={clearHistory}
      />

      {/* Footer featuring required "Built for Digital Heroes Training Task" link */}
      <Footer />
    </div>
  );
}
