'use client';

import { useState, useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';
import { saveAnswer } from '@/lib/storage';

export default function ExamMode() {
  const [ticket, setTicket] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const num = Math.floor(Math.random() * 40) + 1;
    fetch(`/tickets/ticket_${num.toString().padStart(2, '0')}.json`)
      .then(r => r.json())
      .then(setTicket);
  }, []);

  const handleAnswer = (correct: boolean) => {
    saveAnswer(ticket[current].id, correct);
    if (correct) setCorrectCount(c => c + 1);
    if (current < 39) {
      setTimeout(() => setCurrent(c => c + 1), 1500);
    }
  };

  if (ticket.length === 0) return <div className="text-center pt-10">Загрузка билета...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4">
      <div className="text-center mb-6 text-lg">
        Вопрос {current + 1}/40 | Правильных: {correctCount}
      </div>
      <QuestionCard q={ticket[current]} onAnswer={handleAnswer} />
      {current === 39 && <div className="text-center mt-10 text-2xl">Экзамен завершён!</div>}
    </div>
  );
}