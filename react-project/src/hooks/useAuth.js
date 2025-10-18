import { useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export function useAuth() {
  const { auth, db, projectId, user } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const emailRegex = /^[^s@]+@[^s@]+\.[^s@]+$/;

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    if (!emailRegex.test(email)) {
      setError('البريد الإلكتروني غير صالح.');
      setLoading(false);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError('فشل تسجيل الدخول: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    setError(null);
    if (!emailRegex.test(email)) {
      setError('البريد الإلكتروني غير صالح.');
      setLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      // Add user to members collection with owner role for tenant isolation
      await setDoc(doc(db, `projects/${projectId}/members`, newUser.uid), {
        email: newUser.email,
        roles: ['owner'],
        createdAt: new Date()
      });
    } catch (err) {
      console.error('Signup error:', err);
      setError('فشل التسجيل: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
      setError('فشل تسجيل الخروج: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, signup, logout };
}
