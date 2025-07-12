import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIRESTORE_DB}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIRESTORE_DB,
  storageBucket: `${process.env.NEXT_PUBLIC_FIRESTORE_DB}.firebasestorage.app`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456'
}

// Initialize Firebase only if we have a valid project ID
if (!process.env.NEXT_PUBLIC_FIRESTORE_DB || process.env.NEXT_PUBLIC_FIRESTORE_DB === 'hauted-trails-db') {
  console.warn('Firebase project ID not properly configured. Please check your .env.local file.')
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)