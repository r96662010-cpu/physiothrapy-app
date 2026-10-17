import { Clinic, StaffMember, VisitRecord, AttendanceRecord, StaffSpecialty, GoogleSheetConfig } from './types';

export const INITIAL_CLINICS: Clinic[] = [
  {
    id: 'clinic-1',
    name: 'Downtown Orthopedic & Spine Pavilion',
    code: 'DOWNTOWN-PT',
    address: '742 Evergreen Medical Blvd, Suite 400',
    city: 'Metro City',
    state: 'CA',
    zip: '90210',
    phone: '+1 (555) 234-8901',
    latitude: 34.0522,
    longitude: -118.2437,
    geofenceRadiusMeters: 150,
    managerName: 'Dr. Michael Vance, DPT',
    operatingHours: '07:00 AM - 08:00 PM',
  },
  {
    id: 'clinic-2',
    name: 'Westside Neurological & Stroke Rehab',
    code: 'WESTSIDE-NEURO',
    address: '1280 Wilshire Health Plaza, Fl 2',
    city: 'Westwood',
    state: 'CA',
    zip: '90024',
    phone: '+1 (555) 345-6712',
    latitude: 34.0628,
    longitude: -118.4474,
    geofenceRadiusMeters: 200,
    managerName: 'Dr. Evelyn Zhang, PT, NCS',
    operatingHours: '08:00 AM - 07:00 PM',
  },
  {
    id: 'clinic-3',
    name: 'Metro Sports Medicine & Performance Lab',
    code: 'METRO-SPORTS',
    address: '450 Olympic Athletics Way',
    city: 'Culver City',
    state: 'CA',
    zip: '90232',
    phone: '+1 (555) 456-7823',
    latitude: 34.0211,
    longitude: -118.3965,
    geofenceRadiusMeters: 250,
    managerName: 'Marcus Bradley, MS, CSCS, PT',
    operatingHours: '06:30 AM - 08:30 PM',
  },
  {
    id: 'clinic-4',
    name: 'Sunrise Pediatric & Mobility Care',
    code: 'SUNRISE-PED',
    address: '890 Blossom Children’s Parkway',
    city: 'Pasadena',
    state: 'CA',
    zip: '91101',
    phone: '+1 (555) 567-8934',
    latitude: 34.1478,
    longitude: -118.1445,
    geofenceRadiusMeters: 180,
    managerName: 'Dr. Rachel Rivera, PT, PCS',
    operatingHours: '08:00 AM - 06:00 PM',
  },
  {
    id: 'clinic-5',
    name: 'Northside Geriatric & Joint Wellness',
    code: 'NORTHSIDE-GERI',
    address: '2150 Pine Valley Healthcare Way',
    city: 'Glendale',
    state: 'CA',
    zip: '91206',
    phone: '+1 (555) 678-9045',
    latitude: 34.1425,
    longitude: -118.2551,
    geofenceRadiusMeters: 200,
    managerName: 'Dr. Anthony Chen, DPT, GCS',
    operatingHours: '07:30 AM - 06:30 PM',
  },
];

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
  'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
  'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Donald', 'Sandra',
  'Mark', 'Ashley', 'Paul', 'Kimberly', 'Steven', 'Emily', 'Andrew', 'Donna', 'Kenneth', 'Michelle',
  'Joshua', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah',
  'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon', 'Jeffrey', 'Laura', 'Ryan', 'Cynthia',
  'Jacob', 'Kathleen', 'Gary', 'Amy', 'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen',
  'Stephen', 'Anna', 'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Emma',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Gregory', 'Christine', 'Alexander', 'Debra', 'Patrick', 'Rachel',
  'Frank', 'Catherine', 'Raymond', 'Carolyn', 'Jack', 'Janet', 'Dennis', 'Ruth', 'Jerry', 'Maria',
  'Tyler', 'Heather', 'Aaron', 'Diane', 'Jose', 'Virginia', 'Adam', 'Julie', 'Nathan', 'Joyce',
  'Henry', 'Victoria', 'Douglas', 'Olivia', 'Zachary', 'Kelly', 'Peter', 'Christina', 'Kyle', 'Lauren',
  'Walter', 'Joan', 'Ethan', 'Evelyn', 'Jeremy', 'Judith', 'Harold', 'Megan', 'Keith', 'Cheryl',
  'Christian', 'Andrea', 'Roger', 'Hannah', 'Noah', 'Martha', 'Gerald', 'Jacqueline', 'Carl', 'Frances',
  'Terry', 'Gloria', 'Sean', 'Ann', 'Austin', 'Teresa', 'Arthur', 'Kathryn', 'Lawrence', 'Sara'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
  'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'
];

const SPECIALTIES: StaffSpecialty[] = [
  'Orthopedic Physical Therapy',
  'Sports Rehabilitation',
  'Neurological Rehabilitation',
  'Pediatric Physiotherapy',
  'Geriatric Rehabilitation',
  'Cardiopulmonary Physical Therapy',
  'Post-Surgical Recovery',
  'Spine & Manual Therapy'
];

const ROLE_TITLES: StaffMember['roleTitle'][] = [
  'Senior Physiotherapist',
  'Staff Physiotherapist',
  'Sports Rehab Specialist',
  'Assistant PT',
  'Clinical Resident'
];

// Generates exactly 1000 staff members
export function generateStaffMembers(count = 1000): StaffMember[] {
  const staff: StaffMember[] = [];
  const clinics = INITIAL_CLINICS;

  for (let i = 1; i <= count; i++) {
    const fnIndex = (i * 7 + 13) % FIRST_NAMES.length;
    const lnIndex = (i * 11 + 37) % LAST_NAMES.length;
    const firstName = FIRST_NAMES[fnIndex];
    const lastName = LAST_NAMES[lnIndex];
    const fullName = `${firstName} ${lastName}`;
    const staffId = `PHY-${i.toString().padStart(4, '0')}`;
    const clinic = clinics[(i - 1) % clinics.length];
    const specialty = SPECIALTIES[(i * 3) % SPECIALTIES.length];
    const roleTitle = ROLE_TITLES[i % ROLE_TITLES.length];
    
    // Status distribution
    let status: StaffMember['status'] = 'off_duty';
    const mod = i % 10;
    if (mod < 4) status = 'on_duty';
    else if (mod < 7) status = 'in_visit';
    else if (mod === 7) status = 'on_break';
    else status = 'off_duty';

    const visitsToday = (status === 'off_duty') ? 0 : ((i % 5) + 1);

    staff.push({
      id: `staff-${i}`,
      staffId,
      fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i % 15 === 0 ? i : ''}@physiotracker.health`,
      phone: `+1 (555) ${(200 + (i % 700)).toString().padStart(3, '0')}-${(1000 + (i * 3) % 9000).toString().padStart(4, '0')}`,
      clinicId: clinic.id,
      specialty,
      roleTitle,
      licenseNumber: `PT-CA-${88000 + i}`,
      status,
      joinedDate: `2024-${((i % 12) + 1).toString().padStart(2, '0')}-${((i % 28) + 1).toString().padStart(2, '0')}`,
      visitsCompletedToday: visitsToday,
      lastActiveTime: status !== 'off_duty' ? `${8 + (i % 6)}:${(i * 7 % 60).toString().padStart(2, '0')} AM` : undefined,
      passwordHash: 'password123',
      isPasswordResetRequired: i === 42 || i === 105,
    });
  }

  return staff;
}

export const INITIAL_VISITS: VisitRecord[] = [
  {
    id: 'vis-101',
    staffId: 'PHY-0001',
    staffName: 'James Smith',
    clinicId: 'clinic-1',
    clinicName: 'Downtown Orthopedic & Spine Pavilion',
    patientName: 'Eleanor Vance',
    patientMrn: 'MRN-78219',
    visitType: 'In-Clinic Treatment',
    condition: 'Cervical Radiculopathy & Trapezius Spasm',
    treatmentModalities: ['Manual Therapy', 'Cervical Traction', 'Therapeutic Ultrasound'],
    sessionDurationMins: 45,
    painBefore: 8,
    painAfter: 3,
    clinicalNotes: 'Patient reported notable reduction in neck tension post manual mobilization and postural retraining. Recommended daily isometric chin tucks.',
    followUpDate: '2026-09-12',
    timestamp: '2026-09-09 09:30 AM',
    verifiedAddress: '742 Evergreen Medical Blvd, Suite 400, Metro City, CA',
    coordinates: { latitude: 34.0522, longitude: -118.2437 },
    syncedToGoogleSheet: true,
  },
  {
    id: 'vis-102',
    staffId: 'PHY-0002',
    staffName: 'Jennifer Johnson',
    clinicId: 'clinic-2',
    clinicName: 'Westside Neurological & Stroke Rehab',
    patientName: 'Arthur Pendelton',
    patientMrn: 'MRN-64210',
    visitType: 'In-Clinic Treatment',
    condition: 'Post-Ischemic Stroke Left Hemiparesis',
    treatmentModalities: ['Gait Training', 'Neuromuscular Re-education', 'Balance Board Stance'],
    sessionDurationMins: 60,
    painBefore: 4,
    painAfter: 2,
    clinicalNotes: 'Achieved 45 meters unassisted quad-cane ambulation. Improved ankle dorsiflexion active range of motion by 8 degrees.',
    followUpDate: '2026-09-11',
    timestamp: '2026-09-09 10:15 AM',
    verifiedAddress: '1280 Wilshire Health Plaza, Fl 2, Westwood, CA',
    coordinates: { latitude: 34.0628, longitude: -118.4474 },
    syncedToGoogleSheet: true,
  },
  {
    id: 'vis-103',
    staffId: 'PHY-0003',
    staffName: 'Robert Williams',
    clinicId: 'clinic-3',
    clinicName: 'Metro Sports Medicine & Performance Lab',
    patientName: 'Chloe Bennett',
    patientMrn: 'MRN-90114',
    visitType: 'Sports Field Rehab',
    condition: 'ACL Reconstruction Week 12 Rehab',
    treatmentModalities: ['Strengthening Exercises', 'Plyometric Drills', 'Cryotherapy Compression'],
    sessionDurationMins: 60,
    painBefore: 5,
    painAfter: 1,
    clinicalNotes: 'Quad index tested at 85% symmetry. Initiated light agility ladder drills and controlled deceleration mechanics without valgus collapse.',
    followUpDate: '2026-09-14',
    timestamp: '2026-09-09 11:00 AM',
    verifiedAddress: '450 Olympic Athletics Way, Culver City, CA',
    coordinates: { latitude: 34.0211, longitude: -118.3965 },
    syncedToGoogleSheet: true,
  },
  {
    id: 'vis-104',
    staffId: 'PHY-0004',
    staffName: 'Linda Brown',
    clinicId: 'clinic-4',
    clinicName: 'Sunrise Pediatric & Mobility Care',
    patientName: 'Lucas Morales (Age 6)',
    patientMrn: 'MRN-33291',
    visitType: 'In-Clinic Treatment',
    condition: 'Spastic Diplegic Cerebral Palsy',
    treatmentModalities: ['Gait Training', 'Dynamic Stretching', 'Hydrotherapy Exercise'],
    sessionDurationMins: 45,
    painBefore: 3,
    painAfter: 1,
    clinicalNotes: 'Excellent patient engagement during obstacle course. Maintained heel strike with AFOs across 3 trials.',
    followUpDate: '2026-09-16',
    timestamp: '2026-09-09 11:45 AM',
    verifiedAddress: '890 Blossom Children’s Parkway, Pasadena, CA',
    coordinates: { latitude: 34.1478, longitude: -118.1445 },
    syncedToGoogleSheet: true,
  },
  {
    id: 'vis-105',
    staffId: 'PHY-0005',
    staffName: 'William Jones',
    clinicId: 'clinic-5',
    clinicName: 'Northside Geriatric & Joint Wellness',
    patientName: 'Harold Cooper',
    patientMrn: 'MRN-18452',
    visitType: 'In-Clinic Treatment',
    condition: 'Bilateral Knee Osteoarthritis Grade III',
    treatmentModalities: ['Therapeutic Ultrasound', 'Isometric Quadriceps Setting', 'TENS Unit'],
    sessionDurationMins: 45,
    painBefore: 7,
    painAfter: 2,
    clinicalNotes: 'Patient reported significantly less stiffness getting out of bed. Active extension reached 0 degrees bilaterally.',
    followUpDate: '2026-09-13',
    timestamp: '2026-09-09 01:15 PM',
    verifiedAddress: '2150 Pine Valley Healthcare Way, Glendale, CA',
    coordinates: { latitude: 34.1425, longitude: -118.2551 },
    syncedToGoogleSheet: false,
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-201',
    staffId: 'PHY-0001',
    staffName: 'James Smith',
    clinicId: 'clinic-1',
    clinicName: 'Downtown Orthopedic & Spine Pavilion',
    action: 'check_in',
    timestamp: '06:55 AM',
    date: '2026-09-09',
    verifiedAddress: '742 Evergreen Medical Blvd, Suite 400, Metro City, CA',
    coordinates: { latitude: 34.0522, longitude: -118.2437 },
    notes: 'Morning shift opening supervisor. Geofence verified (8m from center).',
    syncedToGoogleSheet: true,
    shiftHours: 8,
  },
  {
    id: 'att-202',
    staffId: 'PHY-0002',
    staffName: 'Jennifer Johnson',
    clinicId: 'clinic-2',
    clinicName: 'Westside Neurological & Stroke Rehab',
    action: 'check_in',
    timestamp: '07:45 AM',
    date: '2026-09-09',
    verifiedAddress: '1280 Wilshire Health Plaza, Fl 2, Westwood, CA',
    coordinates: { latitude: 34.0628, longitude: -118.4474 },
    notes: 'Checked in on-site. Verified via clinic Wi-Fi & GPS.',
    syncedToGoogleSheet: true,
    shiftHours: 8,
  },
  {
    id: 'att-203',
    staffId: 'PHY-0003',
    staffName: 'Robert Williams',
    clinicId: 'clinic-3',
    clinicName: 'Metro Sports Medicine & Performance Lab',
    action: 'check_in',
    timestamp: '06:28 AM',
    date: '2026-09-09',
    verifiedAddress: '450 Olympic Athletics Way, Culver City, CA',
    coordinates: { latitude: 34.0211, longitude: -118.3965 },
    notes: 'Early athlete session arrival.',
    syncedToGoogleSheet: true,
    shiftHours: 8,
  },
  {
    id: 'att-204',
    staffId: 'PHY-0004',
    staffName: 'Linda Brown',
    clinicId: 'clinic-4',
    clinicName: 'Sunrise Pediatric & Mobility Care',
    action: 'check_in',
    timestamp: '07:50 AM',
    date: '2026-09-09',
    verifiedAddress: '890 Blossom Children’s Parkway, Pasadena, CA',
    coordinates: { latitude: 34.1478, longitude: -118.1445 },
    notes: 'Pediatric play gym sanitized and ready.',
    syncedToGoogleSheet: true,
    shiftHours: 7.5,
  },
  {
    id: 'att-205',
    staffId: 'PHY-0005',
    staffName: 'William Jones',
    clinicId: 'clinic-5',
    clinicName: 'Northside Geriatric & Joint Wellness',
    action: 'check_in',
    timestamp: '07:15 AM',
    date: '2026-09-09',
    verifiedAddress: '2150 Pine Valley Healthcare Way, Glendale, CA',
    coordinates: { latitude: 34.1425, longitude: -118.2551 },
    notes: 'On-time check-in. Mobility equipment calibrated.',
    syncedToGoogleSheet: true,
    shiftHours: 8,
  },
  {
    id: 'att-206',
    staffId: 'PHY-0006',
    staffName: 'Elizabeth Davis',
    clinicId: 'clinic-1',
    clinicName: 'Downtown Orthopedic & Spine Pavilion',
    action: 'break_start',
    timestamp: '12:00 PM',
    date: '2026-09-09',
    verifiedAddress: '742 Evergreen Medical Blvd, Suite 400, Metro City, CA',
    coordinates: { latitude: 34.0522, longitude: -118.2437 },
    notes: '30-minute lunch break.',
    syncedToGoogleSheet: false,
  },
];

export const DEFAULT_GOOGLE_SHEET_CONFIG: GoogleSheetConfig = {
  sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
  webhookUrl: 'https://script.google.com/macros/s/AKfycbz_physiotracker_attendance_sync/exec',
  autoSync: true,
  lastSyncTime: 'Just now',
  connectedAccount: 'r96662010@gmail.com',
  isConnected: true,
  attendanceSheetName: 'Clinic_Attendance_Master',
  visitsSheetName: 'Daily_Physio_Visits_Log',
};
