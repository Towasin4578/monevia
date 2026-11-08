import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { FinanceProvider } from './context/FinanceContext';
import { isNativeApp } from './utils/platform';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FinanceProvider>
      <App />
    </FinanceProvider>
  </React.StrictMode>
);

// Register Service Worker for PWA installation on Android and mobile
// (not needed inside the native APK — all assets are bundled in the app)
if ('serviceWorker' in navigator && !isNativeApp()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service Worker registration skipped:', err);
    });
  });
}
