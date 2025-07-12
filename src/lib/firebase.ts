import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
}

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  console.warn('Google Cloud Project ID not configured. Please check your .env.local file.')
}

if (!process.env.NEXT_PUBLIC_FIRESTORE_DB) {
  console.warn('Firestore Database ID not configured. Please check your .env.local file.')
}

const app = initializeApp(firebaseConfig)

// Initialize Firestore with custom database ID if provided
const databaseId = process.env.NEXT_PUBLIC_FIRESTORE_DB || '(default)'
export const db = getFirestore(app, databaseId)