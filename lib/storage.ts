export const getStats = () => {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem('pdd_stats');
  return data ? JSON.parse(data) : {};
};

export const saveAnswer = (id: string, correct: boolean) => {
  const stats = getStats();
  stats[id] = { correct, date: Date.now() };
  localStorage.setItem('pdd_stats', JSON.stringify(stats));
};

export const clearStats = () => localStorage.removeItem('pdd_stats');