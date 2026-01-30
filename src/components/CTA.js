import React from 'react';
import { Linkedin, Instagram, MessageCircle } from 'lucide-react';

const CTA = () => {
  return (
    <div className="w-full mt-10 p-8 bg-indigo-50 dark:bg-slate-900/50 rounded-[3rem] border border-indigo-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-center md:text-left">
        <h4 className="text-lg font-bold text-indigo-900 dark:text-white">FinancePro v2.0</h4>
        <p className="text-xs font-medium text-slate-500">Built for seamless tracking by Ali Khan</p>
      </div>
      <div className="flex gap-3">
        {[<Linkedin size={20}/>, <MessageCircle size={20}/>, <Instagram size={20}/>].map((icon, i) => (
          <a key={i} href="#" className="p-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-sm hover:bg-indigo-600 hover:text-white transition-all">{icon}</a>
        ))}
      </div>
    </div>
  );
};

export default CTA;