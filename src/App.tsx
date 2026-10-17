import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { VisitLogger } from './components/VisitLogger';
import { AttendancePortal } from './components/AttendancePortal';
import { StaffDirectory } from './components/StaffDirectory';
import { ClinicTracker } from './components/ClinicTracker';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { AuthModal } from './components/AuthModal';

function MainLayout() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'visits' | 'attendance' | 'staff' | 'clinics'>('dashboard');
  const [isGoogleSheetModalOpen, setIsGoogleSheetModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [preselectedResetStaffId, setPreselectedResetStaffId] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenResetPassword = (staffId?: string) => {
    setPreselectedResetStaffId(staffId);
    setIsResetPasswordModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openGoogleSheetModal={() => setIsGoogleSheetModalOpen(true)}
        openResetPasswordModal={() => handleOpenResetPassword()}
        openAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <AdminDashboard
            onNavigate={(tab) => setCurrentTab(tab)}
            openGoogleSheetModal={() => setIsGoogleSheetModalOpen(true)}
            openResetPasswordModal={() => handleOpenResetPassword()}
          />
        )}

        {currentTab === 'visits' && <VisitLogger />}

        {currentTab === 'attendance' && <AttendancePortal />}

        {currentTab === 'staff' && (
          <StaffDirectory
            onOpenResetPassword={(staffId) => handleOpenResetPassword(staffId)}
            onNavigateToVisits={() => setCurrentTab('visits')}
          />
        )}

        {currentTab === 'clinics' && <ClinicTracker />}
      </main>

      {/* Modals */}
      <GoogleSheetSyncModal
        isOpen={isGoogleSheetModalOpen}
        onClose={() => setIsGoogleSheetModalOpen(false)}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        preselectedStaffId={preselectedResetStaffId}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        openResetPasswordModal={() => setIsResetPasswordModalOpen(true)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">PhysioTracker</span>
            <span>•</span>
            <span>Enterprise Multi-Clinic Daily Physiotherapy Visit & Attendance System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>1,000 Staff Capacity</span>
            <span>•</span>
            <span>Real-Time Google Sheet Sync</span>
            <span>•</span>
            <span>GPS Geofenced Check-Ins</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
