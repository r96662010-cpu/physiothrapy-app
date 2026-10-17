import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Activity, 
  Clock, 
  FileSpreadsheet, 
  MapPin, 
  ArrowUpRight, 
  CheckCircle2, 
  KeyRound, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Download, 
  Plus, 
  ShieldCheck, 
  Stethoscope,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: 'dashboard' | 'visits' | 'attendance' | 'staff' | 'clinics') => void;
  openGoogleSheetModal: () => void;
  openResetPasswordModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  openGoogleSheetModal,
  openResetPasswordModal,
}) => {
  const { 
    currentUser,
    clinics, 
    staffList, 
    visits, 
    attendance, 
    googleSheetConfig, 
    exportToCsv,
    activeStaffCount,
    visitsTodayCount
  } = useApp();

  // Statistics
  const onDutyCount = staffList.filter(s => s.status === 'on_duty').length;
  const inVisitCount = staffList.filter(s => s.status === 'in_visit').length;
  const onBreakCount = staffList.filter(s => s.status === 'on_break').length;
  const offDutyCount = staffList.filter(s => s.status === 'off_duty').length;

  // Real-time blended timeline (last 8 actions)
  const recentActivities = [
    ...visits.map(v => ({
      id: v.id,
      type: 'visit' as const,
      title: `${v.staffName} (${v.staffId}) completed ${v.visitType}`,
      subtitle: `Patient: ${v.patientName} (${v.patientMrn}) • ${v.condition}`,
      clinic: v.clinicName,
      address: v.verifiedAddress,
      time: v.timestamp,
      painDelta: v.painBefore - v.painAfter,
      synced: v.syncedToGoogleSheet
    })),
    ...attendance.map(a => ({
      id: a.id,
      type: 'attendance' as const,
      title: `${a.staffName} (${a.staffId}) - ${a.action.toUpperCase().replace('_', ' ')}`,
      subtitle: a.notes || `Shift status verified via Geofence`,
      clinic: a.clinicName,
      address: a.verifiedAddress,
      time: `${a.date} ${a.timestamp}`,
      painDelta: null,
      synced: a.syncedToGoogleSheet
    }))
  ].slice(0, 10);

  return (
    <div className="space-y-6">
      
      {/* Banner / Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 md:p-8 border border-slate-700/60 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Central Physiotherapy Network Command
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Real-Time Clinic & Staff Management
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monitoring 1,000 licensed physiotherapists across 5 specialized rehabilitation centers. Live visit reporting with attached Google Sheets synchronization and GPS address verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('visits')}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Log Daily Visit
            </button>

            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl border border-slate-600 transition-all"
            >
              <Clock className="w-4 h-4 text-teal-400" />
              Attendance Clock
            </button>

            <button
              onClick={openGoogleSheetModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 font-medium text-xs rounded-xl border border-emerald-500/40 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Attached Sheet
            </button>
          </div>
        </div>

        {/* Decorative background grid element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Staff */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Staffing</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">1,000</span>
              <span className="text-xs text-slate-400">Licensed PTs</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800/80 pt-2.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{onDutyCount + inVisitCount} Active</span>
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">{onBreakCount} Break</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">{offDutyCount} Off</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Visits Today */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visits Logged Today</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{visitsTodayCount}</span>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> 100% Verified
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
              <span>Avg Pain Drop: <strong className="text-teal-400">-4.2 pts</strong></span>
              <button 
                onClick={() => onNavigate('visits')}
                className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-0.5"
              >
                Logs <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Clinics & Addresses */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clinics & Addresses</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{clinics.length}</span>
              <span className="text-xs text-slate-400">Active Facilities</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
              <span className="truncate max-w-[170px]">GPS Geofence: Active</span>
              <button 
                onClick={() => onNavigate('clinics')}
                className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-0.5"
              >
                Map <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Metric 4: Google Sheet Attached */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attached Google Sheet</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-white truncate max-w-[180px]">
                {googleSheetConfig.attendanceSheetName}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800/80 pt-2.5">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Webhook Sync
              </span>
              <button 
                onClick={openGoogleSheetModal}
                className="text-emerald-400 hover:text-emerald-300 text-xs font-medium"
              >
                Configure
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Action Strip for Admin Controls */}
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Staff Credential & Access Management</h4>
            <p className="text-xs text-slate-400">
              Admin authority to reset passwords for any of the 1,000 registered staff therapists.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openResetPasswordModal}
            className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Reset Staff Password
          </button>

          <button
            onClick={() => exportToCsv('attendance')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            Attendance CSV
          </button>

          <button
            onClick={() => exportToCsv('visits')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Visits CSV
          </button>
        </div>
      </div>

      {/* Main Two-Column View: Real-Time Activity Feed + Clinic Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Real-time Activity Feed Across All Clinics (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-400 animate-ping"></div>
              <h3 className="text-base font-bold text-white">Real-Time Activity Stream Across All Clinics</h3>
            </div>
            <span className="text-xs text-slate-400">
              Live updates with verified addresses
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentActivities.map((act) => (
              <div key={act.id} className="py-3.5 flex items-start justify-between gap-3 group hover:bg-slate-800/30 px-2 rounded-lg transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                    act.type === 'visit' 
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {act.type === 'visit' ? <Stethoscope className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{act.title}</span>
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-slate-300 rounded border border-slate-700">
                        {act.clinic}
                      </span>
                      {act.painDelta !== null && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50 rounded">
                          Pain: -{act.painDelta} pts
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300">{act.subtitle}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                        <span className="truncate max-w-[280px] sm:max-w-md">{act.address}</span>
                      </span>
                      <span>•</span>
                      <span>{act.time}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {act.synced ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      <CheckCircle2 className="w-3 h-3" />
                      Synced to Sheet
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      Pending Sync
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate('visits')}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold py-1.5 px-3 rounded-lg hover:bg-slate-800 transition-all inline-flex items-center gap-1"
            >
              View Full Clinical Visit History <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Multi-Clinic Status & Addresses (1 col) */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                Clinics & Geofences
              </h3>
              <button
                onClick={() => onNavigate('clinics')}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium"
              >
                View Map
              </button>
            </div>

            <div className="space-y-3">
              {clinics.map((clinic) => {
                const clinicStaff = staffList.filter(s => s.clinicId === clinic.id);
                const onSite = clinicStaff.filter(s => s.status === 'on_duty' || s.status === 'in_visit').length;
                const clinicVisits = visits.filter(v => v.clinicId === clinic.id).length;

                return (
                  <div key={clinic.id} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white">{clinic.name}</h4>
                        <p className="text-[11px] text-teal-400 font-medium">{clinic.code}</p>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-500/10 text-teal-300 rounded border border-teal-500/20">
                        {onSite} On-Site
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                      <span>{clinic.address}, {clinic.city}, {clinic.state} {clinic.zip}</span>
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-400">
                      <span>Director: {clinic.managerName}</span>
                      <span className="text-emerald-400 font-semibold">{clinicVisits} Visits Today</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Staff Roster summary teaser */}
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">1,000 Staff Capacity</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every staff member is indexed with unique ID (PHY-0001 to PHY-1000), assigned clinic, specialty, and individual password credentials.
            </p>
            <button
              onClick={() => onNavigate('staff')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <Users className="w-4 h-4 text-teal-400" />
              Open 1,000 Staff Directory
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
