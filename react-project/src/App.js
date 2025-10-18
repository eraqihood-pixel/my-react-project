import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import styles from './styles/App.module.css';

function PrivateRoute({ children }) {
  const { user, loadingAuth } = useFirebase();

  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  return user ? children : <Navigate to="/signin" />;
}

function AppContent() {
  const { user, loadingAuth, auth } = useFirebase();

  // Console log for debugging auth state
  React.useEffect(() => {
    console.log("Auth State Changed. Current User:", user);
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('فشل تسجيل الخروج: ' + error.message);
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {user ? (
            <button onClick={handleLogout} className={styles.logoutButton}>تسجيل الخروج</button>
          ) : (
            <nav className={styles.nav}>
              <a href="/signin">تسجيل الدخول</a>
            </nav>
          )}
        </div>
      </header>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        {/* Add more private routes here */}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <FirebaseProvider>
        <AppContent />
      </FirebaseProvider>
    </Router>
  );
}

export default App;
