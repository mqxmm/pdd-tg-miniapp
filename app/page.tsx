'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState('Гость');

  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setUser(Telegram.WebApp.initDataUnsafe.user.first_name || 'Друг');
    }
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>ПДД Тест</h1>
      <p style={{ fontSize: '20px' }}>Привет, {user}!</p>
      <div style={{ marginTop: '40px', padding: '20px', background: '#334155', borderRadius: '12px' }}>
        <h2>Мини-апп работает!</h2>
        <p>Vercel — ✅</p>
        <p>Telegram WebApp — ✅</p>
        <p>Готов к билетам ПДД!</p>
      </div>
      <button 
        onClick={() => alert('Скоро будут билеты!')}
        style={{
          marginTop: '30px',
          padding: '15px 30px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        Начать экзамен
      </button>
    </div>
  );
}