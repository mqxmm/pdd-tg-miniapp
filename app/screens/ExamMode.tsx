'use client';

import { useState, useEffect } from 'react';
import QuestionCard from '../../components/QuestionCard';
import { saveAnswer } from '../../lib/storage';

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
      setTimeout(() => setCurrent(c => c + 1), 1800);
    }
  };

  if (ticket.length === 0) return <div className="text-center pt-20 text-xl">Загрузка билета...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6">
      <div className="text-center mb-6 text-lg font-medium">
        Вопрос {current + 1}/40 | Правильных: {correctCount}
      </div>
      <QuestionCard q={ticket[current]} onAnswer={handleAnswer} />
      {current === 39 && (
        <div className="text-center mt-10 text-2xl font-bold text-green-400">
          Экзамен завершён! {correctCount + (ticket[39].answers.find((a: any) => a.is_correct)?.is_correct ? 1 : 0)}/40
        </div>
      )}
    </div>
  );
}