import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useFirebase } from '../contexts/FirebaseContext';

export function useFirestore(collectionName, queryConstraints = []) {
  const { db, projectId, user } = useFirebase();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) { // Only fetch data if a user is authenticated
      setLoading(false);
      // setError('غير مصرح: لا يوجد مستخدم مسجل الدخول.');
      // Optional: clear data if no user
      // setData([]);
      return; 
    }

    setLoading(true);
    setError(null);

    // Construct the collection reference with projectId for tenant isolation
    const colRef = collection(db, `projects/${projectId}/${collectionName}`);
    let q = query(colRef, ...queryConstraints);

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(docsData);
        setLoading(false);
        setError(null);
      }, 
      (err) => {
        console.error("Firestore data fetch error:", err);
        setError(`خطأ في تحميل البيانات: ${err.message}. (${err.code})`);
        setLoading(false);
      }
    );

    // Cleanup function
    return () => unsubscribe();
  }, [collectionName, projectId, user, JSON.stringify(queryConstraints)]); // Dependency array, stringify queryConstraints for deep comparison

  return { data, loading, error };
}
