/**
 * Auth Context — Telegram initData orqali avtorizatsiya
 *
 * Cheksiz loop oldini olish uchun hasAttempted flag ishlatiladi.
 */
import { createContext, useState, useEffect, useRef } from 'react';
import { authApi } from '../api/endpoints';
import { setAuthToken, clearAuthToken } from '../api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const tg = window.Telegram?.WebApp;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasAttempted = useRef(false);

  useEffect(() => {
    // Faqat bir marta ishga tushadi
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    // TWA tayyor
    if (tg) {
      tg.ready();
      tg.expand();
    }

    authenticate();
  }, []); // Bo'sh dependency — faqat mount'da ishlaydi

  async function authenticate() {
    try {
      setLoading(true);
      setError(null);

      const initData = tg?.initData;

      if (!initData) {
        // Development mode — skip auth
        if (import.meta.env.DEV) {
          setUser({ id: 1, full_name: 'Dev User', role: 'admin', score: 100 });
          setLoading(false);
          return;
        }
        throw new Error('Telegram initData topilmadi');
      }

      const { data } = await authApi.authenticate(initData);
      
      const photo_url = tg?.initDataUnsafe?.user?.photo_url || null;
      const mergedUser = { ...data.user, photo_url };

      setAuthToken(data.token);
      setToken(data.token);
      setUser(mergedUser);
    } catch (err) {
      console.error('[AUTH] Xatolik:', err);
      setError(err.response?.data?.error || err.message);
      clearAuthToken();
    } finally {
      setLoading(false);
    }
  }

  function retry() {
    hasAttempted.current = false;
    authenticate();
  }

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isGuard: user?.role === 'guard',
    retry,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
