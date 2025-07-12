import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  authDomain: `hauted-trails-db.firebaseapp.com`,
  projectId: 'hauted-trails-db',
  storageBucket: `hauted-trails-db.appspot.com`,
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)