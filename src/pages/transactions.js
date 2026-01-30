import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { 
  Search, Calendar, FileDown, ArrowUpRight, ArrowDownLeft, 
  ChevronLeft, ChevronRight, ReceiptText, Loader2, X 
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TransactionItem from '../components/TransactionItem';
import { EditExpenseModal, DeleteConfirmModal } from '../components/ExpenseModals';
import { EditIncomeModal, DeleteIncomeModal } from '../components/IncomeModals';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Transactions = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Sirf ye EK line honi chahiye activeTab ke liye
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'expense');

  // const BASE_URL = "https://expense-pro-backend.vercel.app";

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'expense' ? '/api/expenses/' : '/api/incomes/';
      const res = await axios.get(`${endpoint}`);
      const rawData = Array.isArray(res.data) ? res.data : res.data.results || [];
      const mapped = rawData.map(item => ({
        ...item,
        expense_title: item.expense_title || item.income_title || "Untitled",
        price: item.price || item.amount || 0,
        date: item.date || new Date().toISOString().split('T')[0]
      }));
      setAllData(mapped);
      setCurrentPage(1);
    } catch (err) { setAllData([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const filteredItems = allData.filter(item => {
    const matchesSearch = item.expense_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate);
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // --- Modal Handlers ---
  const handleEditClick = (item) => {
    setSelectedItem({ ...item }); // Copy item to state
    setIsEditModalOpen(true);
  };

  const handleModalChange = (updatedData) => {
    setSelectedItem(updatedData);
  };

  const handleModalSave = async () => {
    // Agar input khali ho to error dikhao pehle hi
    if (!selectedItem.expense_title || !selectedItem.price) {
      toast.error("Please fill all fields!");
      return;
    }

    const loadingToast = toast.loading("Updating record...");
    try {
      const endpoint = activeTab === 'expense' 
        ? `/api/expenses/${selectedItem.id}/` 
        : `/api/incomes/${selectedItem.id}/`;
      
      await axios.put(`${endpoint}`, selectedItem);
      
      // Success Design
      toast.success("Successfully updated!", { id: loadingToast });
      setIsEditModalOpen(false);
      fetchData(); 
      
    } catch (err) {
      console.error("Save Error:", err);
      // Agar backend se koi khas message aaye to wo dikhao, warna default
      const errorMessage = err.response?.data?.message || "Failed to update record.";
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const handleDeleteConfirm = async () => {
    const loadingToast = toast.loading("Deleting record...");
    try {
      const endpoint = activeTab === 'expense' 
        ? `/api/expenses/${selectedItem.id}/` 
        : `/api/incomes/${selectedItem.id}/`;
      
      await axios.delete(`${endpoint}`);
      
      // Success Design
      toast.success("Record deleted forever.", { id: loadingToast });
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) { 
      console.error("Delete Error:", err);
      toast.error("Could not delete record.", { id: loadingToast });
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const reportDate = new Date().toLocaleDateString('en-GB');
      const totalAmount = filteredItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
      
      // Theme Colors (Professional Slate & Indigo)
      const primaryColor = [79, 70, 229]; 
      const textDark = [30, 41, 59];      
      const textLight = [100, 116, 139];   

      // --- 1. COMPACT HEADER ---
      doc.setFontSize(18); // Chota size
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textDark);
      doc.text("Xpense", 14, 15);
      
      const logoWidth = doc.getTextWidth("Xpense");
      doc.setTextColor(...primaryColor);
      doc.text("Pro", 14 + logoWidth, 15);

      // Right Side Info
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...textLight);
      doc.text(`GENERATED ON: ${reportDate}`, 196, 15, { align: 'right' });

      doc.setDrawColor(241, 245, 249);
      doc.line(14, 20, 196, 20);

      // --- 2. DYNAMIC SUMMARY (Compact) ---
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 25, 182, 18, 1, 1, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(...textLight);
      // Dynamic Label: Total Expense or Total Income
      doc.text(`TOTAL ${activeTab.toUpperCase()}`, 20, 32);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textDark);
      doc.text(`PKR ${totalAmount.toLocaleString()}`, 20, 39);

      // Transactions Count
      doc.setFontSize(8);
      doc.setTextColor(...textLight);
      doc.text("ENTRIES", 150, 32);
      doc.setFontSize(11);
      doc.text(`${filteredItems.length}`, 150, 39);

      // --- 3. CLEAN DATA TABLE (Reduced Padding) ---
      const rows = filteredItems.map(i => [
        i.date, 
        i.expense_title.toUpperCase(), 
        `${parseFloat(i.price).toLocaleString()}`
      ]);

      autoTable(doc, {
        head: [['DATE', 'DESCRIPTION', 'AMOUNT (PKR)']],
        body: rows,
        startY: 50,
        margin: { horizontal: 14 },
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8, // Chota font for data
          cellPadding: 3, // Reduced padding
          lineColor: [235, 238, 241],
          lineWidth: 0.1,
        },
        headStyles: { 
          fillColor: [71, 85, 105], // Slate 600
          textColor: [255, 255, 255],
          fontSize: 7,
          fontStyle: 'bold',
          halign: 'center',
        },
        columnStyles: {
          0: { cellWidth: 30, halign: 'center' },
          1: { cellWidth: 'auto', halign: 'left' },
          2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
        },
        alternateRowStyles: {
          fillColor: [254, 254, 254]
        }
      });

      // --- 4. MODERN FOOTER ---
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer Line
        doc.setDrawColor(241, 245, 249);
        doc.line(14, 282, 196, 282);

        doc.setFontSize(7);
        doc.setTextColor(...textLight);
        doc.text("XpensePro Business Suite - Automated Financial Report", 14, 287);
        doc.text(`Page ${i} of ${pageCount}`, 196, 287, { align: 'right' });
      }

      doc.save(`XpensePro_${activeTab}_Report.pdf`);

    } catch (error) {
      console.error("PDF Export Error", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#06080c] flex flex-col transition-colors">
      <Toaster />
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-5 sm:px-8 py-2 md:py-6">
  
  {/* HEADING SECTION: Semi-bold & Mobile Friendly Alignment */}
  <div className="text-left mb-5 md:mb-8 transition-all"> 
    <h2 className="text-lg md:text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
      Transactions History
    </h2>
    <p className="text-slate-500 dark:text-slate-400 text-[12px] md:text-sm mt-1 leading-tight">
      Manage your {activeTab} records and exports.
    </p>
  </div>

        {/* PDF BUTTON & TABS Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          {/* PRECISE DOT-INDICATOR SWITCH */}
<div className="flex flex-col items-center sm:items-start gap-3">
  <div 
    onClick={() => {
      const nextTab = activeTab === 'expense' ? 'income' : 'expense';
      setActiveTab(nextTab);
      navigate(`/transactions?tab=${nextTab}`, { replace: true });
    }}
    className="relative flex items-center bg-[#eef2f8] dark:bg-slate-800/80 w-[185px] h-[46px] p-1 rounded-full cursor-pointer transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-hidden"
  >
    {/* Sliding White Knob */}
    <div 
      className={`absolute top-1 bottom-1 w-[38px] h-[38px] bg-white dark:bg-slate-200 rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 flex items-center justify-center
      ${activeTab === 'income' ? 'left-[calc(100%-39px-4px)]' : 'left-1'}`}
    >
      {/* The Dot Indicator */}
      <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${activeTab === 'expense' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
    </div>

    {/* Text Layer - Original Animation Back */}
    <div className="flex w-full h-full items-center justify-center px-2">
      <span className={`text-[13px] font-medium transition-all duration-500 select-none text-slate-700 dark:text-slate-200
        ${activeTab === 'expense' ? 'translate-x-4' : '-translate-x-4'}`}>
        {activeTab === 'expense' ? 'Expenses' : 'Income'}
      </span>
    </div>
  </div>

  {/* Status Text - Original Style */}
  <div className="flex items-center gap-2 ml-5 mt-1.5 transition-all duration-300">
    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'expense' ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.4)]' : 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]'}`} />
    
    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-[0.18em] select-none">
      MODE: <span className={`transition-colors duration-300 ${activeTab === 'expense' ? 'text-rose-500/80' : 'text-emerald-500/80'}`}>{activeTab}</span>
    </span>
  </div>
</div>

          <button 
  onClick={handleDownloadPDF}
  className="group relative flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-br from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white rounded-2xl font-semibold shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] dark:shadow-none transition-all duration-300 active:scale-95 w-full md:w-auto overflow-hidden"
>
  {/* Shine effect animation on hover */}
  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />

  <div className="flex items-center gap-3 relative z-10">
    <div className="p-1.5 bg-white/10 rounded-lg group-hover:rotate-12 transition-transform duration-300">
      <FileDown size={19} strokeWidth={2.5} />
    </div>
    <span className="text-sm tracking-wide">Download Report</span>
  </div>
</button>
        </div>

       {/* FILTERS BOX: Ultra Clean with Global Reset */}
<div className="bg-white dark:bg-[#0f172a] p-5 md:p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm mb-8 transition-all">
  <div className="flex flex-col lg:flex-row items-end gap-4">
    
    {/* Search Input Container */}
    <div className="flex-[2] w-full relative group">
      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Search</label>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search description..." 
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500 rounded-2xl outline-none dark:text-slate-100 text-sm transition-all"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>

    {/* Date Range Container */}
<div className="flex-[3] w-full flex flex-col sm:flex-row items-end gap-3">
  {/* From Date */}
  <div className="w-full">
    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">From</label>
    <div className="relative">
      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      <input 
        type={startDate ? "date" : "text"} 
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => !startDate && (e.target.type = "text")}
        placeholder="Start Date"
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500 rounded-2xl outline-none dark:text-slate-100 text-sm transition-all [color-scheme:light] dark:[color-scheme:dark]"
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)}
      />
    </div>
  </div>

  <span className="hidden sm:block mb-4 text-slate-300 dark:text-slate-600">—</span>

  {/* To Date */}
  <div className="w-full">
    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">To</label>
    <div className="relative">
      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      <input 
        type={endDate ? "date" : "text"} 
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => !endDate && (e.target.type = "text")}
        placeholder="End Date"
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500 rounded-2xl outline-none dark:text-slate-100 text-sm transition-all [color-scheme:light] dark:[color-scheme:dark]"
        value={endDate} 
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>
  </div>
</div>

    {/* GLOBAL CLEAR BUTTON */}
    {(searchTerm || startDate || endDate) && (
      <button 
        onClick={() => {
          setSearchTerm('');
          setStartDate('');
          setEndDate('');
        }}
        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-2xl text-xs font-semibold transition-all border border-rose-100 dark:border-rose-500/20 whitespace-nowrap group animate-in fade-in slide-in-from-right-2"
      >
        <X size={16} className="group-hover:rotate-90 transition-transform" />
        Clear Filters
      </button>
    )}
  </div>
</div>
       {/* LIST SECTION */}
<div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-slate-800/60 shadow-sm overflow-hidden mb-8 transition-colors">
  {/* Yahan se min-h-[300px] hata kar h-auto kar diya */}
  <div className="flex flex-col h-auto"> 
    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
      {loading ? (
        /* Loading state mein height honi chahiye taake jump na kare */
        <div className="py-24 flex flex-col items-center justify-center gap-4 min-h-[300px]">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
          <p className="text-xs font-medium text-slate-400 animate-pulse">Fetching records...</p>
        </div>
      ) : currentItems.length > 0 ? (
        currentItems.map((item, idx) => (
          <TransactionItem 
            key={item.id || idx} 
            exp={item} 
            isFirst={idx === 0} 
            onEdit={() => handleEditClick(item)} 
            onDelete={() => { 
              setSelectedItem(item); 
              setIsDeleteModalOpen(true); 
            }} 
          />
        ))
      ) : (
        /* No records state mein height */
        <div className="py-24 text-center min-h-[200px] flex flex-col items-center justify-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 mb-4">
            <ReceiptText size={24} strokeWidth={1.5} />
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No records found for this period.</p>
        </div>
      )}
    </div>
  </div>
</div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 pb-10">
            <button 
              disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border dark:border-slate-700 disabled:opacity-20 dark:text-white"
            >
              <ChevronLeft size={22} />
            </button>
            <span className="font-semibold text-sm text-slate-500 uppercase tracking-widest">{currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border dark:border-slate-700 disabled:opacity-20 dark:text-white"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </main>
      {/* ================= FINAL ATTEMPT MODALS ================= */}
      
     {/* --- EDIT MODAL --- */}
{isEditModalOpen && selectedItem && (
  activeTab === 'expense' ? (
    <EditExpenseModal 
      isOpen={isEditModalOpen} 
      onClose={() => { setIsEditModalOpen(false); setSelectedItem(null); }} 
      data={selectedItem}               // Aapka state variable
      onChange={handleModalChange}      // Aapka handler function
      onSave={handleModalSave}          // Aapka API call function
    />
  ) : (
    <EditIncomeModal 
      isOpen={isEditModalOpen} 
      onClose={() => { setIsEditModalOpen(false); setSelectedItem(null); }} 
      data={selectedItem} 
      onChange={handleModalChange} 
      onSave={handleModalSave} 
    />
  )
)}

{/* --- DELETE MODAL --- */}
{isDeleteModalOpen && selectedItem && (
  activeTab === 'expense' ? (
    <DeleteConfirmModal 
      isOpen={isDeleteModalOpen} 
      onClose={() => { setIsDeleteModalOpen(false); setSelectedItem(null); }} 
      onConfirm={handleDeleteConfirm}   // Aapka delete logic
      itemName={selectedItem.expense_title} 
    />
  ) : (
    <DeleteIncomeModal 
      isOpen={isDeleteModalOpen} 
      onClose={() => { setIsDeleteModalOpen(false); setSelectedItem(null); }} 
      onConfirm={handleDeleteConfirm} 
      itemName={selectedItem.income_title} 
    />
  )
)}
      <Footer />
    </div>
  );
};

export default Transactions;