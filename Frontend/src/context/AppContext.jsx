// src/context/AppContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { mockNGOs, mockTasks, mockVolunteer, mockNGOUser } from '../data/mockData';
import { authService } from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [tasks, setTasks]   = useState(mockTasks);
  const [ngos, setNgos]     = useState(mockNGOs);
  const [loading, setLoading]       = useState(false);
  const [notification, setNotification] = useState(null);

  /* ─── THEME ─────────────────────────────────────────────── */
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load user from localStorage on app startup
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUserData = localStorage.getItem('user_data');
    const savedRole = localStorage.getItem('user_role');
    if (savedToken && savedUserData && savedRole) {
      try {
        const userData = JSON.parse(savedUserData);
        setUser({ role: savedRole, ...userData });
      } catch (e) {
        console.error('Failed to restore user session:', e);
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  /* ─── NOTIFICATIONS ─────────────────────────────────────── */
  const notify = useCallback((type, message) => {
    const id = Date.now();
    setNotification({ type, message, id });
    setTimeout(() => setNotification((n) => (n?.id === id ? null : n)), 3500);
  }, []);

  /* ─── AUTH ──────────────────────────────────────────────── */
  const login = useCallback((role, credentials) => {
    setLoading(true);
    return new Promise(async (resolve) => {
      try {
        let response;
        if (role === 'volunteer') {
          response = await authService.loginVolunteer(credentials);
        } else if (role === 'ngo') {
          response = await authService.loginNGO(credentials);
        } else if (role === 'admin') {
          response = await authService.loginAdmin(credentials);
        }

        if (response?.data?.success) {
          const { token, user: userData } = response.data;
          // Save to localStorage
          authService.saveLoginData(token, role, userData);
          // Set user state
          setUser({ role, ...userData });
          setLoading(false);
          notify('success', `Welcome! Signed in as ${role}`);
          resolve(true);
        }
      } catch (error) {
        setLoading(false);
        const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
        notify('error', message);
        resolve(false);
      }
    });
  }, [notify]);

  const logout = useCallback(() => {
    authService.logout(); // Clear localStorage
    setUser(null);
    notify('info', 'You have been signed out.');
  }, [notify]);

  const registerNGO = useCallback((formData) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNGO = { id: Date.now(), ...formData, status: 'pending', volunteers: 0, tasksPosted: 0 };
        setNgos((prev) => [newNGO, ...prev]);
        setLoading(false);
        resolve(newNGO);
      }, 1000);
    });
  }, []);

  /* ─── TASKS ─────────────────────────────────────────────── */
  const createTask = useCallback((taskData) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const days  = parseInt(taskData.daysLeft) || 14;
        const urgency = days <= 7 ? 'high' : days <= 20 ? 'medium' : 'low';
        const newTask = {
          id: Date.now(),
          ngoId: user?.id,
          ngoName: user?.name,
          appliedVolunteers: 0,
          urgency,
          tags: [],
          daysLeft: days,
          ...taskData,
          requiredVolunteers: parseInt(taskData.requiredVolunteers),
        };
        setTasks((prev) => [newTask, ...prev]);
        setLoading(false);
        notify('success', 'Task published successfully!');
        resolve(newTask);
      }, 800);
    });
  }, [user, notify]);

  const applyTask = useCallback((taskId) => {
    setTasks((prev) =>
      prev.map((t) => t.id === taskId ? { ...t, appliedVolunteers: t.appliedVolunteers + 1 } : t)
    );
    setUser((prev) => prev
      ? { ...prev, appliedTasks: [...(prev.appliedTasks || []), taskId] }
      : prev
    );
    notify('success', 'Applied! The NGO will reach out soon. 🎉');
  }, [notify]);

  const withdrawTask = useCallback((taskId) => {
    setTasks((prev) =>
      prev.map((t) => t.id === taskId ? { ...t, appliedVolunteers: Math.max(0, t.appliedVolunteers - 1) } : t)
    );
    setUser((prev) => prev
      ? { ...prev, appliedTasks: (prev.appliedTasks || []).filter((id) => id !== taskId) }
      : prev
    );
    notify('info', 'Application withdrawn.');
  }, [notify]);

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    notify('success', 'Task removed successfully.');
  }, [notify]);

  /* ─── ADMIN ─────────────────────────────────────────────── */
  const approveNGO = useCallback((ngoId) => {
    setNgos((prev) => prev.map((n) => n.id === ngoId ? { ...n, status: 'approved' } : n));
    notify('success', 'NGO approved successfully!');
  }, [notify]);

  const rejectNGO = useCallback((ngoId) => {
    setNgos((prev) => prev.map((n) => n.id === ngoId ? { ...n, status: 'rejected' } : n));
    notify('info', 'NGO application rejected.');
  }, [notify]);

  const getNGOTasks = useCallback((ngoId) => tasks.filter((t) => t.ngoId === ngoId), [tasks]);

  const value = {
    user, tasks, ngos, loading, notification, theme,
    login, logout, registerNGO,
    createTask, applyTask, withdrawTask, deleteTask,
    approveNGO, rejectNGO, getNGOTasks,
    toggleTheme, notify,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
