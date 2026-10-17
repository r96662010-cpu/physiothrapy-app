import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceAction } from '../types';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Coffee, 
  LogOut, 
  LogIn, 
  FileSpreadsheet, 
  Download, 
  Search, 
  Navigation, 
  ShieldCheck, 
  Sparkles,
  Users
} from 'lucide-react';

export const AttendancePortal: React.FC = () => {
  const { 
    currentUser, 
    clinics, 
    attendance, 
    punchAttendance, 
    googleSheetConfig, 
    exportToCsv,
    staffList
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedClinicId, setSelectedClinicId] = useState(currentUser.clinicId || clinics[0].id);
  const [notes, setNotes] = useState('');
  const [isPunching, setIsPunching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [punchSuccessNotice, setPunchSuccessNotice] = useState<string | null>(null);
  
  // Table search & filter
  const [tableSearch, setTableSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterClinic, setFilterClinic] = useState('all');

  // Live digital clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentClinic = clinics.find(c => c.id === selectedClinicId) || clinics[0];

  // Current user's last punch
  const userPunches = attendance.filter(a => a.staffId === (currentUser.staffId || 'PHY-0001'));
  const lastPunch = userPunches[0];

  // Geolocation lookup
  const handleDetectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
        },
        () => {
          setGpsCoords({ lat: currentClinic.latitude, lng: currentClinic.longitude });
          setIsLocating(false);
        },
        { timeout: 6000 }
      );
    } else {
      setGpsCoords({ lat: currentClinic.latitude, lng: currentClinic.longitude });
      setIsLocating(false);
    }
  };

  const handleAction = async (action: AttendanceAction) => {
    setIsPunching(true);
    const coords = gpsCoords || { latitude: currentClinic.latitude, longitude: currentClinic.longitude };
    const address = `${currentClinic.address}, ${currentClinic.city}, ${currentClinic.state} ${currentClinic.zip}`;

    await punchAttendance(
      action,
      currentClinic.id,
      address,
      coords,
      notes.trim() || `Verified at ${currentClinic.name}`
    );

    setIsPunching(false);
    setNotes('');
    setPunchSuccessNotice(`Successfully recorded ${action.toUpperCase().replace('_', ' ')}! Attached to Google Sheet.`);
    setTimeout(() => setPunchSuccessNotice(null), 4000);
  };

  // Quick simulation: simulate check-in for 5 random staff members from the 1000 list
  const handleSimulateMultiStaffCheckIn = async () => {
    const randomStaffMembers = staffList.slice(10, 15);
    for (const staff of randomStaffMembers) {
      const c = clinics[Math.floor(Math.random() * clinics.length)];
      await punchAttendance(
        'check_in',
        c.id,
        `${c.address}, ${c.city}, ${c.state}`,
        { latitude: c.latitude, longitude: c.longitude },
        `Simulated shift punch for ${staff.fullName} (${staff.staffId})`
      );
    }
    setPunchSuccessNotice('Simulated 5 active therapist check-ins across multiple clinic locations.');
    setTimeout(() => setPunchSuccessNotice(null), 4000);
  };

  // Filtered attendance records
  const filteredAttendance = attendance.filter(a => {
    if (filterAction !== 'all' && a.action !== filterAction) return false;
    if (filterClinic !== 'all' && a.clinicId !== filterClinic) return false;
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase().trim();
      return (
        a.staffName.toLowerCase().includes(q) ||
        a.staffId.toLowerCase().includes(q) ||
        a.clinicName.toLowerCase().includes(q) ||
        a.verifiedAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Attached Attendance Sheet & Geofenced Time Clock</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-clinic staff check-in with GPS address confirmation, shift hour logging, and automatic Google Sheet row appending.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSimulateMultiStaffCheckIn}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
            title="Populate test check-ins from 1,000 staff roster"
          >
            <Users className="w-3.5 h-3.5 text-teal-400" />
            Simulate 5 Staff Check-Ins
          </button>

          <button
            onClick={() => exportToCsv('attendance')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            Export Attendance (CSV)
          </button>
        </div>
      </div>

      {punchSuccessNotice && (
        <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{punchSuccessNotice}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
            Google Sheet Attached
          </span>
        </div>
      )}

      {/* Main Grid: Interactive Punch Terminal & Attached Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Punch Terminal (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Therapist Punch Terminal
            </h3>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {currentUser.staffId ? `ID: ${currentUser.staffId}` : 'Admin Mode'}
            </span>
          </div>

          {/* Big Digital Clock Card */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-center space-y-1">
            <div className="text-3xl font-extrabold font-mono text-teal-400 tracking-wider">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {lastPunch && (
              <div className="mt-3 pt-3 border-t border-slate-900 text-xs text-slate-300">
                Last Status: <strong className="text-teal-400 uppercase">{lastPunch.action.replace('_', ' ')}</strong> at {lastPunch.timestamp}
              </div>
            )}
          </div>

          {/* Location & Clinic Selector */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Clinic Facility for Punch *
              </label>
              <select
                value={selectedClinicId}
                onChange={(e) => setSelectedClinicId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {clinics.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Address & GPS Geofence details */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-1.5 min-w-0">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">{currentClinic.address}</div>
                    <div className="text-[11px] text-slate-400">
                      {currentClinic.city}, {currentClinic.state} {currentClinic.zip}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="shrink-0 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded text-[11px] font-medium flex items-center gap-1"
                >
                  <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>GPS Geofence</span>
                </button>
              </div>

              <div className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900/50 flex items-center justify-between">
                <span>Verified: In-Facility Radius (150m)</span>
                <span>Lat: {currentClinic.latitude} | Lng: {currentClinic.longitude}</span>
              </div>
            </div>

            {/* Shift Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Shift Note / Station (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Inpatient Ortho rounds, Outpatient Gym..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Check In */}
            <button
              onClick={() => handleAction('check_in')}
              disabled={isPunching}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>Punch Check-In</span>
            </button>

            {/* Check Out */}
            <button
              onClick={() => handleAction('check_out')}
              disabled={isPunching}
              className="py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Punch Check-Out</span>
            </button>

            {/* Break Start */}
            <button
              onClick={() => handleAction('break_start')}
              disabled={isPunching}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Start Break</span>
            </button>

            {/* Break End */}
            <button
              onClick={() => handleAction('break_end')}
              disabled={isPunching}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>End Break</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-2 border-t border-slate-800">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Punches automatically append to attached Google Sheet tab: <strong className="text-white">{googleSheetConfig.attendanceSheetName}</strong></span>
          </div>

        </div>

        {/* Right Column: Attached Attendance Sheet Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Attached Attendance Sheet Log
              </h3>
              <p className="text-[11px] text-slate-400">
                Connected to Google Sheet: {googleSheetConfig.attendanceSheetName}
              </p>
            </div>

            <span className="text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              {filteredAttendance.length} records
            </span>
          </div>

          {/* Search & Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search staff, ID, clinic..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Punch Actions</option>
              <option value="check_in">Check-Ins</option>
              <option value="check_out">Check-Outs</option>
              <option value="break_start">Break Starts</option>
              <option value="break_end">Break Ends</option>
            </select>

            <select
              value={filterClinic}
              onChange={(e) => setFilterClinic(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Clinics (5)</option>
              {clinics.map(c => (
                <option key={c.id} value={c.id}>{c.code}</option>
              ))}
            </select>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Staff Member</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Clinic & Address</th>
                  <th className="py-2.5 px-3 text-right">Google Sheet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="font-semibold text-white">{rec.timestamp}</div>
                      <div className="text-[10px] text-slate-400">{rec.date}</div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="font-medium text-slate-200">{rec.staffName}</div>
                      <div className="text-[10px] font-mono text-teal-400">{rec.staffId}</div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {rec.action === 'check_in' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          CHECK IN
                        </span>
                      )}
                      {rec.action === 'check_out' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          CHECK OUT
                        </span>
                      )}
                      {rec.action === 'break_start' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          BREAK START
                        </span>
                      )}
                      {rec.action === 'break_end' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800">
                          BREAK END
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 max-w-[220px]">
                      <div className="font-medium text-slate-200 truncate">{rec.clinicName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{rec.verifiedAddress}</div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap text-right">
                      {rec.syncedToGoogleSheet ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3" /> Attached
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                          Queued
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Every punch logs verified GPS coordinates and clinic address stamp</span>
            <button
              onClick={() => exportToCsv('attendance')}
              className="text-teal-400 hover:text-teal-300 font-semibold"
            >
              Download Full Sheet (.CSV)
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
