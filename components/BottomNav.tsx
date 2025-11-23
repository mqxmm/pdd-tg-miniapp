export default function BottomNav({ 
  current, 
  onChange 
}: { 
  current: string; 
  onChange: (s: 'all' | 'exam' | 'stats' | 'settings') => void 
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
      <div className="flex justify-around py-3 text-sm">
        <button onClick={() => onChange('all')} className={current === 'all' ? 'text-green-400' : 'text-gray-400'}>
          Все вопросы
        </button>
        <button onClick={() => onChange('exam')} className={current === 'exam' ? 'text-green-400' : 'text-gray-400'}>
          Экзамен
        </button>
        <button onClick={() => onChange('stats')} className={current === 'stats' ? 'text-green-400' : 'text-gray-400'}>
          Статистика
        </button>
        <button onClick={() => onChange('settings')} className={current === 'settings' ? 'text-green-400' : 'text-gray-400'}>
          Настройки
        </button>
      </div>
    </div>
  );
}