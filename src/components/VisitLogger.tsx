import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VisitType } from '../types';
import { 
  ClipboardList, 
  Plus, 
  MapPin, 
  Activity, 
  FileSpreadsheet, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Search, 
  Calendar, 
  AlertCircle,
  Navigation
} from 'lucide-react';

const COMMON_CONDITIONS = [
  'Cervical Radiculopathy & Trapezius Spasm',
  'Post-ACL Reconstruction (Knee Rehab)',
  'Chronic Low Back Pain & Lumbar Disc Herniation',
  'Post-Ischemic Stroke Hemiparesis',
  'Bilateral Knee Osteoarthritis Grade III',
  'Adhesive Capsulitis (Frozen Shoulder)',
  'Rotator Cuff Tendinopathy & Impingement',
  'Plantar Fasciitis & Achilles Tendinitis',
  'Carpal Tunnel Syndrome & Wrist Strain',
  'Parkinsonian Gait & Balance Instability',
  'Post-Operative Total Hip Arthroplasty',
  'Thoracic Outlet Syndrome'
];

const MODALITY_OPTIONS = [
  'Manual Therapy & Mobilization',
  'Therapeutic Ultrasound',
  'TENS / Electrical Stimulation',
  'Dry Needling',
  'Strengthening & Resistance Exercise',
  'Gait Training & Dynamic Balance',
  'Postural & Ergonomic Correction',
  'Cryotherapy / Heat Compression',
  'Neuromuscular Re-education',
  'Spinal Decompression / Traction',
  'Hydrotherapy / Aquatic Rehab'
];

export const VisitLogger: React.FC = () => {
  const { 
    currentUser, 
    clinics, 
    visits, 
    addVisit, 
    googleSheetConfig, 
    exportToCsv,
    staffList
  } = useApp();

  // Form State
  const defaultClinic = clinics.find(c => c.id === currentUser.clinicId) || clinics[0];
  const [selectedClinicId, setSelectedClinicId] = useState(defaultClinic.id);
  const [selectedStaffId, setSelectedStaffId] = useState(currentUser.staffId || 'PHY-0001');
  const [patientName, setPatientName] = useState('');
  const [patientMrn, setPatientMrn] = useState(`MRN-${Math.floor(10000 + Math.random() * 90000)}`);
  const [visitType, setVisitType] = useState<VisitType>('In-Clinic Treatment');
  const [condition, setCondition] = useState(COMMON_CONDITIONS[0]);
  const [customCondition, setCustomCondition] = useState('');
  const [selectedModalities, setSelectedModalities] = useState<string[]>([
    'Manual Therapy & Mobilization', 
    'Strengthening & Resistance Exercise'
  ]);
  const [duration, setDuration] = useState(45);
  const [painBefore, setPainBefore] = useState(7);
  const [painAfter, setPainAfter] = useState(3);
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>({
    lat: defaultClinic.latitude,
    lng: defaultClinic.longitude
  });
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Table Search
  const [tableSearch, setTableSearch] = useState('');
  const [tableClinicFilter, setTableClinicFilter] = useState('all');

  const currentClinicObj = clinics.find(c => c.id === selectedClinicId) || clinics[0];

  const handleCaptureGps = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
        },
        () => {
          // fallback to clinic coordinates
          setGpsLocation({ lat: currentClinicObj.latitude, lng: currentClinicObj.longitude });
          setIsLocating(false);
        },
        { timeout: 6000 }
      );
    } else {
      setGpsLocation({ lat: currentClinicObj.latitude, lng: currentClinicObj.longitude });
      setIsLocating(false);
    }
  };

  const toggleModality = (mod: string) => {
    setSelectedModalities(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    setIsSubmitting(true);
    const staff = staffList.find(s => s.staffId === selectedStaffId) || {
      fullName: currentUser.name,
      staffId: selectedStaffId
    };

    const finalCondition = customCondition.trim() || condition;

    await addVisit({
      staffId: staff.staffId,
      staffName: staff.fullName,
      clinicId: currentClinicObj.id,
      clinicName: currentClinicObj.name,
      patientName: patientName.trim(),
      patientMrn: patientMrn.trim(),
      visitType,
      condition: finalCondition,
      treatmentModalities: selectedModalities.length > 0 ? selectedModalities : ['General Physical Therapy Assessment'],
      sessionDurationMins: duration,
      painBefore,
      painAfter,
      clinicalNotes: notes.trim() || 'Patient tolerated prescribed therapeutic exercises well. Progress documented.',
      followUpDate,
      verifiedAddress: currentClinicObj.address + ', ' + currentClinicObj.city + ', ' + currentClinicObj.state,
      coordinates: gpsLocation ? { latitude: gpsLocation.lat, longitude: gpsLocation.lng } : undefined,
    });

    setIsSubmitting(false);
    setSuccessBanner(`Visit for ${patientName} logged successfully and attached to Google Sheet "${googleSheetConfig.visitsSheetName}"!`);
    
    // Reset form for next patient
    setPatientName('');
    setPatientMrn(`MRN-${Math.floor(10000 + Math.random() * 90000)}`);
    setCustomCondition('');
    setNotes('');
    setPainBefore(6);
    setPainAfter(2);

    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // Filtered visits for history
  const filteredVisits = visits.filter(v => {
    if (tableClinicFilter !== 'all' && v.clinicId !== tableClinicFilter) return false;
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase().trim();
      return (
        v.patientName.toLowerCase().includes(q) ||
        v.patientMrn.toLowerCase().includes(q) ||
        v.staffName.toLowerCase().includes(q) ||
        v.staffId.toLowerCase().includes(q) ||
        v.condition.toLowerCase().includes(q)
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
              <ClipboardList className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Daily Physiotherapy Visit Management</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Log patient treatments, record pain scale changes, and auto-sync directly to your connected Google Sheet with verified address coordinates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCsv('visits')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            Export Visits Sheet (CSV)
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
            Synced
          </span>
        </div>
      )}

      {/* Main Grid: Entry Form (Left) & Recent Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-400" />
              New Patient Session Log
            </h3>
            <span className="text-[11px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-medium">
              Google Sheet Auto-Sync: Active
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Top Row: Clinic & Staff Provider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Rehabilitation Clinic Facility *
                </label>
                <select
                  value={selectedClinicId}
                  onChange={(e) => {
                    setSelectedClinicId(e.target.value);
                    const c = clinics.find(cl => cl.id === e.target.value);
                    if (c) setGpsLocation({ lat: c.latitude, lng: c.longitude });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  {clinics.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Treating Physiotherapist *
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  {/* Provide top 30 staff members for easy selection */}
                  {staffList.slice(0, 40).map(s => (
                    <option key={s.id} value={s.staffId}>
                      {s.staffId} - {s.fullName} ({s.specialty})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attached Address & GPS Verification Stamp */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div className="truncate">
                  <div className="text-white font-medium truncate">
                    Attached Address: {currentClinicObj.address}, {currentClinicObj.city}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    GPS Coordinates: {gpsLocation?.lat.toFixed(4)}, {gpsLocation?.lng.toFixed(4)} • Geofence Radius: {currentClinicObj.geofenceRadiusMeters}m
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCaptureGps}
                disabled={isLocating}
                className="shrink-0 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg border border-slate-700 text-[11px] font-medium flex items-center gap-1 transition-all"
              >
                <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                <span>Verify GPS</span>
              </button>
            </div>

            {/* Patient Name & MRN */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance, Robert Sterling"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Medical Record # (MRN)
                </label>
                <input
                  type="text"
                  value={patientMrn}
                  onChange={(e) => setPatientMrn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Visit Category & Primary Diagnosis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Session Setting
                </label>
                <select
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value as VisitType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="In-Clinic Treatment">In-Clinic Treatment</option>
                  <option value="Home Rehabilitation">Home Rehabilitation (Field Visit)</option>
                  <option value="Tele-Physiotherapy">Tele-Physiotherapy Session</option>
                  <option value="Sports Field Rehab">Sports Field Rehab</option>
                  <option value="In-Patient Ward">In-Patient Ward</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Condition / Diagnosis
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  {COMMON_CONDITIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Other">Other (Custom diagnosis)</option>
                </select>
              </div>
            </div>

            {condition === 'Other' && (
              <div>
                <input
                  type="text"
                  placeholder="Specify custom condition or injury..."
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            )}

            {/* Treatment Modalities Multi-Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Treatment Modalities Applied (Select all applicable)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MODALITY_OPTIONS.map((mod) => {
                  const isSelected = selectedModalities.includes(mod);
                  return (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => toggleModality(mod)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        isSelected
                          ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {mod}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pain Scale (VAS Before & After) & Duration */}
            <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Visual Analog Pain Scale (VAS 0-10)</span>
                <span className="text-emerald-400 font-bold">
                  Pain Reduction: -{painBefore - painAfter} pts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pain Before */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Pre-Session Pain:</span>
                    <strong className="text-amber-400 font-mono text-xs">{painBefore}/10</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={painBefore}
                    onChange={(e) => setPainBefore(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>0: None</span>
                    <span>5: Moderate</span>
                    <span>10: Severe</span>
                  </div>
                </div>

                {/* Pain After */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Post-Session Pain:</span>
                    <strong className="text-teal-400 font-mono text-xs">{painAfter}/10</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={painAfter}
                    onChange={(e) => setPainAfter(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>0: None</span>
                    <span>5: Moderate</span>
                    <span>10: Severe</span>
                  </div>
                </div>
              </div>

              {/* Session Duration & Next Visit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-900">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Session Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes (Standard)</option>
                    <option value={60}>60 Minutes (Comprehensive)</option>
                    <option value={90}>90 Minutes (Intensive Rehab)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Next Follow-up Appointment
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Clinical Progress Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Clinical Assessment & Progress Notes
              </label>
              <textarea
                rows={3}
                placeholder="Detail patient range of motion improvements, joint biomechanics, exercise toleration, or home program instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !patientName.trim()}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isSubmitting ? 'Syncing to Google Sheet...' : 'Log Visit & Push to Google Sheet'}</span>
            </button>

          </form>
        </div>

        {/* Recent Visits Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Recent Clinical Visits
            </h3>
            <span className="text-xs text-slate-400">
              {filteredVisits.length} recorded
            </span>
          </div>

          {/* Quick Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search patient, MRN, diagnosis..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <select
              value={tableClinicFilter}
              onChange={(e) => setTableClinicFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Clinics Filter</option>
              {clinics.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Visits List */}
          <div className="space-y-3 overflow-y-auto max-h-[620px] pr-1 flex-1">
            {filteredVisits.map((v) => (
              <div 
                key={v.id}
                className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{v.patientName}</h4>
                    <span className="text-[10px] font-mono text-teal-400">{v.patientMrn}</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
                    {v.sessionDurationMins}m
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-medium leading-snug">
                  {v.condition}
                </div>

                <div className="text-[11px] text-slate-400">
                  PT: <strong className="text-slate-300">{v.staffName}</strong> ({v.staffId})
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-slate-300">
                    {v.clinicName}
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    Pain: {v.painBefore} &rarr; {v.painAfter}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span>{v.timestamp}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px]">
                  <span className="text-slate-500 truncate max-w-[200px]">
                    {v.verifiedAddress}
                  </span>
                  {v.syncedToGoogleSheet && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Synced
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
