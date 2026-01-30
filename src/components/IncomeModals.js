  import React from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { X, CheckCircle2, Wallet, Calendar, Type, AlertTriangle } from 'lucide-react';

  // --- EDIT INCOME MODAL ---
  export const EditIncomeModal = ({ isOpen, onClose, data, onSave, onChange }) => {
    if (!isOpen || !data) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Simple Blur Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-3xl shadow-2xl relative z-10 border dark:border-slate-800 overflow-hidden"
          >
            <div className="p-6 sm:p-10">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-600 tracking-tight">Edit Income</h3>
                  <p className="text-slate-500 text-sm mt-1">Adjust your earnings data</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 hover:scale-110 transition-all">
                  <X size={20}/>
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="group">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1 block mb-2">Income Source</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={data.income_title} 
                      onChange={(e) => onChange({...data, income_title: e.target.value})} 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-medium dark:text-white outline-none border-2 border-transparent focus:border-emerald-500 transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1 block mb-2">Amount (PKR)</label>
                    <div className="relative">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="number" 
                        value={data.amount} 
                        onChange={(e) => onChange({...data, amount: e.target.value})} 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-medium dark:text-white outline-none border-2 border-transparent focus:border-emerald-500 transition-all" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1 block mb-2">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="date" 
                        value={data.date} 
                        onChange={(e) => onChange({...data, date: e.target.value})} 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-medium dark:text-white outline-none border-2 border-transparent focus:border-emerald-500 transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <button onClick={onSave} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl font-bold shadow-lg shadow-emerald-100 dark:shadow-none transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                  <CheckCircle2 size={20} /> Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  // --- DELETE INCOME MODAL ---
  export const DeleteIncomeModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
          className="bg-white dark:bg-[#0f172a] w-full max-w-sm p-8 sm:p-10 rounded-[2.5rem] text-center shadow-2xl relative z-10 border dark:border-slate-800"
        >
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold dark:text-white mb-2">Remove Income?</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">
            This record will be deleted forever: <br/> <span className="text-rose-500 font-bold block mt-1">"{itemName}"</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onClose} className="flex-1 p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
            <button onClick={onConfirm} className="flex-1 p-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg hover:bg-rose-600 transition-all active:scale-95">Yes, Delete</button>
          </div>
        </motion.div>
      </div>
    );
  };