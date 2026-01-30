import React from 'react';
import { Plus, CalendarDays } from 'lucide-react';

const QuickAddForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading = false,
  headingText = "Quick Add Transaction",
  buttonText = "Add Record",
  titlePlaceholder = "What was this for?",
  titleField = "title", 
  amountField = "amount" // <-- Yeh naya prop add kiya hai default value ke sath
}) => {
  return (
    <div className="bg-white dark:bg-[#0f172a] p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm mb-12 text-left">
      <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-left tracking-tight">
        <Plus size={20} className="text-[#4f46e5]" strokeWidth={2.5}/> 
        {headingText}
      </h3>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Date */}
        <div className="relative w-full">
  <input 
    type="date" 
    value={formData.date || ''} 
    onChange={(e) => setFormData({...formData, date: e.target.value})} 
    className="w-full p-3.5 pr-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-semibold text-slate-700 dark:text-white outline-none border-2 border-transparent focus:border-[#4f46e5] transition-all text-[13px] md:text-sm cursor-pointer" 
    style={{
      WebkitAppearance: 'none',
      display: 'block'
    }}
  />
  {/* Sirf ye naya icon nazar aaye is liye humne purane ko hide karne ka tareeqa niche likha hai */}
  <CalendarDays 
    size={18} 
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
  />

  {/* Ye choti si line purane gande icon ko maar degi */}
  <style>{`
    input::-webkit-calendar-picker-indicator {
      opacity: 0;
      cursor: pointer;
    }
  `}</style>
</div>
        
        {/* Title (Dynamic: expense_title or income_title) */}
        <input 
          type="text" 
          placeholder={titlePlaceholder}
          value={formData[titleField] || ''} 
          onChange={(e) => setFormData({...formData, [titleField]: e.target.value})} 
          className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-semibold text-slate-700 dark:text-white outline-none border-2 border-transparent focus:border-[#4f46e5] text-[13px] md:text-sm placeholder:text-slate-400 transition-all" 
        />
        
        {/* Amount (Dynamic: price or amount) */}
        <input 
          type="number" 
          placeholder="Amount (PKR)" 
          // FIX: formData.amount ki jagah dynamic field use ki
          value={formData[amountField] || ''} 
          onChange={(e) => setFormData({...formData, [amountField]: e.target.value})} 
          className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-semibold text-slate-700 dark:text-white outline-none border-2 border-transparent focus:border-[#4f46e5] text-[13px] md:text-sm placeholder:text-slate-400 transition-all" 
        />
        
        {/* Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="bg-[#4f46e5] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-600 active:scale-95 transition-all py-3.5 text-sm md:text-base shadow-md shadow-indigo-100 dark:shadow-none disabled:opacity-50"
        >
          {loading ? "Processing..." : buttonText}
        </button>
      </form>
    </div>
  );
};

export default QuickAddForm;