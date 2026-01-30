import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, History, Moon, Sun, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const Sidebar = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state

  useEffect(() => {
    const root = window.document.documentElement;
    isDark ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const navs = [
    { icon: <LayoutDashboard size={20} />, label: "Home", path: "/" },
    { icon: <Wallet size={20} />, label: "Income", path: "/income" },
    { icon: <History size={20} />, label: "Transactions", path: "/transactions" },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside 
        className={`hidden lg:flex bg-white dark:bg-[#0f172a] border-r border-slate-100 dark:border-slate-800 flex-col sticky top-0 h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24 p-4' : 'w-72 p-8'}`}
      >
        {/* Header & Toggle Button */}
        <div className={`flex items-center gap-3 mb-10 ${isCollapsed ? 'justify-center' : 'justify-between pl-2'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#4f46e5] rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <Wallet size={20}/>
              </div>
              <span className="font-semibold text-xl dark:text-white tracking-tight">Xpense<span className="text-[#4f46e5]">Pro</span></span>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navs.map((n) => (
            <NavLink 
              key={n.path} 
              to={n.path} 
              className={({ isActive }) => `
                flex items-center rounded-2xl text-[14px] transition-all duration-300
                ${isCollapsed ? 'justify-center p-4' : 'justify-between px-4 py-3.5'}
                ${isActive 
                  ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-100 dark:shadow-none font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0">{n.icon}</span>
                {!isCollapsed && <span>{n.label}</span>}
              </div>
              {!isCollapsed && <ChevronRight size={14} className="opacity-50" />}
            </NavLink>
          ))}
        </nav>

        {/* PILL THEME TOGGLE */}
        <div className={`mt-auto pt-6 border-t border-slate-50 dark:border-slate-800/50 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60 ${isCollapsed ? 'p-2 flex-col gap-4' : 'p-4 justify-between'}`}>
            <div className="flex items-center gap-3">
              {isDark ? <Moon size={18} className="text-indigo-400"/> : <Sun size={18} className="text-amber-400"/>}
              {!isCollapsed && (
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Dark Mode</span>
              )}
            </div>
            <button 
              onClick={() => setIsDark(!isDark)} 
              className={`relative h-6 rounded-full p-1 transition-colors duration-300 ${isDark ? 'bg-[#4f46e5]' : 'bg-slate-200 dark:bg-slate-700'} ${isCollapsed ? 'w-6 h-10 flex-col justify-end' : 'w-11 flex-row'}`}
            >
              <div className={`bg-white rounded-full shadow-md transform transition-transform duration-300 ${isCollapsed ? (isDark ? 'w-4 h-4 translate-y-[-16px]' : 'w-4 h-4 translate-y-0') : (isDark ? 'w-4 h-4 translate-x-5' : 'w-4 h-4 translate-x-0')}`}></div>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM DOCK (The Glass Pill Edition) */}
<div className="lg:hidden fixed bottom-6 left-5 right-5 h-16 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/40 dark:border-slate-800/50 rounded-[2.5rem] flex justify-around items-center z-[100] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-none px-2">
  {navs.map((n) => (
    <NavLink 
      key={n.path} 
      to={n.path} 
      className={({ isActive }) => `
        relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-full transition-all duration-500 ease-out
        ${isActive 
          ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-200 dark:shadow-none min-w-[110px]' 
          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 min-w-[45px]'}
      `}
    >
      {({ isActive }) => (
        <>
          <div className={`transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-110 opacity-70'}`}>
            {React.cloneElement(n.icon, { 
              size: 18, 
              strokeWidth: isActive ? 2 : 1.5 // Semi-bold feel ke liye stroke thoda kam kiya
            })}
          </div>

          <span className={`
            overflow-hidden transition-all duration-500 ease-in-out whitespace-nowrap text-[12px] font-semibold tracking-wide
            ${isActive ? 'max-w-[90px] ml-1 opacity-100' : 'max-w-0 opacity-0'}
          `}>
            {n.label}
          </span>
        </>
      )}
    </NavLink>
  ))}

  {/* Divider */}
  <div className="w-[1px] h-6 bg-slate-200/60 dark:bg-slate-800/60 mx-0.5"></div>
  
  {/* Theme Toggle */}
  <button 
    onClick={() => setIsDark(!isDark)} 
    className="w-9 h-9 flex items-center justify-center text-slate-400 dark:text-slate-500 rounded-full transition-all active:scale-90"
  >
    {isDark ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} className="text-[#4f46e5]" />}
  </button>
</div>
    </>
  );
};

export default Sidebar;