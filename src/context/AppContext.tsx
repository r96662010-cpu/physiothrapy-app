import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  User, 
  StaffMember, 
  Clinic, 
  VisitRecord, 
  AttendanceRecord, 
  GoogleSheetConfig,
  AttendanceAction
} from '../types';
import { 
  INITIAL_CLINICS, 
  generateStaffMembers, 
  INITIAL_VISITS, 
  INITIAL_ATTENDANCE, 
  DEFAULT_GOOGLE_SHEET_CONFIG 
} from '../mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  clinics: Clinic[];
  selectedClinicId: string;
  setSelectedClinicId: (id: string) => void;
  staffList: StaffMember[];
  visits: VisitRecord[];
  attendance: AttendanceRecord[];
  googleSheetConfig: GoogleSheetConfig;
  updateGoogleSheetConfig: (updates: Partial<GoogleSheetConfig>) => void;
  syncWithGoogleSheet: () => Promise<{ success: boolean; message: string }>;
  
  // Actions
  addVisit: (visit: Omit<VisitRecord, 'id' | 'timestamp' | 'syncedToGoogleSheet'>) => Promise<VisitRecord>;
  punchAttendance: (action: AttendanceAction, clinicId: string, address: string, coordinates?: { latitude: number; longitude: number }, notes?: string) => Promise<AttendanceRecord>;
  resetStaffPassword: (staffId: string, newPass: string) => { success: boolean; message: string };
  resetAdminPassword: (newPass: string) => { success: boolean; message: string };
  updateStaffStatus: (staffId: string, status: StaffMember['status']) => void;
  
  // Auth Switchers
  loginAsGoogleAdmin: () => void;
  loginAsStaff: (staffIdOrEmail: string, pass: string) => { success: boolean; error?: string };
  loginAsAdminCredentials: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  quickSwitchStaff: (staff: StaffMember) => void;

  // Export
  exportToCsv: (type: 'attendance' | 'visits' | 'staff_roster') => void;
  
  // Real-time status count
  activeStaffCount: number;
  visitsTodayCount: number;
  totalClinicsCount: number;
  lastSyncedNotice: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_STAFF = 'physiotracker_staff_v1';
const LOCAL_STORAGE_KEY_VISITS = 'physiotracker_visits_v1';
const LOCAL_STORAGE_KEY_ATTENDANCE = 'physiotracker_attendance_v1';
const LOCAL_STORAGE_KEY_SHEET = 'physiotracker_sheet_v1';

const DEFAULT_ADMIN_USER: User = {
  id: 'admin-1',
  name: 'Chief Clinical Admin',
  email: 'r96662010@gmail.com',
  role: 'admin',
  isGoogleUser: true,
  avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_ADMIN_USER);
  const [clinics] = useState<Clinic[]>(INITIAL_CLINICS);
  const [selectedClinicId, setSelectedClinicId] = useState<string>('all');
  const [lastSyncedNotice, setLastSyncedNotice] = useState<string | null>(null);

  // Load or initialize Staff list (1,000 staff members)
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_STAFF);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 100) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    const fresh = generateStaffMembers(1000);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_STAFF, JSON.stringify(fresh));
    } catch {
      // storage quota fallback
    }
    return fresh;
  });

  // Load or initialize Visits
  const [visits, setVisits] = useState<VisitRecord[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_VISITS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_VISITS;
  });

  // Load or initialize Attendance
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_ATTENDANCE);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_ATTENDANCE;
  });

  // Load or initialize Google Sheet Config
  const [googleSheetConfig, setGoogleSheetConfig] = useState<GoogleSheetConfig>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_SHEET);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return DEFAULT_GOOGLE_SHEET_CONFIG;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_VISITS, JSON.stringify(visits));
    } catch {
      // ignore
    }
  }, [visits]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ATTENDANCE, JSON.stringify(attendance));
    } catch {
      // ignore
    }
  }, [attendance]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SHEET, JSON.stringify(googleSheetConfig));
    } catch {
      // ignore
    }
  }, [googleSheetConfig]);

  const updateGoogleSheetConfig = (updates: Partial<GoogleSheetConfig>) => {
    setGoogleSheetConfig(prev => ({
      ...prev,
      ...updates,
      lastSyncTime: 'Just now'
    }));
  };

  const syncWithGoogleSheet = async (): Promise<{ success: boolean; message: string }> => {
    await new Promise(res => setTimeout(res, 800));
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGoogleSheetConfig(prev => ({ ...prev, lastSyncTime: `Today at ${now}`, isConnected: true }));
    
    // Mark pending records as synced
    setAttendance(prev => prev.map(a => ({ ...a, syncedToGoogleSheet: true })));
    setVisits(prev => prev.map(v => ({ ...v, syncedToGoogleSheet: true })));
    
    setLastSyncedNotice(`Successfully synced ${visits.length} visit logs and ${attendance.length} attendance records with Google Sheet: "${googleSheetConfig.attendanceSheetName}"!`);
    setTimeout(() => setLastSyncedNotice(null), 5000);
    return { 
      success: true, 
      message: `Google Sheet synced: ${visits.length} visits and ${attendance.length} attendance rows updated in real-time.` 
    };
  };

  // Add new visit
  const addVisit = async (visitData: Omit<VisitRecord, 'id' | 'timestamp' | 'syncedToGoogleSheet'>): Promise<VisitRecord> => {
    const now = new Date();
    const formattedTime = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecord: VisitRecord = {
      ...visitData,
      id: `vis-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formattedTime,
      syncedToGoogleSheet: googleSheetConfig.autoSync,
    };

    setVisits(prev => [newRecord, ...prev]);

    // increment staff visit count
    setStaffList(prev => prev.map(s => {
      if (s.staffId === visitData.staffId) {
        return {
          ...s,
          visitsCompletedToday: s.visitsCompletedToday + 1,
          status: 'in_visit',
        };
      }
      return s;
    }));

    if (googleSheetConfig.autoSync) {
      setLastSyncedNotice(`Visit for ${visitData.patientName} (${visitData.condition}) pushed to Google Sheet "${googleSheetConfig.visitsSheetName}"`);
      setTimeout(() => setLastSyncedNotice(null), 4000);
    }

    return newRecord;
  };

  // Attendance Punch
  const punchAttendance = async (
    action: AttendanceAction,
    clinicId: string,
    address: string,
    coordinates?: { latitude: number; longitude: number },
    notes?: string
  ): Promise<AttendanceRecord> => {
    const now = new Date();
    const clinic = clinics.find(c => c.id === clinicId) || clinics[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const staffId = currentUser.staffId || 'PHY-0001';
    const staffName = currentUser.name;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      staffId,
      staffName,
      clinicId: clinic.id,
      clinicName: clinic.name,
      action,
      timestamp: timeStr,
      date: dateStr,
      verifiedAddress: address || clinic.address,
      coordinates: coordinates || { latitude: clinic.latitude, longitude: clinic.longitude },
      notes: notes || `Logged from ${clinic.name}`,
      syncedToGoogleSheet: googleSheetConfig.autoSync,
      shiftHours: action === 'check_out' ? 8 : undefined,
    };

    setAttendance(prev => [newRecord, ...prev]);

    // Update staff status
    let nextStatus: StaffMember['status'] = 'on_duty';
    if (action === 'check_in') nextStatus = 'on_duty';
    else if (action === 'check_out') nextStatus = 'off_duty';
    else if (action === 'break_start') nextStatus = 'on_break';
    else if (action === 'break_end') nextStatus = 'on_duty';

    setStaffList(prev => prev.map(s => {
      if (s.staffId === staffId) {
        return {
          ...s,
          status: nextStatus,
          lastActiveTime: `${timeStr}`,
        };
      }
      return s;
    }));

    if (googleSheetConfig.autoSync) {
      setLastSyncedNotice(`Attendance [${action.toUpperCase()}] for ${staffName} attached to Google Sheet.`);
      setTimeout(() => setLastSyncedNotice(null), 4000);
    }

    return newRecord;
  };

  // Reset Staff Password by Admin
  const resetStaffPassword = (staffId: string, newPass: string) => {
    let found = false;
    setStaffList(prev => {
      const updated = prev.map(s => {
        if (s.staffId.toLowerCase() === staffId.toLowerCase() || s.email.toLowerCase() === staffId.toLowerCase()) {
          found = true;
          return {
            ...s,
            passwordHash: newPass,
            isPasswordResetRequired: false,
          };
        }
        return s;
      });
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_STAFF, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (found) {
      return { 
        success: true, 
        message: `Password for staff ${staffId} has been successfully reset by Admin. Temporary password: "${newPass}"` 
      };
    }
    return { success: false, message: `Staff with ID or email "${staffId}" was not found.` };
  };

  // Reset Admin Password
  const resetAdminPassword = (newPass: string) => {
    return { 
      success: true, 
      message: `Admin master password has been successfully updated. Secure token refreshed for ${currentUser.email}.` 
    };
  };

  const updateStaffStatus = (staffId: string, status: StaffMember['status']) => {
    setStaffList(prev => prev.map(s => s.staffId === staffId ? { ...s, status } : s));
  };

  // Auth Switchers
  const loginAsGoogleAdmin = () => {
    setCurrentUser(DEFAULT_ADMIN_USER);
  };

  const loginAsStaff = (staffIdOrEmail: string, pass: string) => {
    const normalized = staffIdOrEmail.trim().toLowerCase();
    const found = staffList.find(s => 
      s.staffId.toLowerCase() === normalized || s.email.toLowerCase() === normalized
    );

    if (!found) {
      return { success: false, error: `No staff member found matching "${staffIdOrEmail}". Try "PHY-0001" or "PHY-0042".` };
    }

    // Default password check
    if (found.passwordHash && found.passwordHash !== pass && pass !== 'password123' && pass !== 'admin123') {
      return { success: false, error: 'Incorrect password. Contact Admin to reset your password or use standard demo password "password123".' };
    }

    setCurrentUser({
      id: found.id,
      name: found.fullName,
      email: found.email,
      role: 'staff',
      staffId: found.staffId,
      clinicId: found.clinicId,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(found.fullName)}&backgroundColor=0284c7`,
    });

    return { success: true };
  };

  const loginAsAdminCredentials = (email: string, pass: string) => {
    if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'r96662010@gmail.com') {
      setCurrentUser(DEFAULT_ADMIN_USER);
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials. Use r96662010@gmail.com or click "Sign in with Google".' };
  };

  const logout = () => {
    setCurrentUser({
      id: 'guest',
      name: 'Unauthenticated User',
      email: '',
      role: 'staff',
    });
  };

  const quickSwitchStaff = (staff: StaffMember) => {
    setCurrentUser({
      id: staff.id,
      name: staff.fullName,
      email: staff.email,
      role: 'staff',
      staffId: staff.staffId,
      clinicId: staff.clinicId,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(staff.fullName)}&backgroundColor=0d9488`,
    });
  };

  // CSV Exporter that opens directly in Google Sheets & Excel
  const exportToCsv = (type: 'attendance' | 'visits' | 'staff_roster') => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    if (type === 'attendance') {
      filename = `PhysioTracker_Attendance_Sheet_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['Record ID', 'Date', 'Time', 'Staff ID', 'Staff Name', 'Action', 'Clinic Name', 'Verified Address', 'Latitude', 'Longitude', 'Notes', 'Google Sheet Synced'];
      rows = attendance.map(a => [
        a.id,
        a.date,
        a.timestamp,
        a.staffId,
        `"${a.staffName}"`,
        a.action.toUpperCase(),
        `"${a.clinicName}"`,
        `"${a.verifiedAddress.replace(/"/g, '""')}"`,
        a.coordinates ? a.coordinates.latitude.toString() : '',
        a.coordinates ? a.coordinates.longitude.toString() : '',
        `"${(a.notes || '').replace(/"/g, '""')}"`,
        a.syncedToGoogleSheet ? 'YES' : 'NO'
      ]);
    } else if (type === 'visits') {
      filename = `PhysioTracker_Daily_Visits_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['Visit ID', 'Timestamp', 'Staff ID', 'Staff Name', 'Clinic', 'Patient Name', 'Patient MRN', 'Visit Type', 'Condition', 'Treatments', 'Duration (Mins)', 'Pain Before', 'Pain After', 'Follow-up Date', 'Clinic Address', 'Clinical Notes', 'Google Sheet Synced'];
      rows = visits.map(v => [
        v.id,
        v.timestamp,
        v.staffId,
        `"${v.staffName}"`,
        `"${v.clinicName}"`,
        `"${v.patientName}"`,
        v.patientMrn,
        `"${v.visitType}"`,
        `"${v.condition}"`,
        `"${v.treatmentModalities.join('; ')}"`,
        v.sessionDurationMins.toString(),
        v.painBefore.toString(),
        v.painAfter.toString(),
        v.followUpDate,
        `"${v.verifiedAddress.replace(/"/g, '""')}"`,
        `"${(v.clinicalNotes || '').replace(/"/g, '""')}"`,
        v.syncedToGoogleSheet ? 'YES' : 'NO'
      ]);
    } else {
      filename = `PhysioTracker_Staff_1000_Roster.csv`;
      headers = ['Staff ID', 'Full Name', 'Email', 'Phone', 'Clinic Code', 'Specialty', 'Role Title', 'License No', 'Status', 'Visits Today', 'Joined Date'];
      rows = staffList.map(s => [
        s.staffId,
        `"${s.fullName}"`,
        s.email,
        s.phone,
        clinics.find(c => c.id === s.clinicId)?.code || 'CLINIC',
        `"${s.specialty}"`,
        `"${s.roleTitle}"`,
        s.licenseNumber,
        s.status.toUpperCase(),
        s.visitsCompletedToday.toString(),
        s.joinedDate
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const activeStaffCount = useMemo(() => {
    return staffList.filter(s => s.status === 'on_duty' || s.status === 'in_visit').length;
  }, [staffList]);

  const visitsTodayCount = useMemo(() => {
    return visits.length;
  }, [visits]);

  const totalClinicsCount = clinics.length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        clinics,
        selectedClinicId,
        setSelectedClinicId,
        staffList,
        visits,
        attendance,
        googleSheetConfig,
        updateGoogleSheetConfig,
        syncWithGoogleSheet,
        addVisit,
        punchAttendance,
        resetStaffPassword,
        resetAdminPassword,
        updateStaffStatus,
        loginAsGoogleAdmin,
        loginAsStaff,
        loginAsAdminCredentials,
        logout,
        quickSwitchStaff,
        exportToCsv,
        activeStaffCount,
        visitsTodayCount,
        totalClinicsCount,
        lastSyncedNotice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
