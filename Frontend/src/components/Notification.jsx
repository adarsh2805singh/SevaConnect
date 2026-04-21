// src/components/Notification.jsx
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import './Notification.css';

const CONFIG = {
  success: { icon: '✓', label: 'Success' },
  error:   { icon: '✕', label: 'Error' },
  info:    { icon: 'ℹ', label: 'Info' },
  warning: { icon: '⚠', label: 'Warning' },
};

export default function Notification() {
  const { notification } = useApp();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (notification) {
      setCurrent(notification);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [notification]);

  if (!current) return null;
  const cfg = CONFIG[current.type] || CONFIG.info;

  return (
    <div
      className={`toast-wrap toast-${current.type} ${visible ? 'toast-show' : 'toast-hide'}`}
      role="status"
      aria-live="polite"
    >
      <div className={`toast-icon-wrap toast-icon-${current.type}`}>
        <span>{cfg.icon}</span>
      </div>
      <div className="toast-body">
        <div className="toast-label">{cfg.label}</div>
        <div className="toast-message">{current.message}</div>
      </div>
      <div className="toast-progress">
        <div className="toast-progress-bar" />
      </div>
    </div>
  );
}
