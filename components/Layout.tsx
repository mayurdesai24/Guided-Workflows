
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Home, History, Settings, Bell, Search, User, LayoutDashboard, Grid } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  layoutMode: 'modern' | 'classic';
  onToggleLayout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, layoutMode, onToggleLayout }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200/60 flex items-center justify-between px-8 shrink-0 z-30 sticky top-0">
        
        {/* Left Side */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5 text-indigo-600 font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="bg-indigo-600 text-white p-1 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <span>ZenOptics</span>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          <div className="relative hidden lg:block w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search workflows..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>
          
          {/* Layout Toggle */}
          <button
            onClick={onToggleLayout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-all border border-slate-200 text-xs font-bold mr-2"
            title={`Switch to ${layoutMode === 'modern' ? 'Classic' : 'Modern'} Layout`}
          >
            {layoutMode === 'modern' ? <LayoutDashboard className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            <span className="hidden sm:inline">{layoutMode === 'modern' ? 'Modern' : 'Classic'}</span>
          </button>

          <button className="relative p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
             <div className="text-right hidden sm:block leading-tight">
               <p className="text-sm font-bold text-slate-800">Alex Rivera</p>
               <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">Finance Lead</p>
             </div>
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center border border-indigo-200 shadow-sm font-bold text-sm">
               AR
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full overflow-auto p-8 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
