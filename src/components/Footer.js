import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-12 border-t border-slate-100 dark:border-slate-800/50 mt-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Side: Brand/Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#4f46e5] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50 dark:shadow-none transition-transform hover:scale-110">
             <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
          <span className="text-base font-semibold text-slate-800 dark:text-white tracking-tight">
            Expense<span className="text-[#4f46e5]">Pro</span>
          </span>
        </div>
        
        {/* Center: Copyright with Normal weight */}
        <p className="text-[13px] text-slate-400 font-medium order-3 md:order-2">
          © 2026 ExpensePro. Built for better finance management.
        </p>
        
        {/* Right Side: Links */}
        <div className="flex gap-8 text-[13px] font-semibold text-slate-500 dark:text-slate-400 order-2 md:order-3">
          <a href="#" className="hover:text-[#4f46e5] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#4f46e5] transition-colors">Help Center</a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;