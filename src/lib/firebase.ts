import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIRESTORE_DB}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIRESTORE_DB,
  storageBucket: `${process.env.NEXT_PUBLIC_FIRESTORE_DB}.appspot.com`,
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)