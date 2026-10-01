import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  IdTokenResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';

export interface AdminUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

const CONFIGURED_ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'tvmhackershub@gmail.com').toLowerCase();
const CONFIGURED_ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'CWtvmhackeradmin$$$';

const ADMIN_SESSION_KEY = 'tvm_admin_session';

/**
 * Checks if the logged in Firebase user has Admin privileges.
 */
export async function checkIsAdmin(user: User): Promise<boolean> {
  if (!user) return false;

  try {
    const userEmail = user.email?.toLowerCase();

    // 1. Direct configured admin email match
    if (userEmail && userEmail === CONFIGURED_ADMIN_EMAIL) {
      if (isFirebaseConfigured) {
        try {
          const adminDoc = doc(db, 'admins', user.uid);
          await setDoc(adminDoc, { email: userEmail, role: 'admin', active: true }, { merge: true });
        } catch (e) {
          // Non-blocking
        }
      }
      return true;
    }

    // 2. Check Custom Claims (Firebase Auth token)
    const tokenResult: IdTokenResult = await user.getIdTokenResult(true);
    if (tokenResult.claims.admin === true || tokenResult.claims.role === 'admin') {
      return true;
    }

    // 3. Check 'admins' collection in Firestore
    if (isFirebaseConfigured) {
      const adminDocByUid = await getDoc(doc(db, 'admins', user.uid));
      if (adminDocByUid.exists() && adminDocByUid.data()?.active !== false) {
        return true;
      }

      if (userEmail) {
        const adminDocByEmail = await getDoc(doc(db, 'admins', userEmail));
        if (adminDocByEmail.exists() && adminDocByEmail.data()?.active !== false) {
          return true;
        }
      }
    }
  } catch (error) {
    console.error('Error verifying admin permissions:', error);
  }

  return false;
}

/**
 * Sign in admin with Firebase Authentication or configured environment credentials
 */
export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const isEnvAdminMatch = normalizedEmail === CONFIGURED_ADMIN_EMAIL && password === CONFIGURED_ADMIN_PASS;

  if (isFirebaseConfigured) {
    try {
      // 1. Try Firebase Auth sign-in
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const isAdmin = await checkIsAdmin(credential.user);

      if (!isAdmin) {
        await signOut(auth);
        throw new Error('Access denied. This account does not have administrator clearance.');
      }

      const adminUser: AdminUser = {
        uid: credential.user.uid,
        email: credential.user.email,
        isAdmin: true,
      };
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
      return adminUser;
    } catch (firebaseErr: any) {
      // 2. If account doesn't exist yet in Firebase Auth, but credentials match .env, auto-create it!
      if (
        isEnvAdminMatch &&
        (firebaseErr.code === 'auth/user-not-found' ||
          firebaseErr.code === 'auth/invalid-credential' ||
          firebaseErr.code === 'auth/invalid-email')
      ) {
        try {
          const newCred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
          const adminUser: AdminUser = {
            uid: newCred.user.uid,
            email: newCred.user.email,
            isAdmin: true,
          };
          sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
          return adminUser;
        } catch (createErr: any) {
          // If creation fails due to email-already-in-use, password might be different in Firebase
          if (createErr.code === 'auth/email-already-in-use') {
            // Re-throw the original error
            throw new Error('Invalid security authorization credentials. Please verify your password.');
          }
        }
      }

      // If matches .env configured credentials, establish session fallback
      if (isEnvAdminMatch) {
        const fallbackAdmin: AdminUser = {
          uid: 'admin_' + Date.now(),
          email: normalizedEmail,
          isAdmin: true,
        };
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(fallbackAdmin));
        return fallbackAdmin;
      }

      throw firebaseErr;
    }
  }

  // Fallback if Firebase not configured
  if (isEnvAdminMatch) {
    const fallbackAdmin: AdminUser = {
      uid: 'admin_local',
      email: normalizedEmail,
      isAdmin: true,
    };
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(fallbackAdmin));
    return fallbackAdmin;
  }

  throw new Error('Invalid security authorization credentials.');
}

/**
 * Sign out current admin user
 */
export async function logoutAdmin(): Promise<void> {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  if (isFirebaseConfigured) {
    try {
      await signOut(auth);
    } catch (e) {
      // Ignore
    }
  }
}

/**
 * Subscribe to auth state changes and verify admin status
 */
export function onAdminAuthStateChanged(
  callback: (admin: AdminUser | null, loading: boolean) => void
): () => void {
  // Check active session storage first
  const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (stored) {
    try {
      const parsed: AdminUser = JSON.parse(stored);
      if (parsed.isAdmin) {
        callback(parsed, false);
      }
    } catch (e) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const isAdmin = await checkIsAdmin(user);
      if (isAdmin) {
        const adminUser: AdminUser = { uid: user.uid, email: user.email, isAdmin: true };
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
        callback(adminUser, false);
      } else {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        callback(null, false);
      }
    } else {
      // If no Firebase user, check if active session storage exists
      const fallbackSession = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (fallbackSession) {
        try {
          const parsed = JSON.parse(fallbackSession);
          if (parsed.isAdmin) {
            callback(parsed, false);
            return;
          }
        } catch (e) {}
      }
      callback(null, false);
    }
  });
}
