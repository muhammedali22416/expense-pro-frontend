import React, { useState } from 'react';
import { Pencil, Trash2, ReceiptText, X, Calendar, Wallet } from 'lucide-react';

const TableHeader = () => (
  <div className="hidden lg:flex items-center px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
    <span className="w-[120px] text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-12">Date</span>
    <span className="flex-1 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Description</span>
    <span className="w-[150px] text-[11px] font-semibold text-slate-400 uppercase tracking-widest text-right">Amount</span>
    <span className="w-[60px] text-[11px] font-semibold text-slate-400 uppercase tracking-widest text-right mr-4">View</span>
  </div>
);

const TransactionItem = ({ exp, onEdit, onDelete, isFirst }) => {
  const [showDetail, setShowDetail] = useState(false);

  // Field detection (Backend keys handling)
  const title = exp.expense_title || exp.income_title || "Untitled";
  const amount = exp.price || exp.amount || 0;

  return (
    <>
      {isFirst && <TableHeader />}
      
      {/* Transaction Row */}
      <div 
        onClick={() => setShowDetail(true)}
        className="w-full bg-white dark:bg-[#0f172a] border-b border-slate-50 dark:border-slate-800/50 last:border-0 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all group"
      >
        <div className="px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          
          <div className="flex items-center flex-1 min-w-0">
            {/* Desktop Date */}
            <div className="hidden lg:block w-[120px] shrink-0">
              <span className="text-[13px] font-medium text-slate-400">
                {exp.date}
              </span>
            </div>

            {/* Icon */}
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-indigo-500 shrink-0 border border-slate-100 dark:border-slate-700/50 mr-3 md:mr-4 group-hover:scale-105 transition-transform">
              <ReceiptText size={18} strokeWidth={2} />
            </div>

            {/* Description & Mobile Date */}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-slate-700 dark:text-slate-200 truncate text-[14px] md:text-[15px] tracking-tight">
                {title}
              </span>
              <span className="lg:hidden text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                {exp.date}
              </span>
            </div>
          </div>

          {/* Amount Section */}
          <div className="flex items-center shrink-0">
            <div className="w-auto md:w-[150px] text-right">
              <span className="text-[14px] md:text-[16px] font-semibold text-slate-900 dark:text-white whitespace-nowrap tracking-tight">
                PKR {parseFloat(amount).toLocaleString()}
              </span>
            </div>
            
            {/* Arrow/Detail indicator */}
            <div className="hidden lg:flex items-center justify-end w-[60px] text-slate-300 group-hover:text-indigo-500 transition-colors mr-4">
               <X size={16} className="rotate-45" />
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED POPUP MODAL */}
      {showDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowDetail(false)}
          ></div>
          
          <div className="relative w-full max-w-[380px] bg-white dark:bg-[#0f172a] rounded-[2.2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 border border-slate-100 dark:border-slate-800">
            <div className="p-7">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100 dark:border-indigo-500/20">
                  <ReceiptText size={24} />
                </div>
                <button 
                  onClick={() => setShowDetail(false)} 
                  className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Title Info */}
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1 tracking-tight leading-snug">
                {title}
              </h4>
              <p className="text-[12px] text-slate-400 font-medium mb-6">Transaction Details</p>

              {/* Details Card */}
              <div className="space-y-4 mb-8 bg-slate-50/50 dark:bg-slate-800/40 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <Calendar size={14} strokeWidth={2.5} />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Date</span>
                  </div>
                  <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300">{exp.date}</span>
                </div>
                
                <div className="h-[1px] bg-slate-200/50 dark:bg-slate-700/50 w-full"></div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <Wallet size={14} strokeWidth={2.5} />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Amount</span>
                  </div>
                  <span className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-tight">
                    PKR {parseFloat(amount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { setShowDetail(false); onEdit(exp); }}
                  className="flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-semibold rounded-2xl transition-all active:scale-95 shadow-md shadow-indigo-100 dark:shadow-none"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button 
                  onClick={() => { setShowDetail(false); onDelete(exp); }}
                  className="flex items-center justify-center gap-2 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 text-[14px] font-semibold rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-500/5 transition-all active:scale-95"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionItem;