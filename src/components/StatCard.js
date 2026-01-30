import React from 'react';
import { Wallet, TrendingUp, TrendingDown, CalendarDays } from 'lucide-react';

const StatCard = ({ label, val, type, isPurple = false }) => {
  // Numeric values ke liye formatting, Calendar ke liye simple string
  const displayValue = type === 'calendar' 
    ? val 
    : `PKR ${Number(val || 0).toLocaleString()}`;

  return (
    <div className={`group p-4 md:p-5 rounded-[1.8rem] border transition-all duration-300 flex flex-col justify-between min-h-[130px] md:min-h-[150px] w-full
      ${isPurple 
        ? 'bg-[#4f46e5] text-white border-transparent shadow-lg shadow-indigo-200 dark:shadow-none' 
        : 'bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white border-slate-100 dark:border-slate-800 shadow-sm'}`}>
      
      <div className="flex justify-between items-start">
        <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center
          ${isPurple ? 'bg-white/20' : 'bg-slate-50 dark:bg-indigo-500/10 text-indigo-600'}`}>
          {type === 'income' && <TrendingUp size={18} />}
          {type === 'spend' && <TrendingDown size={18} />}
          {type === 'balance' && <Wallet size={18} />}
          {type === 'calendar' && <CalendarDays size={18} />}
        </div>
      </div>

      <div className="mt-3">
        <p className={`text-[9px] md:text-[10px] font-semibold uppercase tracking-widest mb-1 ${isPurple ? 'text-indigo-100/80' : 'text-slate-400'}`}>
          {label}
        </p>
        <h4 className="text-base md:text-lg lg:text-xl font-semibold tracking-tight truncate">
          {displayValue}
        </h4>
      </div>
    </div>
  );
};

export default StatCard;