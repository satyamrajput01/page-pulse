import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';
import { MetricRating } from '../types/analyzer';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  rating: MetricRating;
  icon: React.ReactNode;
  extendedDetails?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  rating,
  icon,
  extendedDetails,
}) => {
  const getBadgeStyle = (status: MetricRating['status']) => {
    switch (status) {
      case 'optimal':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
          label: 'Optimal',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/80 text-amber-700 dark:text-amber-300',
          icon: <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />,
          label: 'Needs Attention',
        };
      case 'critical':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200/80 dark:border-rose-800/80 text-rose-700 dark:text-rose-300',
          icon: <XCircle className="w-4 h-4 text-rose-500 shrink-0" />,
          label: 'Critical Issue',
        };
    }
  };

  const badge = getBadgeStyle(rating.status);

  return (
    <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div>
        {/* Header: Title + Icon + Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-200">
              {icon}
            </div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
              {title}
            </h4>
          </div>

          <div
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
          >
            {badge.icon}
            <span className="hidden sm:inline">{badge.label}</span>
          </div>
        </div>

        {/* Value Display */}
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </div>
          )}
        </div>

        {/* Metric Assessment Message */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed flex items-start space-x-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
          <span>{rating.message}</span>
        </p>

        {/* Optional Extended Details */}
        {extendedDetails && <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">{extendedDetails}</div>}
      </div>
    </div>
  );
};
