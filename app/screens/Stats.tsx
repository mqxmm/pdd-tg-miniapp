'use client';

import { getStats, clearStats } from '../../lib/storage';

export default function Stats() {
  const stats = typeof window !== 'undefined' ? getStats() : {};
  const total = Object.keys(stats).length;
  const correct = Object.values(stats).filter((s: any) => s.correct).length;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-10">Статистика</h1>
      <div className="text-6xl font-bold mb-4">{percent}%</div>
      <p className="text-xl mb-10">Правильных ответов: {correct} из {total}</p>
      {total > 0 && (
        <button
          onClick={() => { clearStats(); location.reload(); }}
          className="bg-red-600 px-8 py-4 rounded-lg text-lg"
        >
          Сбросить статистику
        </button>
      )}
    </div>
  );
}