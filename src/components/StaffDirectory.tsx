import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StaffMember } from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  KeyRound, 
  LogIn, 
  Download, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  Stethoscope, 
  Phone, 
  Mail,
  UserCheck
} from 'lucide-react';

interface StaffDirectoryProps {
  onOpenResetPassword: (staffId?: string) => void;
  onNavigateToVisits: () => void;
}

export const StaffDirectory: React.FC<StaffDirectoryProps> = ({
  onOpenResetPassword,
  onNavigateToVisits
}) => {
  const { 
    staffList, 
    clinics, 
    quickSwitchStaff, 
    currentUser, 
    exportToCsv,
    updateStaffStatus 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [clinicFilter, setClinicFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      // Clinic filter
      if (clinicFilter !== 'all' && s.clinicId !== clinicFilter) return false;
      // Specialty filter
      if (specialtyFilter !== 'all' && s.specialty !== specialtyFilter) return false;
      // Status filter
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = s.staffId.toLowerCase().includes(query);
        const matchesName = s.fullName.toLowerCase().includes(query);
        const matchesEmail = s.email.toLowerCase().includes(query);
        const matchesLicense = s.licenseNumber.toLowerCase().includes(query);
        const matchesPhone = s.phone.includes(query);
        return matchesId || matchesName || matchesEmail || matchesLicense || matchesPhone;
      }

      return true;
    });
  }, [staffList, clinicFilter, specialtyFilter, statusFilter, searchQuery]);

  // Pagination calculation
  const totalItems = filteredStaff.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedStaff = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return filteredStaff.slice(start, start + pageSize);
  }, [filteredStaff, validCurrentPage, pageSize]);

  const handleSimulateLogin = (staff: StaffMember) => {
    quickSwitchStaff(staff);
    setFeedbackMsg(`Successfully signed in as therapist ${staff.fullName} (${staff.staffId})`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const getStatusBadge = (status: StaffMember['status']) => {
    switch (status) {
      case 'on_duty':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> On Duty</span>;
      case 'in_visit':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-950 text-teal-300 border border-teal-800"><span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> In Visit</span>;
      case 'on_break':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> On Break</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Off Duty</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Bulk Tools */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">1,000 Staff Directory & Credential Controls</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise database containing all 1,000 physiotherapists. Reset passwords, assign clinics, and simulate staff sign-in.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenResetPassword()}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition-all"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Reset Any Staff Password
          </button>

          <button
            onClick={() => exportToCsv('staff_roster')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            Export 1,000 Roster (CSV)
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMsg}</span>
          </div>
          <button 
            onClick={onNavigateToVisits} 
            className="text-emerald-300 hover:text-white underline font-semibold"
          >
            Log Visit Now &rarr;
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Staff ID (e.g. PHY-0042), Name, Email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
            />
          </div>

          {/* Clinic Filter */}
          <div>
            <select
              value={clinicFilter}
              onChange={(e) => {
                setClinicFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Clinics (5)</option>
              {clinics.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div>
            <select
              value={specialtyFilter}
              onChange={(e) => {
                setSpecialtyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Specialties</option>
              <option value="Orthopedic Physical Therapy">Orthopedic PT</option>
              <option value="Sports Rehabilitation">Sports Rehab</option>
              <option value="Neurological Rehabilitation">Neurological</option>
              <option value="Pediatric Physiotherapy">Pediatric</option>
              <option value="Geriatric Rehabilitation">Geriatric</option>
              <option value="Spine & Manual Therapy">Spine & Manual</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="on_duty">On Duty</option>
              <option value="in_visit">In Visit</option>
              <option value="on_break">On Break</option>
              <option value="off_duty">Off Duty</option>
            </select>
          </div>

        </div>

        {/* Results Count & Quick Reset indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>
            Showing <strong className="text-white">{filteredStaff.length}</strong> of 1,000 staff members
            {searchQuery && ` matching "${searchQuery}"`}
          </span>

          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Staff ID</th>
                <th className="py-3 px-4">Physiotherapist</th>
                <th className="py-3 px-4">Assigned Clinic & Address</th>
                <th className="py-3 px-4">Specialty & License</th>
                <th className="py-3 px-4">Live Status</th>
                <th className="py-3 px-4">Today Visits</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedStaff.map((staff) => {
                const clinic = clinics.find(c => c.id === staff.clinicId);
                const isCurrent = currentUser.staffId === staff.staffId;

                return (
                  <tr 
                    key={staff.id} 
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isCurrent ? 'bg-teal-950/20 border-l-2 border-l-teal-400' : ''
                    }`}
                  >
                    {/* Staff ID */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-teal-400">
                      {staff.staffId}
                    </td>

                    {/* Physiotherapist Name & Email */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {staff.fullName}
                        {isCurrent && (
                          <span className="text-[9px] bg-teal-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {staff.email}
                      </div>
                    </td>

                    {/* Clinic & Address */}
                    <td className="py-3 px-4 max-w-[240px]">
                      <div className="font-medium text-slate-200 truncate">{clinic?.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{clinic?.address}</div>
                    </td>

                    {/* Specialty & License */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-300 font-medium">{staff.specialty}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{staff.licenseNumber}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(staff.status)}
                    </td>

                    {/* Today Visits */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md">
                        {staff.visitsCompletedToday}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-right space-x-1.5">
                      {/* Reset Password */}
                      <button
                        onClick={() => onOpenResetPassword(staff.staffId)}
                        title={`Reset password for ${staff.fullName}`}
                        className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 transition-all inline-flex items-center gap-1 text-[11px] font-medium"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span className="hidden xl:inline">Reset PW</span>
                      </button>

                      {/* Simulate Sign In */}
                      <button
                        onClick={() => handleSimulateLogin(staff)}
                        title={`Sign in as ${staff.fullName} (${staff.staffId})`}
                        className="p-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-lg border border-teal-500/30 transition-all inline-flex items-center gap-1 text-[11px] font-medium"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span className="hidden xl:inline">Sign In</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Navigation */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Page <strong className="text-white">{validCurrentPage}</strong> of{' '}
            <strong className="text-white">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={validCurrentPage <= 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            {/* Quick jump to page */}
            <div className="hidden sm:flex items-center gap-1">
              {[1, 2, 3, 10, 25, 50].filter(p => p <= totalPages).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded text-xs font-semibold ${
                    validCurrentPage === p 
                      ? 'bg-teal-500 text-slate-950' 
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage >= totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
