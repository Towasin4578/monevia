import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { FinanceProvider } from './context/FinanceContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FinanceProvider>
      <App />
    </FinanceProvider>
  </React.StrictMode>
);

// Register Service Worker for PWA installation on Android and mobile
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service Worker registration skipped:', err);
    });
  });
}
