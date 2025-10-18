import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, storage, projectId } from '../services/firebase'; // Import firebase services

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // Loading state for authentication

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      console.log('Auth State Changed. Current User:', currentUser);
      if (currentUser) {
        // Optional: Check user membership in Firestore here if needed
        // const userDocRef = doc(db, `projects/${projectId}/members/${currentUser.uid}`);
        // const userDoc = await getDoc(userDocRef);
        // if (userDoc.exists() && userDoc.data().roles && userDoc.data().roles.includes('owner')) {
        //   setUser(currentUser);
        // } else {
        //   console.warn('User is not a member of this project or lacks necessary roles.');
        //   await auth.signOut(); // Force sign out if not a member
        //   setUser(null);
        // }
        setUser(currentUser); // For now, just set the user
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, auth, db, storage, projectId, loadingAuth }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
