import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from '../styles/SignIn.module.css'; // Create this CSS module

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    // useAuth hook will handle user state, no need for manual redirect here based on user state from context
    // if login is successful, useFirebase context should update and App.js will handle PrivateRoute redirect.
    // If we want immediate redirect on this page, we can check `user` from `useFirebase` or `useAuth` after login.
    // A simpler approach is that useAuth does not automatically redirect, but changes the user state.
    // The PrivateRoute or AppContent will then handle redirecting to dashboard.
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.signInContainer}>
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleSubmit} className={styles.signInForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">البريد الإلكتروني:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
            placeholder="example@example.com"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">كلمة المرور:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            dir="ltr"
            placeholder="كلمة المرور"
          />
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
        </button>
        <p className={styles.signupText}>
          ليس لديك حساب؟ <a href="/signup">سجل الآن</a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
