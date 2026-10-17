import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LogIn, 
  X, 
  ShieldCheck, 
  User, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Building2,
  Lock
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  openResetPasswordModal: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  openResetPasswordModal,
}) => {
  const { 
    currentUser, 
    loginAsGoogleAdmin, 
    loginAsStaff, 
    loginAsAdminCredentials,
    staffList, 
    quickSwitchStaff 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'google_admin' | 'staff_login' | 'admin_creds'>('google_admin');
  const [staffIdInput, setStaffIdInput] = useState('PHY-0001');
  const [staffPassword, setStaffPassword] = useState('password123');
  const [adminEmail, setAdminEmail] = useState('r96662010@gmail.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    loginAsGoogleAdmin();
    onClose();
  };

  const handleStaffSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const res = loginAsStaff(staffIdInput, staffPassword);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Authentication failed');
    }
  };

  const handleAdminCredsSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const res = loginAsAdminCredentials(adminEmail, adminPassword);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Authentication failed');
    }
  };

  // 5 sample therapists for rapid 1-click test sign-in
  const demoStaffMembers = staffList.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">PhysioTracker Sign In</h3>
              <p className="text-xs text-slate-400">
                Admin Panel Google Sign Up & 1,000 Staff Authentication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800 text-[11px] font-semibold">
          <button
            onClick={() => {
              setActiveTab('google_admin');
              setErrorMessage(null);
            }}
            className={`py-2 px-1 rounded-lg transition-all text-center ${
              activeTab === 'google_admin'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Admin
          </button>

          <button
            onClick={() => {
              setActiveTab('staff_login');
              setErrorMessage(null);
            }}
            className={`py-2 px-1 rounded-lg transition-all text-center ${
              activeTab === 'staff_login'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1,000 Staff Sign In
          </button>

          <button
            onClick={() => {
              setActiveTab('admin_creds');
              setErrorMessage(null);
            }}
            className={`py-2 px-1 rounded-lg transition-all text-center ${
              activeTab === 'admin_creds'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin Password
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-600 text-rose-200 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: Google Admin Sign Up / Sign In */}
        {activeTab === 'google_admin' && (
          <div className="space-y-4 py-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Admin Panel Access</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Sign in with your Google Account for instant administrator privileges across all 5 clinics and 1,000 staff members.
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 border border-slate-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google (r96662010@gmail.com)</span>
            </button>
          </div>
        )}

        {/* Tab 2: 1,000 Staff Sign In */}
        {activeTab === 'staff_login' && (
          <form onSubmit={handleStaffSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Staff ID or Work Email *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PHY-0001, PHY-0042, or therapist email"
                value={staffIdInput}
                onChange={(e) => setStaffIdInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Available range: PHY-0001 to PHY-1000
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openResetPasswordModal();
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Forgot / Reset Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Standard demo staff password is <code className="text-slate-300">password123</code> (or custom reset password)
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Staff Sign In</span>
            </button>

            {/* Quick Demo Switcher */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Or 1-Click Sign In as Sample Staff:
              </span>
              <div className="space-y-1.5">
                {demoStaffMembers.map(staff => (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => {
                      quickSwitchStaff(staff);
                      onClose();
                    }}
                    className="w-full px-3 py-2 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 text-left flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-white">{staff.fullName}</span>
                      <span className="text-slate-400 text-[11px] ml-1.5">({staff.specialty})</span>
                    </div>
                    <span className="font-mono text-teal-400 font-bold text-[10px]">{staff.staffId}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Tab 3: Admin Email & Password */}
        {activeTab === 'admin_creds' && (
          <form onSubmit={handleAdminCredsSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Email Address *
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openResetPasswordModal();
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Reset Master Password
                </button>
              </div>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Sign In</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
