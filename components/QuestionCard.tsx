'use client';

import Image from 'next/image';
import { useState } from 'react';

type Answer = { answer_text: string; is_correct: boolean };
type Question = {
  id: string;
  question: string;
  image?: string;
  answers: Answer[];
  correct_answer: string;
  answer_tip: string;
};

export default function QuestionCard({ q, onAnswer }: { q: Question; onAnswer: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleAnswer = () => {
    if (selected === null) return;
    const correct = q.answers[selected].is_correct;
    onAnswer(correct);
    setRevealed(true);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-5">
      {q.image && q.image.includes('no_image') === false && (
        <div className="relative h-64 mb-4">
          <Image src={q.image} alt="" fill className="object-contain" />
        </div>
      )}

      <h3 className="text-lg font-bold mb-4">{q.question}</h3>

      <div className="space-y-3">
        {q.answers.map((a, i) => (
          <button
            key={i}
            disabled={revealed}
            onClick={() => setSelected(i)}
            className={`w-full text-left p-4 rounded-lg border-2 transition
              ${selected === i
                ? revealed
                  ? a.is_correct ? 'border-green-500 bg-green-900' : 'border-red-500 bg-red-900'
                  : 'border-yellow-500 bg-yellow-900'
                : 'border-gray-600 hover:border-gray-500'
              }`}
          >
            {i + 1}. {a.answer_text}
          </button>
        ))}
      </div>

      {revealed && (
        <div className="mt-6 p-4 bg-gray-700 rounded">
          <p className="text-green-400 font-bold">{q.correct_answer}</p>
          <p className="text-sm mt-2">{q.answer_tip}</p>
        </div>
      )}

      {!revealed && selected !== null && (
        <button onClick={handleAnswer} className="mt-6 w-full bg-blue-600 py-3 rounded-lg">
          Ответить
        </button>
      )}
    </div>
  );
}