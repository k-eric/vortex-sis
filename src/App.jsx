import React, { useEffect, useState } from 'react';
import { account, databases } from './lib/appwrite';
import Login from './components/Login';
import Academics from './components/Academics';
import Finance from './components/Finance';
import Communication from './components/Communication';
import Inventory from './components/Inventory';

const DATABASE_ID = 'vortex_db';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [stats, setStats] = useState({ grades: 0, invoices: 0, inventory: 0 });

  useEffect(() => {
    account.get()
      .then((res) => {
        setUser(res);
        setLoading(false);
        fetchDashboardStats();
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const gradesRes = await databases.listDocuments(DATABASE_ID, 'grades');
      const invoicesRes = await databases.listDocuments(DATABASE_ID, 'invoices');
      const inventoryRes = await databases.listDocuments(DATABASE_ID, 'inventory');

      setStats({
        grades: gradesRes.total || gradesRes.documents.length,
        invoices: invoicesRes.total || invoicesRes.documents.length,
        inventory: inventoryRes.total || inventoryRes.documents.length,
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err.message);
    }
  };

  const handleLogout = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

  if (loading) return <div className="text-center mt-20 text-white font-sans">Loading Vortex SIS...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {user ? (
        <div>
          {/* Top Navigation Bar */}
          <nav className="flex justify-between items-center px-8 py-4 bg-indigo-900 border-b border-indigo-700 shadow-xl sticky top-0 z-50">
            <h2 className="text-xl font-black tracking-wide text-white cursor-pointer" onClick={() => setCurrentView('home')}>
              Vortex SIS
            </h2>
            <div className="flex gap-6 items-center">
              <button onClick={() => setCurrentView('home')} className={`text-sm font-bold px-3 py-1.5 rounded-lg transition ${currentView === 'home' ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800'}`}>Home</button>
              <button onClick={() => setCurrentView('academics')} className={`text-sm font-bold px-3 py-1.5 rounded-lg transition ${currentView === 'academics' ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800'}`}>Academics</button>
              <button onClick={() => setCurrentView('finance')} className={`text-sm font-bold px-3 py-1.5 rounded-lg transition ${currentView === 'finance' ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800'}`}>Finance</button>
              <button onClick={() => setCurrentView('communication')} className={`text-sm font-bold px-3 py-1.5 rounded-lg transition ${currentView === 'communication' ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800'}`}>Communication</button>
              <button onClick={() => setCurrentView('inventory')} className={`text-sm font-bold px-3 py-1.5 rounded-lg transition ${currentView === 'inventory' ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800'}`}>Inventory</button>
              <button onClick={handleLogout} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-md transition">Sign Out</button>
            </div>
          </nav>

          {/* Main Content Area */}
          {currentView === 'home' ? (
            <div className="p-10 max-w-6xl mx-auto space-y-8">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 rounded-3xl shadow-2xl border border-indigo-400/30">
                <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Welcome back, {user.name || user.email}</h1>
                <p className="text-indigo-100 text-lg font-medium">Here is your live colourful control center for managing school operations.</p>
              </div>

              {/* Quick Stat Cards with Vibrant Backgrounds */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setCurrentView('academics')} className="bg-gradient-to-br from-pink-600 to-rose-700 p-8 rounded-3xl shadow-xl cursor-pointer hover:scale-105 transition transform duration-200 border border-pink-400/30">
                  <h3 className="text-pink-100 text-xs font-black uppercase tracking-widest">Recorded Assessments</h3>
                  <p className="text-5xl font-black mt-4 text-white">{stats.grades}</p>
                  <span className="text-xs text-pink-200 mt-6 block font-bold underline underline-offset-4">Click to open gradebook →</span>
                </div>
                
                <div onClick={() => setCurrentView('finance')} className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-3xl shadow-xl cursor-pointer hover:scale-105 transition transform duration-200 border border-purple-400/30">
                  <h3 className="text-purple-100 text-xs font-black uppercase tracking-widest">Generated Invoices</h3>
                  <p className="text-5xl font-black mt-4 text-white">{stats.invoices}</p>
                  <span className="text-xs text-purple-200 mt-6 block font-bold underline underline-offset-4">Click to open fee billing →</span>
                </div>

                <div onClick={() => setCurrentView('inventory')} className="bg-gradient-to-br from-cyan-600 to-blue-700 p-8 rounded-3xl shadow-xl cursor-pointer hover:scale-105 transition transform duration-200 border border-cyan-400/30">
                  <h3 className="text-cyan-100 text-xs font-black uppercase tracking-widest">Registered Assets</h3>
                  <p className="text-5xl font-black mt-4 text-white">{stats.inventory}</p>
                  <span className="text-xs text-cyan-200 mt-6 block font-bold underline underline-offset-4">Click to open inventory →</span>
                </div>
              </div>
            </div>
          ) : currentView === 'academics' ? (
            <Academics />
          ) : currentView === 'finance' ? (
            <Finance />
          ) : currentView === 'communication' ? (
            <Communication />
          ) : (
            <Inventory />
          )}
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}s