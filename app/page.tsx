'use client';

import { useEffect, useState } from 'react';

// Объявляем Telegram глобально — убирает ошибку TS
declare global {
  interface Window {
    Telegram?: any;
  }
}

export default function Home() {
  const [user, setUser] = useState('Гость');

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.first_name) {
      setUser(tg.initDataUnsafe.user.first_name);
    } else if (tg?.initDataUnsafe?.user?.username) {
      setUser(tg.initDataUnsafe.user.username);
    }
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">ПДД Тест</h1>
      <p className="text-2xl mb-10">Привет, {user}!</p>
      
      <div className="bg-slate-700 rounded-2xl p-10 max-w-md mx-auto">
        <h2 className="text-3xl mb-6">Всё работает!</h2>
        <p className="text-xl mb-2">✅ Vercel</p>
        <p className="text-xl mb-2">✅ Telegram Mini App</p>
        <p className="text-xl">✅ Без TypeScript-ошибок</p>
      </div>

      <button 
        onClick={() => alert('Готов к настоящим билетам ПДД!')}
        className="mt-10 bg-green-600 hover:bg-green-500 px-10 py-5 rounded-xl text-xl font-bold"
      >
        Начать экзамен
      </button>
    </div>
  );
}