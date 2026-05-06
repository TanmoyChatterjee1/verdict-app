import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY 
    || "AIzaSyBv8-mmaCkTyCIyZtNxakRQQnKGRRc0DDE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN 
    || "ai-studio-applet-webapp-3a36b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID 
    || "ai-studio-applet-webapp-3a36b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET 
    || "ai-studio-applet-webapp-3a36b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID 
    || "981894926158",
  appId: import.meta.env.VITE_FIREBASE_APP_ID 
    || "1:981894926158:web:58baae548cfa4f599b581f",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID
    || "ai-studio-1e21dc8d-2415-43ed-8dac-ef9c4040665c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();

// Test connection as per guidelines
async function testConnection() {
  try {
    // Attempt to read a non-existent doc to trigger a connection check
    await getDocFromServer(doc(db, 'system', 'connection_test'));
  } catch (error: any) {
    if (error.message?.includes('offline')) {
      console.error("Firebase is offline. Check your configuration.");
    }
  }
}

testConnection();

export const handleFirestoreError = (error: any, operation: string, path: string | null = null) => {
  // Handle Quota Exhausted (resource-exhausted)
  if (error.code === 'resource-exhausted' || error.message?.includes('Quota exceeded')) {
    console.error("CRITICAL: FIRESTORE QUOTA EXCEEDED. The app will be in Read-Only mode.");
    
    // Create a custom event to notify the UI without throwing an app-crashing error
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('verdict-quota-exceeded', { 
        detail: { operation, path } 
      }));
    }
  }

  if (error.code === 'permission-denied' || error.message?.includes('insufficient permissions')) {
    const errorInfo = {
      error: error.message,
      operationType: operation,
      path: path,
      authInfo: {
        userId: auth.currentUser?.uid || 'anonymous',
        email: auth.currentUser?.email || 'N/A',
        emailVerified: auth.currentUser?.emailVerified || false,
        isAnonymous: auth.currentUser?.isAnonymous || false,
        providerInfo: auth.currentUser?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName || '',
          email: p.email || ''
        })) || []
      }
    };
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
};
