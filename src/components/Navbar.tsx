import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  FileSpreadsheet, 
  KeyRound, 
  LogOut, 
  UserCheck, 
  ShieldCheck, 
  RefreshCw, 
  MapPin, 
  Activity, 
  Users, 
  CheckCircle2, 
  Sparkles,
  ClipboardList,
  Clock
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'visits' | 'attendance' | 'staff' | 'clinics';
  setCurrentTab: (tab: 'dashboard' | 'visits' | 'attendance' | 'staff' | 'clinics') => void;
  openGoogleSheetModal: () => void;
  openResetPasswordModal: () => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openGoogleSheetModal,
  openResetPasswordModal,
  openAuthModal,
}) => {
  const { 
    currentUser, 
    clinics, 
    selectedClinicId, 
    setSelectedClinicId, 
    googleSheetConfig, 
    syncWithGoogleSheet,
    logout,
    lastSyncedNotice
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncWithGoogleSheet();
    setIsSyncing(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top Notification Toast for live Sheet Sync */}
      {lastSyncedNotice && (
        <div className="bg-teal-600 px-4 py-1.5 text-xs font-medium text-white flex items-center justify-between transition-all animate-pulse">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <CheckCircle2 className="w-4 h-4 text-teal-200 shrink-0" />
            <span className="truncate">{lastSyncedNotice}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-teal-500/20">
              <Activity className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">PhysioTracker</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                  Enterprise 1000 PT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Daily Visit & Multi-Clinic Attendance System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Overview
            </button>

            <button
              onClick={() => setCurrentTab('visits')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'visits'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Daily Visits
            </button>

            <button
              onClick={() => setCurrentTab('attendance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'attendance'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Attendance Sheet
            </button>

            <button
              onClick={() => setCurrentTab('staff')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'staff'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              1,000 Staff Roster
            </button>

            <button
              onClick={() => setCurrentTab('clinics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'clinics'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Clinics & GPS
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Clinic Filter Dropdown */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <select
                value={selectedClinicId}
                onChange={(e) => setSelectedClinicId(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="all" className="bg-slate-900 text-white">All 5 Clinics</option>
                {clinics.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Google Sheet Sync Button */}
            <button
              onClick={openGoogleSheetModal}
              title="Google Sheet Integration Settings"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 rounded-lg text-xs font-medium text-emerald-300 transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Google Sheet</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            {/* Quick Sync Now Action */}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              title="Sync Real-time Attendance & Visits Now"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-teal-400' : ''}`} />
            </button>

            {/* Reset Password Button */}
            <button
              onClick={openResetPasswordModal}
              title="Reset Password by Admin / Staff Self Reset"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden md:inline">Reset Password</span>
            </button>

            {/* User Profile / Auth Switcher */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs transition-all text-left"
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover border border-teal-500/50" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="hidden xl:block">
                  <div className="text-[11px] font-semibold text-white leading-tight flex items-center gap-1">
                    <span className="truncate max-w-[100px]">{currentUser.name}</span>
                    {currentUser.role === 'admin' ? (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded border border-amber-500/30">ADMIN</span>
                    ) : (
                      <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1 rounded border border-teal-500/30">{currentUser.staffId}</span>
                    )}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate max-w-[110px]">
                    {currentUser.email || 'Click to switch'}
                  </div>
                </div>
              </button>

              <button
                onClick={logout}
                title="Sign out / Switch account"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-[11px] font-medium text-slate-300">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${currentTab === 'dashboard' ? 'text-teal-400 font-bold' : ''}`}
          >
            <Activity className="w-3.5 h-3.5" />
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('visits')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${currentTab === 'visits' ? 'text-teal-400 font-bold' : ''}`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Visits
          </button>
          <button
            onClick={() => setCurrentTab('attendance')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${currentTab === 'attendance' ? 'text-teal-400 font-bold' : ''}`}
          >
            <Clock className="w-3.5 h-3.5" />
            Attendance
          </button>
          <button
            onClick={() => setCurrentTab('staff')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${currentTab === 'staff' ? 'text-teal-400 font-bold' : ''}`}
          >
            <Users className="w-3.5 h-3.5" />
            Staff
          </button>
          <button
            onClick={() => setCurrentTab('clinics')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${currentTab === 'clinics' ? 'text-teal-400 font-bold' : ''}`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Clinics
          </button>
        </div>

      </div>
    </header>
  );
};
