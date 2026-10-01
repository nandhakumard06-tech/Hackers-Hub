/**
 * TVM Hackers Hub - Admin User Setup Guide & Helper Script
 * 
 * To set up your first administrator account:
 * 
 * OPTION 1: Using Firebase Console (Quickest)
 * 1. Go to Firebase Console -> Authentication -> Users -> Add User.
 * 2. Enter an email (e.g. admin@tvmhackershub.org) and strong password.
 * 3. Copy the generated User UID.
 * 4. Go to Firestore Database -> Create a collection named 'admins'.
 * 5. Add a document with ID = the User UID (or the email):
 *    {
 *      "email": "admin@tvmhackershub.org",
 *      "role": "admin",
 *      "active": true,
 *      "createdAt": "2026-10-01"
 *    }
 * 
 * OPTION 2: Using Firebase Admin SDK (Custom Claims)
 * If you have a serviceAccountKey.json, you can run:
 * `node scripts/create-admin.js admin@tvmhackershub.org`
 */

import dotenv from 'dotenv';
dotenv.config();

console.log('====================================================');
console.log('TVM HACKERS HUB - ADMIN AUTHORIZATION INSTRUCTIONS');
console.log('====================================================');
console.log(`
1. Open your Firebase Console: https://console.firebase.google.com/
2. Select your project ("${process.env.VITE_FIREBASE_PROJECT_ID || 'tvm-hackers-hub'}")
3. In Authentication > Sign-in method, ensure "Email/Password" is ENABLED.
4. Under Authentication > Users, click "Add User" and create your admin account.
5. In Firestore Database, add a document in the "admins" collection with:
   - Document ID: [User's Email or User's UID]
   - Field: role (string) = "admin"
   - Field: active (boolean) = true
6. You can now log in at /admin/login with full security clearance!
`);
console.log('====================================================');
