import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firestore: Firestore | null = null;

function hasFirebaseConfig() {
  return [
    firebaseConfig.apiKey,
    firebaseConfig.authDomain,
    firebaseConfig.projectId,
    firebaseConfig.storageBucket,
    firebaseConfig.messagingSenderId,
    firebaseConfig.appId,
  ].every(Boolean);
}

function getFirebaseApp(): FirebaseApp {
  if (!hasFirebaseConfig()) {
    throw new Error(
      "Firebase is not configured. Add your NEXT_PUBLIC_FIREBASE_* values to .env.local.",
    );
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirestoreDb() {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp());
  }

  return firestore;
}
