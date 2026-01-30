import React from 'react';

const Header = ({ userName = "Ali Khan" }) => {
  // Dynamic Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  
  // Dynamic Date
  const dateStr = new Intl.DateTimeFormat('en-US', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'long' 
  }).format(new Date());

  return (
    <header className="w-full">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 md:pt-12 mb-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* LEFT: Content */}
          <div className="flex-1 min-w-0">
            {/* Date Tag: Glassmorphism style */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100/50 dark:border-indigo-500/20 mb-3">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4f46e5]"></span>
              </span>
              <p className="text-[10px] md:text-[11px] font-bold text-[#4f46e5] uppercase tracking-widest">
                {dateStr}
              </p>
            </div>

            <h2 className="text-2xl xs:text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight leading-none">
              {greeting}, <span className="text-[#4f46e5] font-bold">{userName.split(' ')[0]}</span>
            </h2>
            
            <p className="text-[13px] md:text-base text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-[280px] md:max-w-none">
              Here's what's happening with your money today.
            </p>
          </div>

          {/* RIGHT: Profile Section Only */}
          <div className="flex items-center">
            <div className="relative group">
              {/* Animated Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#4f46e5] to-indigo-300 rounded-[1.3rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              
              {/* Avatar Container */}
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-[1.2rem] bg-white dark:bg-slate-900 p-0.5 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden active:scale-95 transition-transform">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-[1.1rem] bg-slate-50 dark:bg-slate-800"
                />
              </div>
              
              {/* Online Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#06080c] rounded-full"></div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Subtle Divider: Gradient line */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent opacity-50"></div>
      </div>
    </header>
  );
};

export default Header;