'use client';

import { getStats, clearStats } from '@/lib/storage';

export default function Stats() {
  const stats = typeof window !== 'undefined' ? getStats() : {};
  const total = Object.keys(stats).length;
  const correct = Object.values(stats).filter((s: any) => s.correct).length;

  return (
    <div className="px-6 pt-10 text-center">
      <h1 className="text-3xl font-bold mb-10">Статистика</h1>
      <div className="text-5xl mb-6">{total > 0 ? Math.round((correct / total) * 100) : 0}%</div>
      <p className="text-xl">Правильных: {correct} из {total}</p>
      <button
        onClick={() => {
          clearStats();
          window.location.reload();
        }}
        className="mt-10 bg-red-600 px-8 py-4 rounded-lg"
      >
        Сбросить статистику
      </button>
    </div>
  );
}