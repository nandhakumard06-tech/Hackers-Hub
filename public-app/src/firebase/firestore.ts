import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Registration, RegistrationFormData, DashboardStats } from '../types/registration';

const REGISTRATIONS_COLLECTION = 'registrations';

/**
 * Sanitizes an email into a deterministic Firestore Document ID
 * Example: "user@example.com" -> "reg_user_at_example_dot_com" or base64
 */
export function getEmailDocId(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
}

/**
 * Checks if an email is already registered in Firestore
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isFirebaseConfigured) {
    // If running in local demo mode without live Firebase
    const local = localStorage.getItem('demo_registrations');
    if (local) {
      const items: Registration[] = JSON.parse(local);
      return items.some((item) => item.email.toLowerCase() === normalizedEmail);
    }
    return false;
  }

  // 1. Direct document lookup by deterministic ID
  const docId = getEmailDocId(normalizedEmail);
  const docSnap = await getDoc(doc(db, REGISTRATIONS_COLLECTION, docId));
  if (docSnap.exists()) {
    return true;
  }

  // 2. Query lookup for any existing registrations with this email
  const q = query(
    collection(db, REGISTRATIONS_COLLECTION),
    where('email', '==', normalizedEmail)
  );
  const querySnap = await getDocs(q);
  return !querySnap.empty;
}

/**
 * Saves a new member registration to Firestore and sends confirmation email
 */
export async function createRegistration(data: RegistrationFormData): Promise<{ id: string }> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const docId = getEmailDocId(normalizedEmail);

  // Check duplicate
  const exists = await checkEmailExists(normalizedEmail);
  if (exists) {
    throw new Error('This email is already registered with TVM Hackers Hub.');
  }

  const registrationData: any = {
    name: data.name.trim(),
    email: normalizedEmail,
    mobile: data.mobile.trim(),
    hackingLevel: data.hackingLevel,
    attendedWolfCTF: data.attendedWolfCTF,
    attendedWolfHackathons: data.attendedWolfHackathons,
    hackathonCount: data.hackathonCount || '',
    createdAt: serverTimestamp(),
  };

  if (!isFirebaseConfigured) {
    // Demo / Local storage fallback for seamless preview if keys aren't added yet
    const local = localStorage.getItem('demo_registrations');
    const items: Registration[] = local ? JSON.parse(local) : [];
    const newReg: Registration = {
      id: docId,
      name: data.name.trim(),
      email: normalizedEmail,
      mobile: data.mobile.trim(),
      hackingLevel: data.hackingLevel as any,
      attendedWolfCTF: data.attendedWolfCTF as any,
      attendedWolfHackathons: data.attendedWolfHackathons as any,
      hackathonCount: data.hackathonCount || '',
      createdAt: new Date().toISOString(),
    };
    items.unshift(newReg);
    localStorage.setItem('demo_registrations', JSON.stringify(items));
    return { id: docId };
  }

  // Save to Firestore
  const docRef = doc(db, REGISTRATIONS_COLLECTION, docId);
  await setDoc(docRef, registrationData);

  // Attempt to trigger confirmation email via serverless API
  try {
    await fetch('/api/send-registration-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name.trim(),
        email: normalizedEmail,
        mobile: data.mobile.trim(),
        hackingLevel: data.hackingLevel,
        attendedWolfCTF: data.attendedWolfCTF,
        attendedWolfHackathons: data.attendedWolfHackathons,
        hackathonCount: data.hackathonCount || '',
      }),
    });
  } catch (err) {
    // Non-blocking for registration completion, but logged
    console.warn('Registration email trigger note:', err);
  }

  return { id: docId };
}

/**
 * Retrieves all registrations for the Admin Dashboard
 */
export async function getAllRegistrations(): Promise<Registration[]> {
  if (!isFirebaseConfigured) {
    const local = localStorage.getItem('demo_registrations');
    if (local) {
      return JSON.parse(local);
    }
    // Seed initial demo data for instant UI visual evaluation
    const initialDemo: Registration[] = [
      {
        id: 'reg_alex_at_cyber_dot_io',
        name: 'Alex Vance',
        email: 'alex@cyber.io',
        mobile: '+919876543210',
        hackingLevel: 'advanced',
        attendedWolfCTF: 'yes',
        attendedWolfHackathons: 'yes',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'reg_sarah_at_nullbyte_dot_dev',
        name: 'Sarah Connor',
        email: 'sarah@nullbyte.dev',
        mobile: '+919123456789',
        hackingLevel: 'intermediate',
        attendedWolfCTF: 'yes',
        attendedWolfHackathons: 'no',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'reg_rahul_at_secops_dot_in',
        name: 'Rahul Sharma',
        email: 'rahul@secops.in',
        mobile: '+919988776655',
        hackingLevel: 'basic',
        attendedWolfCTF: 'no',
        attendedWolfHackathons: 'yes',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ];
    localStorage.setItem('demo_registrations', JSON.stringify(initialDemo));
    return initialDemo;
  }

  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Registration[];
  } catch (error) {
    // Fallback if index is still building or without orderBy
    const snap = await getDocs(collection(db, REGISTRATIONS_COLLECTION));
    const items = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Registration[];

    return items.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }
}

/**
 * Deletes a member registration
 */
export async function deleteRegistration(id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    const local = localStorage.getItem('demo_registrations');
    if (local) {
      const items: Registration[] = JSON.parse(local);
      const filtered = items.filter((item) => item.id !== id);
      localStorage.setItem('demo_registrations', JSON.stringify(filtered));
    }
    return;
  }

  const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Computes dynamic statistics from registration array
 */
export function calculateStats(registrations: Registration[]): DashboardStats {
  const stats: DashboardStats = {
    total: registrations.length,
    basic: 0,
    intermediate: 0,
    advanced: 0,
    wolfCTF: 0,
    wolfHackathons: 0,
  };

  registrations.forEach((item) => {
    if (item.hackingLevel === 'basic') stats.basic += 1;
    if (item.hackingLevel === 'intermediate') stats.intermediate += 1;
    if (item.hackingLevel === 'advanced') stats.advanced += 1;
    if (item.attendedWolfCTF === 'yes') stats.wolfCTF += 1;
    if (item.attendedWolfHackathons === 'yes') stats.wolfHackathons += 1;
  });

  return stats;
}
