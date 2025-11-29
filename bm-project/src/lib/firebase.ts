import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: (process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string) || "demo",
  authDomain: (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string) || "demo.firebaseapp.com",
  projectId: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string) || "demo",
  storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string) || "demo.appspot.com",
  messagingSenderId: (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string) || "0",
  appId: (process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string) || "demo",
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
