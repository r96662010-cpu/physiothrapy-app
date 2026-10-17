export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  staffId?: string;
  avatarUrl?: string;
  clinicId?: string;
  isGoogleUser?: boolean;
}

export interface Clinic {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
  managerName: string;
  operatingHours: string;
}

export type StaffSpecialty = 
  | 'Orthopedic Physical Therapy'
  | 'Sports Rehabilitation'
  | 'Neurological Rehabilitation'
  | 'Pediatric Physiotherapy'
  | 'Geriatric Rehabilitation'
  | 'Cardiopulmonary Physical Therapy'
  | 'Post-Surgical Recovery'
  | 'Spine & Manual Therapy';

export type StaffStatus = 'on_duty' | 'in_visit' | 'on_break' | 'off_duty';

export interface StaffMember {
  id: string;
  staffId: string; // e.g. PHY-0001
  fullName: string;
  email: string;
  phone: string;
  clinicId: string;
  specialty: StaffSpecialty;
  roleTitle: 'Senior Physiotherapist' | 'Staff Physiotherapist' | 'Sports Rehab Specialist' | 'Assistant PT' | 'Clinical Resident';
  licenseNumber: string;
  status: StaffStatus;
  joinedDate: string;
  visitsCompletedToday: number;
  lastActiveTime?: string;
  passwordHash?: string; // For simulation/custom password reset
  isPasswordResetRequired?: boolean;
}

export type VisitType = 'In-Clinic Treatment' | 'Home Rehabilitation' | 'Tele-Physiotherapy' | 'Sports Field Rehab' | 'In-Patient Ward';

export interface VisitRecord {
  id: string;
  staffId: string;
  staffName: string;
  clinicId: string;
  clinicName: string;
  patientName: string;
  patientMrn: string;
  visitType: VisitType;
  condition: string;
  treatmentModalities: string[];
  sessionDurationMins: number;
  painBefore: number; // 0-10
  painAfter: number;  // 0-10
  clinicalNotes: string;
  followUpDate: string;
  timestamp: string;
  verifiedAddress: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  syncedToGoogleSheet: boolean;
}

export type AttendanceAction = 'check_in' | 'check_out' | 'break_start' | 'break_end';

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  clinicId: string;
  clinicName: string;
  action: AttendanceAction;
  timestamp: string;
  date: string;
  verifiedAddress: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  syncedToGoogleSheet: boolean;
  shiftHours?: number;
}

export interface GoogleSheetConfig {
  sheetId: string;
  sheetUrl: string;
  webhookUrl: string;
  autoSync: boolean;
  lastSyncTime?: string;
  connectedAccount?: string;
  isConnected: boolean;
  attendanceSheetName: string;
  visitsSheetName: string;
}
