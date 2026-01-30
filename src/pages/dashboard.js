import axios from '../axiosConfig';
import React, { useState, useEffect } from 'react';
import { ChevronRight, CalendarDays, ChevronDown } from 'lucide-react';
import { EditExpenseModal, DeleteConfirmModal } from '../components/ExpenseModals';
import StatCard from '../components/StatCard'; 
import TransactionItem from '../components/TransactionItem';
import Header from '../components/Header'; 
import Footer from '../components/Footer';
import QuickAddForm from '../components/QuickAddForm';
import toast, { Toaster } from 'react-hot-toast';
import SavingsChart from '../components/SavingsChart';
import { useSearchParams, useNavigate } from 'react-router-dom';


const Dashboard = () => {
  // --- Existing States (Nahi cherha) ---
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('expense');
  
  
  const today = new Date().toISOString().split('T')[0];
  
  const [newExpense, setNewExpense] = useState({ expense_title: '', price: '', date: today });
  const [selectedExp, setSelectedExp] = useState({ id: '', expense_title: '', price: '', date: '' });

  // --- New States for Custom Dropdown & Filter ---
  const [isOpen, setIsOpen] = useState(false); // Dropdown menu open/close karne ke liye
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default current month
  const [showAllTime, setShowAllTime] = useState(false); // "Overall View" ka switch

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // const BASE_URL = "https://expense-pro-backend.vercel.app"; 

  const fetchData = async () => {
    try {
      // Ab hum direct endpoints use karenge
      const [expRes, incRes] = await Promise.all([
        axios.get('/api/expenses/'), 
        axios.get('/api/incomes/')
      ]);
      
      setExpenses(Array.isArray(expRes.data) ? expRes.data : expRes.data.results || []);
      setIncomes(Array.isArray(incRes.data) ? incRes.data : incRes.data.results || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
};

  useEffect(() => { fetchData(); }, []);

  // --- NEW: Smart Filter Logic (Purana reduction method filter ke andar wrap kar diya) ---
  const filteredIncomeTotal = incomes.filter(item => {
    if (showAllTime) return true;
    const d = new Date(item.date);
    return d.getMonth() === selectedMonth;
  }).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  const filteredSpendTotal = expenses.filter(item => {
    if (showAllTime) return true;
    const d = new Date(item.date);
    return d.getMonth() === selectedMonth;
  }).reduce((acc, curr) => acc + parseFloat(curr.price || 0), 0);

  // Constants for UI
  const totalIncome = filteredIncomeTotal;
  const totalSpend = filteredSpendTotal;
  const remaining = totalIncome - totalSpend;
  const displayMonth = showAllTime ? "All Time" : monthsList[selectedMonth];

  useEffect(() => {
    // URL se 'tab' ki value check karo
    const targetTab = searchParams.get('tab');
    if (targetTab) {
      setActiveTab(targetTab); // Agar 'expense' mila to switch automatic move ho jayega
    }
  }, [searchParams]);

  // --- CRUD Functions ---
  // --- ADD EXPENSE ---
  const handleAdd = async (e) => {
    e.preventDefault();
    
    // Check fields using toast instead of alert
    if(!newExpense.expense_title || !newExpense.price) {
      return toast.error("Please fill all fields before adding!");
    }

    const loadingToast = toast.loading("Adding new expense...");
    setLoading(true);
    
    try {
      await axios.post(`/api/expenses/`, newExpense); 
      
      toast.success("Expense added successfully!", { id: loadingToast });
      setNewExpense({ expense_title: '', price: '', date: today });
      fetchData(); 
    } catch (err) { 
      console.error("Add Error:", err);
      toast.error("Failed to add expense. Try again.", { id: loadingToast });
    } 
    finally { 
      setLoading(false); 
    }
  };

  // --- UPDATE EXPENSE ---
  const handleUpdate = async (e) => {
    if(e) e.preventDefault();
    
    const loadingToast = toast.loading("Updating record...");
    try {
      await axios.put(`/api/expenses/${selectedExp.id}/`, selectedExp);
      
      toast.success("Record updated successfully!", { id: loadingToast });
      setIsEditOpen(false);
      fetchData();
    } catch (err) { 
      console.error("Update Error:", err); 
      toast.error("Update failed. Please check your data.", { id: loadingToast });
    }
  };

  // --- DELETE EXPENSE ---
  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting record...");
    try {
      await axios.delete(`/api/expenses/${selectedExp.id}/`);
      
      toast.success("Record deleted successfully!", { id: loadingToast });
      setIsDeleteOpen(false);
      fetchData();
    } catch (err) { 
      console.error("Delete Error:", err); 
      toast.error("Could not delete the record.", { id: loadingToast });
    }
  };

  const openEdit = (exp) => { setSelectedExp(exp); setIsEditOpen(true); };
  const openDelete = (exp) => { setSelectedExp(exp); setIsDeleteOpen(true); };



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
    Financial Timeline
  </h3>
  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 tracking-wide">
    Analyze your monthly trends
  </p>
</div>

    <div className="relative w-full sm:w-[220px]">
  {/* Trigger Button */}
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

{/* Aapka Purana Cards Wala Section */}
<div className="max-w-[1400px] mx-auto px-6 md:px-12">
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
    <StatCard label="Total Income" val={totalIncome} type="income" />
    <StatCard label="Remaining" val={remaining} type="balance" isPurple={true} />
    <StatCard label="Total Spend" val={totalSpend} type="spend" />
    <StatCard label="Active Month" val={displayMonth} type="calendar" />
  </div>
</div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-10">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <SavingsChart incomeData={incomes} expenseData={expenses} />
        )}
      </div>


        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-10">
            <QuickAddForm 
  formData={newExpense} 
  setFormData={setNewExpense} 
  onSubmit={handleAdd}
  loading={loading}
  // Title ke liye humne 'expense_title' set kiya tha
  titleField="expense_title" 
  // Amount ke liye humne 'price' set kiya tha
  amountField="price"        
  headingText="Add New Expense"
  buttonText="Add Expense"
  titlePlaceholder="What did you spend on?"
/>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-12">
            <div className="flex flex-row items-center justify-between mb-8 gap-4 text-left">
              <div className="min-w-0">
                <h3 className="text-[18px] md:text-2xl font-semibold text-slate-800 dark:text-white tracking-tight leading-tight">
                  Recent Activity
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="hidden md:block w-1 h-1 rounded-full bg-indigo-300 dark:bg-indigo-500/40"></span>
                  <p className="text-[10px] md:text-[12px] text-slate-400 font-medium uppercase tracking-[0.08em]">
                    Latest Expense Transactions
                  </p>
                </div>
              </div>
              
              <button 
  onClick={() => navigate('/transactions?tab=expense')} // Dashboard par bhejega aur tab ki nishani sath dega
  className="shrink-0 flex items-center gap-1.5 md:gap-2 text-[11px] md:text-[13px] font-semibold text-[#4f46e5] bg-white dark:bg-indigo-500/5 border border-indigo-100/60 dark:border-indigo-500/20 px-4 md:px-6 py-2 md:py-2.5 rounded-xl hover:bg-[#4f46e5] hover:text-white transition-all duration-300 shadow-sm group"
>
  <span>See All</span>
  <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
</button>
            </div>

            <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm mb-10">
              {expenses.slice(0, 5).map((exp, index) => (
                <TransactionItem 
                  key={exp.id} 
                  exp={exp} 
                  onEdit={() => openEdit(exp)} 
                  onDelete={() => openDelete(exp)} 
                  isFirst={index === 0}
                />
              ))}
            </div>
        </div>
      </main>

      <EditExpenseModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        data={selectedExp} 
        onChange={setSelectedExp} 
        onSave={handleUpdate} 
      />
      <DeleteConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleDelete} 
        itemName={selectedExp.expense_title} 
      />

      <Footer />
    </div>
  );
};

export default Dashboard;