import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Игнорируем ошибки MetaMask, если расширение не установлено или не подключено
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('MetaMask')) {
    event.preventDefault();
    console.log('MetaMask extension detected but not connected. This is normal if you don\'t use MetaMask.');
    return false;
  }
});

// Игнорируем необработанные промисы, связанные с MetaMask
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && (
    event.reason.message?.includes('MetaMask') ||
    event.reason.toString().includes('MetaMask')
  )) {
    event.preventDefault();
    console.log('MetaMask connection error ignored.');
    return false;
  }
});

// Обработка ошибок рендеринга
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('✅ Приложение успешно запущено!');
} catch (error) {
  console.error('❌ Ошибка при запуске приложения:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial; text-align: center;">
      <h1>Ошибка загрузки приложения</h1>
      <p>${error.message}</p>
      <p>Пожалуйста, обновите страницу (F5) или проверьте консоль браузера (F12)</p>
    </div>
  `;
}