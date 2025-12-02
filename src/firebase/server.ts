import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : {};

const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: databaseURL,
  });
}

export const database = getDatabase();
