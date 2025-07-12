import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIRESTORE_DB,
}

// Initialize Firebase with minimal config for Google Cloud Firestore
if (!process.env.NEXT_PUBLIC_FIRESTORE_DB) {
  console.warn('Firestore project ID not configured. Please check your .env.local file.')
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)