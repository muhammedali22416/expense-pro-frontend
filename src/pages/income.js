import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Wallet, TrendingUp, CalendarDays, ChevronDown, Plus, DollarSign, ArrowUpRight, BadgeCheck, Edit2, Trash2, X, ChevronRight } from 'lucide-react';
import StatCard from '../components/StatCard'; 
import TransactionItem from '../components/TransactionItem';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import { EditIncomeModal, DeleteIncomeModal } from '../components/IncomeModals';
import QuickAddForm from '../components/QuickAddForm';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    // Transactions.js (jahan tabs bane hain)
const [searchParams] = useSearchParams();
// State ko initial value URL se do
const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'expense');
  
  // Modals & Form States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [formData, setFormData] = useState({
    income_title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Filter States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showAllTime, setShowAllTime] = useState(false);

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // const BASE_URL = "https://expense-pro-backend.vercel.app";

  // --- FIXED FUNCTION NAME ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [incRes, expRes] = await Promise.all([
        axios.get(`/api/incomes/`),
        axios.get(`/api/expenses/`)
      ]);
      setIncomes(Array.isArray(incRes.data) ? incRes.data : incRes.data.results || []);
      setExpenses(Array.isArray(expRes.data) ? expRes.data : expRes.data.results || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };




useEffect(() => {
  const urlTab = searchParams.get('tab');
  if (urlTab) {
    setActiveTab(urlTab); // Agar URL mein income hai to income tab khul jayega
  }
}, [searchParams]);


  // --- FIXED USEEFFECT CALL ---
  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- CALCULATIONS (NaN Safe) ---
  const filteredIncomes = incomes.filter(item => {
    if (showAllTime) return true;
    const d = new Date(item.date);
    return d.getMonth() === selectedMonth;
  });

  const filteredExpenses = expenses.filter(item => {
    if (showAllTime) return true;
    const d = new Date(item.date);
    return d.getMonth() === selectedMonth;
  });

  const totalMonthlyIncome = filteredIncomes.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const totalMonthlyExpense = filteredExpenses.reduce((acc, curr) => acc + (parseFloat(curr.amount || curr.price) || 0), 0);
  
  const remainingAmount = totalMonthlyIncome - totalMonthlyExpense;
  const savingAmount = remainingAmount > 0 ? remainingAmount : 0;
  const activeLabel = showAllTime ? "Overall View" : monthsList[selectedMonth];

  // --- 3. ADD INCOME ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.income_title?.trim() || !formData.amount) {
      toast.error("Please fill all fields before adding!");
      return;
    }

    const loadingToast = toast.loading("Adding new income...");
    setLoading(true);

    try {
      // { headers: HEADERS } nikal diya gaya hai
      const res = await axios.post(`/api/incomes/`, formData);
      toast.success("Income added successfully!", { id: loadingToast });
      
      setIncomes([res.data, ...incomes]);
      setFormData({ 
        income_title: '', 
        amount: '', 
        date: new Date().toISOString().split('T')[0] 
      });
    } catch (err) {
      console.error("Add Error:", err);
      toast.error("Failed to add income. Try again.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  // --- 4. UPDATE INCOME ---
  const handleUpdate = async () => {
    if (!selectedIncome?.id) return;

    if (!selectedIncome.income_title?.trim() || !selectedIncome.amount) {
      toast.error("Fields cannot be empty!");
      return;
    }

    const loadingToast = toast.loading("Updating record...");
    try {
      // Headers hata diye hain taake CORS error na aaye
      await axios.put(`/api/incomes/${selectedIncome.id}/`, selectedIncome);
      toast.success("Record updated successfully!", { id: loadingToast });
      
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Update failed. Please check your data.", { id: loadingToast });
    }
  };

  // --- 5. DELETE INCOME ---
  const handleDeleteConfirm = async () => {
    if (!selectedIncome?.id) return;

    const loadingToast = toast.loading("Deleting record...");
    try {
      // Headers hata diye hain
      await axios.delete(`/api/incomes/${selectedIncome.id}/`);
      toast.success("Record deleted successfully!", { id: loadingToast });
      
      setIncomes(prev => prev.filter(inc => inc.id !== selectedIncome.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Could not delete the record.", { id: loadingToast });
    }
  };

  // --- Modal Handlers ---
  const handleEditClick = (income) => { 
    setSelectedIncome({ ...income }); 
    setIsEditModalOpen(true); 
  };
  
  const handleDeleteClick = (income) => { 
    setSelectedIncome(income); 
    setIsDeleteModalOpen(true); 
  };

  

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#06080c]">
      <Toaster />
      <Header />
      
<main className="flex-1 pb-20">

<div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-8">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300">
    
    {/* Title & Subtitle */}
    <div className="flex flex-col gap-0.5 ml-1">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
        Income Stream
      </h3>
      <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 tracking-wide">
        Manage and track your earnings
      </p>
    </div>

    {/* Filter Dropdown */}
    <div className="relative w-full sm:w-[220px]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm hover:border-indigo-400 transition-all outline-none"
      >
        <div className="flex items-center gap-3">
          <CalendarDays size={18} className="text-indigo-500" />
          <span className="capitalize">{showAllTime ? "Overall View" : monthsList[selectedMonth]}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-20 py-2 max-h-[300px] overflow-y-auto backdrop-blur-xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => { setShowAllTime(true); setIsOpen(false); }}
              className={`w-full text-left px-5 py-2.5 text-sm font-medium transition-colors ${showAllTime ? 'text-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              Overall View
            </button>
            
            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-3"></div>
            
            {monthsList.map((m, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedMonth(i);
                  setShowAllTime(false);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-2.5 text-sm font-medium transition-colors ${!showAllTime && selectedMonth === i ? 'text-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
</div>

{/* --- UPDATED STATS GRID --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-10">
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
    {/* 1. Total Income */}
    <StatCard label="Total Income" val={totalMonthlyIncome} type="income" isPurple={true} />
    
    {/* 2. Total Expense (Remaining ki jagah ye lagayein) */}
    <StatCard label="Total Expense" val={totalMonthlyExpense} type="spend" />
    
    {/* 3. Net Saving */}
    <StatCard label="Net Saving" val={savingAmount} type="balance" />
    
    {/* 4. Filter Info */}
    <StatCard label="Filter Mode" val={activeLabel} type="calendar" />
  </div>
</div>

        {/* QUICK ADD FORM */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-10">
          <QuickAddForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={handleSubmit}
            loading={loading}
            headingText="Add New Income"
            buttonText="Save Income"
            titlePlaceholder="Income source (e.g. Salary, Job)"
            titleField="income_title"
          />

        </div>

        {/* HISTORY LIST */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-4">

          {/* HEADING */}

          <div className="flex flex-row items-center justify-between mb-8 gap-4 text-left">
                          <div className="min-w-0">
                            <h3 className="text-[18px] md:text-2xl font-semibold text-slate-800 dark:text-white tracking-tight leading-tight">
                              Recent Activity
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="hidden md:block w-1 h-1 rounded-full bg-indigo-300 dark:bg-indigo-500/40"></span>
                              <p className="text-[10px] md:text-[12px] text-slate-400 font-medium uppercase tracking-[0.08em]">
                                Latest Incomes Transactions
                              </p>
                            </div>
                          </div>
                          
                          
<button 
  onClick={() => navigate('/transactions?tab=income')} // Ye /transactions page par bhejega aur sath 'income' ka tag le jayega
  className="relative z-50 shrink-0 flex items-center gap-1.5 md:gap-2 text-[11px] md:text-[13px] font-semibold text-emerald-600 bg-white dark:bg-emerald-500/5 border border-emerald-100/60 dark:border-emerald-500/20 px-4 md:px-6 py-2 md:py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm group"
>
  <span>See All</span>
  <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
</button>
                        </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {incomes.map((inc, index) => (
                    <TransactionItem 
                      key={inc.id || index} 
                      // Yahan hum Income ke fields ko Expense ke naam de rahe hain
                      exp={{
                        ...inc, 
                        expense_title: inc.income_title, // income_title -> expense_title
                        price: inc.amount               // amount -> price
                      }} 
                      onEdit={() => handleEditClick(inc)} 
                      onDelete={() => handleDeleteClick(inc)}
                      isFirst={index === 0}
                    />
                  ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <EditIncomeModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        data={selectedIncome} 
        onSave={handleUpdate} 
        onChange={setSelectedIncome} 
      />
      <DeleteIncomeModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        itemName={selectedIncome?.income_title} 
      />

      <Footer />
    </div>
  );
};

export default Income;