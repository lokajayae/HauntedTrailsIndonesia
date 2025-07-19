import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  console.warn('Google Cloud Project ID not configured. Please check your .env.local file.')
}

if (!process.env.NEXT_PUBLIC_FIRESTORE_DB) {
  console.warn('Firestore Database ID not configured. Please check your .env.local file.')
}

const app = initializeApp(firebaseConfig)

// Initialize Firebase Auth
export const auth = getAuth(app)

// Initialize Firestore with custom database ID if provided
const databaseId = process.env.NEXT_PUBLIC_FIRESTORE_DB || '(default)'
export const db = getFirestore(app, databaseId)