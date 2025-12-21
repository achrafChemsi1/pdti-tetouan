import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, suffix, icon }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5 flex items-center justify-between transition-all duration-300 hover:border-white/20 group">
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-bold text-white font-display">
          {value}
          {suffix && <span className="text-lg text-slate-600 font-medium ml-1">{suffix}</span>}
        </p>
      </div>
      {icon && (
        <div className="bg-white/5 p-3 rounded-xl text-slate-400 group-hover:text-white transition-colors">
          {icon}
        </div>
      )}
    </div>
  );
};