import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/dashboard';
import CTA from './components/CTA';
import Income from './pages/income';
import Transactions from './pages/transactions';

function App() {
  return (
    <Router>
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/income" element={<Income />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
          <div className="px-6 md:px-10 pb-20 lg:pb-10">
            {/* <CTA /> */}
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;