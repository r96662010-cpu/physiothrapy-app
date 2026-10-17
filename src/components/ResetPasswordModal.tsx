import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  KeyRound, 
  X, 
  CheckCircle2, 
  Copy, 
  Sparkles, 
  ShieldAlert, 
  Search, 
  UserCheck, 
  Lock,
  ArrowRight
} from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStaffId?: string;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  preselectedStaffId,
}) => {
  const { staffList, resetStaffPassword, resetAdminPassword, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'staff_reset' | 'admin_self'>('staff_reset');
  const [selectedStaffId, setSelectedStaffId] = useState(preselectedStaffId || 'PHY-0001');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [newPassword, setNewPassword] = useState('PhysioCare2026!');
  const [adminCurrentPass, setAdminCurrentPass] = useState('');
  const [adminNewPass, setAdminNewPass] = useState('');
  const [copied, setCopied] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    if (preselectedStaffId) {
      setSelectedStaffId(preselectedStaffId);
      setActiveTab('staff_reset');
    }
  }, [preselectedStaffId]);

  if (!isOpen) return null;

  const currentSelectedStaff = staffList.find(s => s.staffId === selectedStaffId);

  // Generate random secure password
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleStaffResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;

    const res = resetStaffPassword(selectedStaffId, newPassword);
    setResultMsg({ success: res.success, text: res.message });
  };

  const handleAdminSelfResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewPass) return;

    const res = resetAdminPassword(adminNewPass);
    setResultMsg({ success: res.success, text: res.message });
    setAdminCurrentPass('');
    setAdminNewPass('');
  };

  // Filtered staff list for search inside modal
  const filteredModalStaff = staffList
    .filter(s => {
      if (!staffSearchQuery.trim()) return true;
      const q = staffSearchQuery.toLowerCase().trim();
      return s.staffId.toLowerCase().includes(q) || s.fullName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    })
    .slice(0, 20);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Password & Credential Reset</h3>
              <p className="text-xs text-slate-400">
                Admin master control for all 1,000 staff accounts and administrator credentials
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
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('staff_reset');
              setResultMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'staff_reset'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reset Staff Password (1,000 Staff)
          </button>

          <button
            onClick={() => {
              setActiveTab('admin_self');
              setResultMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'admin_self'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin Master Password Reset
          </button>
        </div>

        {/* Result notification */}
        {resultMsg && (
          <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
            resultMsg.success 
              ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200' 
              : 'bg-rose-950/80 border-rose-600 text-rose-200'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{resultMsg.text}</p>
              {activeTab === 'staff_reset' && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-300">Staff can now sign in using this new password.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 1: Staff Reset */}
        {activeTab === 'staff_reset' ? (
          <form onSubmit={handleStaffResetSubmit} className="space-y-4">
            
            {/* Staff Search / Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Staff Member (Search 1,000 staff roster)
              </label>

              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Type Staff ID (e.g. PHY-0042) or Name..."
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {filteredModalStaff.map(s => (
                  <option key={s.id} value={s.staffId}>
                    {s.staffId} - {s.fullName} ({s.specialty})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Staff Card */}
            {currentSelectedStaff && (
              <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{currentSelectedStaff.fullName}</span>
                    <span className="font-mono text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded border border-teal-500/20 text-[10px]">
                      {currentSelectedStaff.staffId}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{currentSelectedStaff.email}</div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Lic: {currentSelectedStaff.licenseNumber}
                </span>
              </div>
            )}

            {/* New Password & Generator */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  New Password to Assign *
                </label>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Generate Strong Password
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-20 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute right-1.5 top-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Confirm & Reset Password by Admin</span>
            </button>

          </form>
        ) : (
          /* Tab 2: Admin Self Reset */
          <form onSubmit={handleAdminSelfResetSubmit} className="space-y-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block mb-1">Admin Account:</span>
              <span className="text-white font-semibold font-mono">{currentUser.email || 'r96662010@gmail.com'}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter current password..."
                value={adminCurrentPass}
                onChange={(e) => setAdminCurrentPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Master Admin Password *
              </label>
              <input
                type="password"
                required
                placeholder="Enter new strong password..."
                value={adminNewPass}
                onChange={(e) => setAdminNewPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Update Admin Master Password</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
