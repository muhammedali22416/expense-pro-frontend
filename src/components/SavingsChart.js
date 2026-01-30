import React from 'react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const SavingsChart = ({ incomeData = [], expenseData = [] }) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formatPKR = (val) => `Rs. ${new Intl.NumberFormat('en-PK').format(val)}`;

  const chartData = months.map((month, index) => {
    const getMonthInfo = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.split('-'); 
      return parseInt(parts[1], 10) - 1;
    };
    const mInc = (incomeData || []).filter(item => getMonthInfo(item.date) === index).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const mExp = (expenseData || []).filter(item => getMonthInfo(item.date) === index).reduce((sum, item) => sum + Number(item.price || item.amount || 0), 0);
    return { name: month, income: mInc, saving: mInc - mExp, hasData: mInc > 0 };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-800 min-w-[140px] pointer-events-none">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 border-b border-slate-50 dark:border-slate-800 pb-1">{label} 2026</p>
          <div className="space-y-1.5">
            <div className="flex justify-between gap-4">
              <span className="text-[11px] text-slate-500">Income</span>
              <span className="text-[11px] font-bold text-indigo-500">{formatPKR(payload[0].value)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[11px] text-slate-500">Savings</span>
              <span className="text-[11px] font-bold text-emerald-500">{formatPKR(payload[1].value)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-visible">
      {/* 1. CSS Override for Black Border */}
      <style dangerouslySetInnerHTML={{ __html: `
        .recharts-accessibilityLayer { outline: none !important; }
        .recharts-wrapper:focus { outline: none !important; }
        *:focus { outline: none !important; -webkit-tap-highlight-color: transparent; }
      `}} />

      <div className="mb-8 px-2">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Financial Flow</h2>
        <p className="text-slate-400 text-[11px] font-medium tracking-wide">Monthly Savings Analysis</p>
      </div>

      <div className="h-[320px] w-full relative select-none outline-none">
        <ResponsiveContainer width="100%" height="100%">
  <ComposedChart 
    data={chartData} 
    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
    accessibilityLayer={false}
  >
    {/* GRID UPDATED: Opacity barha di hai aur dash array hataya hai for solid clean lines */}
    <CartesianGrid 
      vertical={false} 
      stroke="#94a3b8" 
      opacity={0.15} // Pehle 0.05 tha, ab nazar aayega
      strokeDasharray="0" // Solid lines zyada modern lagti hain
    />

    <XAxis 
      dataKey="name" 
      axisLine={false} 
      tickLine={false} 
      tick={{fill: '#94a3b8', fontSize: 11}} 
      dy={10} 
    />
    
    <YAxis 
      axisLine={false} 
      tickLine={false} 
      tick={{fill: '#94a3b8', fontSize: 10}} 
      tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} 
    />
    
    <Tooltip 
      content={<CustomTooltip />} 
      cursor={{ fill: '#f1f5f9', opacity: 0.4 }} // Cursor on kiya hai jo bar par hover effect dega
      isAnimationActive={true}
      wrapperStyle={{ outline: 'none' }}
    />
    
    <Bar dataKey="income" barSize={32} radius={[8, 8, 8, 8]}>
      {chartData.map((entry, index) => (
        <Cell 
          key={`cell-${index}`} 
          fill={entry.hasData ? '#6366f1' : '#f1f5f9'} 
          style={{ outline: 'none' }} 
        />
      ))}
    </Bar>

    <Line 
      type="monotone" 
      dataKey="saving" 
      stroke="#10b981" 
      strokeWidth={3} 
      dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
      activeDot={{ r: 6, stroke: '#fff', fill: '#10b981', strokeWidth: 2 }} 
    />
  </ComposedChart>
</ResponsiveContainer>
      </div>
    </div>
  );
};

export default SavingsChart;