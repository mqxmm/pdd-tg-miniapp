'use client';

import { useState, useEffect } from 'react';
import QuestionCard from '../../components/QuestionCard';
import { saveAnswer } from '../../lib/storage';

export default function ExamMode() {
  const [ticket, setTicket] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    // Случайный билет от 1 до 40 с русским именем
    const num = Math.floor(Math.random() * 40) + 1;
    const fileName = `Билет ${num}.json`;
    fetch(`/tickets/${encodeURIComponent(fileName)}`)
      .then(r => {
        if (!r.ok) throw new Error('Не найден');
        return r.json();
      })
      .then(setTicket)
      .catch(() => alert('Билет не загружен. Проверь папку public/tickets'));
  }, []);

  const handleAnswer = (correct: boolean) => {
    saveAnswer(ticket[current].id, correct);
    if (correct) setCorrectCount(c => c + 1);
    if (current < ticket.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 1800);
    }
  };

  if (ticket.length === 0) return <div className="text-center pt-20 text-xl">Загрузка билета...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6">
      <div className="text-center mb-6 text-lg font-medium">
        Билет {ticket[0]?.ticket_number?.replace('Билет ', '')} • Вопрос {current + 1}/{ticket.length} • Правильных: {correctCount}
      </div>
      <QuestionCard q={ticket[current]} onAnswer={handleAnswer} />
      {current === ticket.length - 1 && (
        <div className="text-center mt-10 text-2xl font-bold text-green-400">
          Экзамен завершён! {correctCount}/40
        </div>
      )}
    </div>
  );
}