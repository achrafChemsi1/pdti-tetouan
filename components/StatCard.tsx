import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, suffix, icon }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-slate-100 flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:border-brand-200 group">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-800 font-display group-hover:text-brand-600 transition-colors">
          {value}
          {suffix && <span className="text-lg text-slate-400 font-medium ml-1">{suffix}</span>}
        </p>
      </div>
      {icon && (
        <div className="bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
          {icon}
        </div>
      )}
    </div>
  );
};