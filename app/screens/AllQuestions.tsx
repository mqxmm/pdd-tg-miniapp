'use client';

import { useState } from 'react';

export default function AllQuestions() {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold text-center my-6">Все билеты</h1>
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 40 }, (_, i) => (
          <button
            key={i}
            onClick={() => setSelectedTicket(i + 1)}
            className="bg-gray-700 hover:bg-gray-600 py-4 rounded-lg"
          >
            {i + 1}
          </button>
        ))}
      </div>
      {selectedTicket && <div className="mt-10 text-center">Билет {selectedTicket} — скоро будет</div>}
    </div>
  );
}