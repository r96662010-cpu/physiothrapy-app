import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileSpreadsheet, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  RefreshCw, 
  Download, 
  Sparkles, 
  ShieldCheck,
  Link,
  Code
} from 'lucide-react';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({ isOpen, onClose }) => {
  const { 
    googleSheetConfig, 
    updateGoogleSheetConfig, 
    syncWithGoogleSheet, 
    exportToCsv,
    attendance,
    visits
  } = useApp();

  const [sheetUrl, setSheetUrl] = useState(googleSheetConfig.sheetUrl);
  const [webhookUrl, setWebhookUrl] = useState(googleSheetConfig.webhookUrl);
  const [attendanceSheetName, setAttendanceSheetName] = useState(googleSheetConfig.attendanceSheetName);
  const [visitsSheetName, setVisitsSheetName] = useState(googleSheetConfig.visitsSheetName);
  const [autoSync, setAutoSync] = useState(googleSheetConfig.autoSync);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showAppsScriptGuide, setShowAppsScriptGuide] = useState(false);

  if (!isOpen) return null;

  const handleSaveAndSync = async () => {
    setIsSyncing(true);
    updateGoogleSheetConfig({
      sheetUrl,
      webhookUrl,
      attendanceSheetName,
      visitsSheetName,
      autoSync,
      isConnected: true,
    });

    const res = await syncWithGoogleSheet();
    setIsSyncing(false);
    setSyncStatusMsg(res.message);
    setTimeout(() => setSyncStatusMsg(null), 5000);
  };

  const sampleAppsScriptCode = `// PhysioTracker Google Apps Script Free Webhook Integration
// 1. Open Google Sheets -> Extensions -> Apps Script
// 2. Paste this code and Deploy -> New Deployment -> Web App (Anyone)
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (data.type === "attendance") {
    var sheet = ss.getSheetByName("${attendanceSheetName}") || ss.insertSheet("${attendanceSheetName}");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Staff ID", "Staff Name", "Action", "Clinic", "Address", "Latitude", "Longitude", "Notes"]);
    }
    sheet.appendRow([data.timestamp, data.staffId, data.staffName, data.action, data.clinicName, data.verifiedAddress, data.latitude, data.longitude, data.notes]);
  } else if (data.type === "visit") {
    var sheet = ss.getSheetByName("${visitsSheetName}") || ss.insertSheet("${visitsSheetName}");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Staff ID", "Patient Name", "MRN", "Condition", "Modalities", "Duration", "Pain Before", "Pain After", "Address"]);
    }
    sheet.appendRow([data.timestamp, data.staffId, data.patientName, data.patientMrn, data.condition, data.modalities, data.duration, data.painBefore, data.painAfter, data.verifiedAddress]);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
}`;

  const copyAppsScript = () => {
    navigator.clipboard.writeText(sampleAppsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Google Sheet & Attendance Sync Hub</h3>
              <p className="text-xs text-slate-400">
                Attached real-time reporting for 1,000 staff members and 5 clinic addresses
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

        {/* Sync Status Banner */}
        {syncStatusMsg ? (
          <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 text-xs px-4 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncStatusMsg}</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white font-medium">Connected Google Account:</span>
              <span className="text-teal-400 font-mono">{googleSheetConfig.connectedAccount}</span>
            </div>
            <span className="text-slate-400">Last Synced: {googleSheetConfig.lastSyncTime || 'Active'}</span>
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-4">
          
          {/* Sheet URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Google Sheet Document Link or Spreadsheet ID
            </label>
            <div className="relative">
              <Link className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Any Google Sheet can be connected for free. Visit logs and attendance check-ins are synced with verified clinic addresses.
            </p>
          </div>

          {/* Attached Sheet Tab Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Attached Attendance Tab Name
              </label>
              <input
                type="text"
                value={attendanceSheetName}
                onChange={(e) => setAttendanceSheetName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Attached Daily Visits Tab Name
              </label>
              <input
                type="text"
                value={visitsSheetName}
                onChange={(e) => setVisitsSheetName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Auto-Sync Toggle */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">Real-Time Automatic Sync</h4>
              <p className="text-[11px] text-slate-400">
                Immediately append rows upon each staff punch and patient visit completion.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAutoSync(!autoSync)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                autoSync ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoSync ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Direct CSV Download Buttons (No Google Sheet login required) */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">
              Direct Spreadsheet Export (Free CSV, compatible with Google Sheets & Excel)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => exportToCsv('attendance')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Attendance CSV</span>
              </button>

              <button
                type="button"
                onClick={() => exportToCsv('visits')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-teal-400" />
                <span>Download Visits CSV</span>
              </button>
            </div>
          </div>

          {/* 100% Free Google Apps Script Webhook Guide Toggle */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowAppsScriptGuide(!showAppsScriptGuide)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showAppsScriptGuide ? 'Hide Apps Script Webhook Code' : 'View Free Google Sheets Apps Script Template (Zero Cloud Cost)'}</span>
            </button>

            {showAppsScriptGuide && (
              <div className="mt-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-[11px]">Free Apps Script Webhook Code:</span>
                  <button
                    type="button"
                    onClick={copyAppsScript}
                    className="flex items-center gap-1 text-teal-400 hover:text-teal-300 text-[11px] font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 p-3 rounded-lg text-[10px] text-slate-300 font-mono overflow-x-auto max-h-40 border border-slate-800">
                  {sampleAppsScriptCode}
                </pre>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAndSync}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Saving & Syncing...' : 'Save Settings & Sync Now'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
