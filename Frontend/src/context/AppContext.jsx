// src/context/AppContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { mockNGOs, mockTasks, mockVolunteer, mockNGOUser } from '../data/mockData';

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
    return new Promise((resolve) => {
      setTimeout(() => {
        if (role === 'volunteer') setUser({ role: 'volunteer', ...mockVolunteer });
        else if (role === 'ngo')  setUser({ role: 'ngo', ...mockNGOUser });
        else if (role === 'admin') setUser({ role: 'admin', id: 999, name: 'Admin', email: credentials?.email || 'admin@example.com' });
        setLoading(false);
        notify('success', `Welcome back! Signed in as ${role}.`);
        resolve(true);
      }, 900);
    });
  }, [notify]);

  const logout = useCallback(() => {
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
