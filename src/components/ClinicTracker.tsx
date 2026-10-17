import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clinic } from '../types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  Activity, 
  ShieldCheck, 
  Navigation, 
  CheckCircle2, 
  ExternalLink,
  Stethoscope
} from 'lucide-react';

export const ClinicTracker: React.FC = () => {
  const { 
    clinics, 
    staffList, 
    visits, 
    attendance, 
    selectedClinicId, 
    setSelectedClinicId 
  } = useApp();

  const [activeClinicCard, setActiveClinicCard] = useState<string>(
    selectedClinicId !== 'all' ? selectedClinicId : clinics[0].id
  );

  const selectedClinic = clinics.find(c => c.id === activeClinicCard) || clinics[0];

  // Clinic specific metrics
  const clinicStaff = staffList.filter(s => s.clinicId === selectedClinic.id);
  const onDutyCount = clinicStaff.filter(s => s.status === 'on_duty' || s.status === 'in_visit').length;
  const clinicVisits = visits.filter(v => v.clinicId === selectedClinic.id);
  const clinicAttendance = attendance.filter(a => a.clinicId === selectedClinic.id);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Multi-Clinic Geofence & Real-Time Activity Tracking</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status monitoring, physical address geofencing (150m-250m radius), and on-site staff presence across all 5 clinical branches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            All 5 Clinic Networks Online
          </span>
        </div>
      </div>

      {/* Clinic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {clinics.map((clinic) => {
          const isSelected = clinic.id === activeClinicCard;
          const staffTotal = staffList.filter(s => s.clinicId === clinic.id);
          const activeNow = staffTotal.filter(s => s.status === 'on_duty' || s.status === 'in_visit').length;
          const visitCount = visits.filter(v => v.clinicId === clinic.id).length;

          return (
            <button
              key={clinic.id}
              onClick={() => {
                setActiveClinicCard(clinic.id);
                setSelectedClinicId(clinic.id);
              }}
              className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-teal-500 ring-2 ring-teal-500/20 shadow-lg'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                    {clinic.code}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 mb-1">
                  {clinic.name}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  {clinic.city}, {clinic.state}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-semibold">{activeNow} Active</span>
                <span className="text-teal-400 font-bold">{visitCount} Visits</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Clinic In-Depth Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Clinic Details & Map Simulation (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedClinic.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-mono border border-teal-500/30">
                  {selectedClinic.code}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{selectedClinic.address}, {selectedClinic.city}, {selectedClinic.state} {selectedClinic.zip}</span>
              </p>
            </div>

            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
              Operational
            </span>
          </div>

          {/* Interactive Radar Map Simulation */}
          <div className="relative h-64 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Grid styling */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
            
            {/* Radar concentric circles */}
            <div className="absolute w-48 h-48 rounded-full border border-teal-500/20 animate-ping pointer-events-none" />
            <div className="absolute w-36 h-36 rounded-full border border-teal-500/30" />
            <div className="absolute w-20 h-20 rounded-full border border-teal-500/40 bg-teal-500/5" />

            {/* Center Clinic Marker */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="p-2.5 rounded-full bg-teal-500 text-slate-950 shadow-xl shadow-teal-500/50 flex items-center justify-center animate-bounce">
                <MapPin className="w-5 h-5 text-slate-950 fill-current" />
              </div>
              <div className="mt-2 bg-slate-900/90 backdrop-blur px-3 py-1 rounded-lg border border-teal-500/40 text-center shadow-lg">
                <div className="text-xs font-bold text-white">{selectedClinic.name}</div>
                <div className="text-[10px] text-teal-300 font-mono">
                  {selectedClinic.latitude.toFixed(4)}° N, {Math.abs(selectedClinic.longitude).toFixed(4)}° W
                </div>
              </div>
            </div>

            {/* Geofence status tag */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] text-slate-300 flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-teal-400" />
              <span>Geofence Boundary: <strong>{selectedClinic.geofenceRadiusMeters} meters</strong></span>
            </div>

            <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>GPS Stamp Verified</span>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Director</span>
              <span className="text-white font-medium truncate block">{selectedClinic.managerName}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Telephone</span>
              <span className="text-white font-medium truncate block">{selectedClinic.phone}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Hours</span>
              <span className="text-white font-medium truncate block">{selectedClinic.operatingHours}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Assigned PTs</span>
              <span className="text-teal-400 font-bold block">{clinicStaff.length} Licensed</span>
            </div>
          </div>
        </div>

        {/* Right: Live Activity Stream at this Clinic (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              Live Activity at {selectedClinic.code}
            </h3>
            <span className="text-xs text-slate-400">
              {onDutyCount} therapists on site
            </span>
          </div>

          {/* Visits at this clinic */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Today's Patients Treated Here ({clinicVisits.length})
            </div>

            {clinicVisits.length === 0 ? (
              <div className="text-xs text-slate-500 py-6 text-center">
                No patient visits logged at this clinic yet today.
              </div>
            ) : (
              clinicVisits.map((v) => (
                <div key={v.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{v.patientName}</span>
                    <span className="text-[10px] font-mono text-teal-400">{v.patientMrn}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] font-medium">{v.condition}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>PT: {v.staffName} ({v.staffId})</span>
                    <span className="text-emerald-400 font-semibold">Pain: -{v.painBefore - v.painAfter} pts</span>
                  </div>
                </div>
              ))
            )}

            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-800">
              Staff Attendance Punches Here ({clinicAttendance.length})
            </div>

            {clinicAttendance.map((a) => (
              <div key={a.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-medium text-slate-200">{a.staffName} ({a.staffId})</div>
                  <div className="text-[10px] text-slate-400">{a.timestamp} • {a.notes}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-teal-300">
                  {a.action.toUpperCase().replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
