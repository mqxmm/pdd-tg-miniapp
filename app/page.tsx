'use client';

import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import AllQuestions from './screens/AllQuestions';
import ExamMode from './screens/ExamMode';
import Stats from './screens/Stats';
import Settings from './screens/Settings';

export default function Home() {
  const [screen, setScreen] = useState<'all' | 'exam' | 'stats' | 'settings'>('exam');

  return (
    <div className="pb-20">
      {screen === 'all' && <AllQuestions />}
      {screen === 'exam' && <ExamMode />}
      {screen === 'stats' && <Stats />}
      {screen === 'settings' && <Settings />}
      <BottomNav current={screen} onChange={setScreen} />
    </div>
  );
}