import React, {useEffect, useState, useMemo} from 'react';

// PDD Mini App (single-file React component)
// Default export a React component suitable for preview on Vercel static site or Next.js page.
// Tailwind CSS is assumed to be available in the project.
// How it expects your data and images to be deployed:
// 1) Put all images from the repository into /public/images (preserve subfolders like A_B, C_D, signs, etc.)
// 2) Create a single JSON manifest at /public/data/all_tickets.json that contains an array of all question objects
//    (example object provided in user's message). File can be produced by the Node script included below.
// 3) Deploy to Vercel (static site). The app fetches /data/all_tickets.json and image paths like /images/A_B/xxx.jpg

/*
Node helper (run in repo root) to build all_tickets.json from questions folder:

// build_all_tickets.js
const fs = require('fs');
const path = require('path');
const ticketsRoot = path.join(__dirname, 'questions', 'A_B', 'tickets'); // change if needed
const out = [];
fs.readdirSync(ticketsRoot).forEach(file => {
  if (!file.endsWith('.json')) return;
  const content = JSON.parse(fs.readFileSync(path.join(ticketsRoot, file), 'utf8'));
  // Each file is an array of question objects
  content.forEach(q => out.push(q));
});
fs.mkdirSync(path.join(__dirname, 'public', 'data'), {recursive: true});
fs.writeFileSync(path.join(__dirname, 'public', 'data', 'all_tickets.json'), JSON.stringify(out, null, 2));
console.log('Wrote', out.length, 'questions to public/data/all_tickets.json');

Run: node build_all_tickets.js
Then copy images folder(s) to public/images preserving relative paths.
*/

export default function PDDMiniApp(){
  const [allQuestions, setAllQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all'); // all | exam | stats | settings

  // For 'all' view
  const [search, setSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState('');

  // For exam
  const [examQuestions, setExamQuestions] = useState([]);
  const [examIndex, setExamIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [examModeActive, setExamModeActive] = useState(false);
  const [examResults, setExamResults] = useState([]);
  const [examLength, setExamLength] = useState(20);

  // Stats stored in localStorage under key 'pdd_stats'
  const STATS_KEY = 'pdd_stats_v1';
  const [stats, setStats] = useState(() => {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch(e){ return {}; }
  });

  useEffect(() => {
    fetch('/data/all_tickets.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load questions: ' + res.status);
        return res.json();
      })
      .then(data => {
        setAllQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    try{ localStorage.setItem(STATS_KEY, JSON.stringify(stats)); }catch(e){ }
  }, [stats]);

  const topics = useMemo(() => {
    if (!allQuestions) return [];
    const s = new Set();
    allQuestions.forEach(q => (q.topic || []).forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [allQuestions]);

  function resetStats(){
    setStats({});
    try{ localStorage.removeItem(STATS_KEY); }catch(e){}
  }

  function openExam({length = 20, topic = null}){
    if (!allQuestions) return;
    let pool = allQuestions.slice();
    if (topic) pool = pool.filter(q => (q.topic || []).includes(topic));
    shuffle(pool);
    const chosen = pool.slice(0, Math.min(length, pool.length));
    setExamQuestions(chosen);
    setExamIndex(0);
    setSelectedAnswer(null);
    setExamResults([]);
    setExamModeActive(true);
    setTab('exam');
  }

  function answerCurrent(idx){
    const q = examQuestions[examIndex];
    const isCorrect = q.answers[idx] && q.answers[idx].is_correct;
    const res = {id: q.id, chosen: idx, correct: isCorrect};
    setExamResults(prev => [...prev, res]);

    // update stats
    setStats(prev => {
      const cur = {...prev};
      const s = cur[q.id] || {attempts:0, correct:0, last: null};
      s.attempts++;
      if (isCorrect) s.correct++;
      s.last = new Date().toISOString();
      cur[q.id] = s;
      return cur;
    });

    setSelectedAnswer(idx);
  }

  function nextExam(){
    setSelectedAnswer(null);
    if (examIndex + 1 < examQuestions.length){
      setExamIndex(examIndex + 1);
    } else {
      // finish
      setExamModeActive(false);
      setTab('stats');
    }
  }

  function shuffle(arr){
    for (let i = arr.length -1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  if (loading) return <div className="p-6">Загрузка...</div>;
  if (!allQuestions) return <div className="p-6">Не удалось загрузить вопросы. Убедитесь, что /data/all_tickets.json доступен.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6">
        <Header setTab={setTab} tab={tab} />

        <div className="mt-4">
          {tab === 'all' && (
            <AllQuestionsView
              allQuestions={allQuestions}
              search={search}
              setSearch={setSearch}
              topics={topics}
              filterTopic={filterTopic}
              setFilterTopic={setFilterTopic}
              openExam={openExam}
            />
          )}

          {tab === 'exam' && (
            <ExamView
              examModeActive={examModeActive}
              examQuestions={examQuestions}
              examIndex={examIndex}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={setSelectedAnswer}
              answerCurrent={answerCurrent}
              nextExam={nextExam}
              examResults={examResults}
              setExamLength={setExamLength}
              examLength={examLength}
              openExam={openExam}
            />
          )}

          {tab === 'stats' && (
            <StatsView stats={stats} allQuestions={allQuestions} resetStats={resetStats} />
          )}

          {tab === 'settings' && (
            <SettingsView resetStats={resetStats} />
          )}
        </div>
      </div>
    </div>
  );
}

function Header({setTab, tab}){
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl md:text-2xl font-semibold">PДД — Подготовка</h1>
      <nav className="space-x-2">
        <button className={`px-3 py-1 rounded ${tab==='all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('all')}>Все вопросы</button>
        <button className={`px-3 py-1 rounded ${tab==='exam' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('exam')}>Экзамен</button>
        <button className={`px-3 py-1 rounded ${tab==='stats' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('stats')}>Статистика</button>
        <button className={`px-3 py-1 rounded ${tab==='settings' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('settings')}>Настройки</button>
      </nav>
    </div>
  );
}

function AllQuestionsView({allQuestions, search, setSearch, topics, filterTopic, setFilterTopic, openExam}){
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let arr = allQuestions;
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter(q => (q.question||'').toLowerCase().includes(s) || (q.ticket_number||'').toLowerCase().includes(s) || (q.title||'').toLowerCase().includes(s));
    }
    if (filterTopic) arr = arr.filter(q => (q.topic||[]).includes(filterTopic));
    return arr;
  }, [allQuestions, search, filterTopic]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <div className="flex gap-2 items-center">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск по тексту/номеру" className="border rounded px-3 py-2" />
          <select value={filterTopic} onChange={e=>setFilterTopic(e.target.value)} className="border rounded px-3 py-2">
            <option value="">Все темы</option>
            {topics.map(t=> <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={()=>openExam({length:20})}>Экзамен: 20 вопросов</button>
          <button className="px-3 py-2 bg-yellow-600 text-white rounded" onClick={()=>openExam({length:40})}>Экзамен: 40 вопросов</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(q => (
          <div key={q.id} className="border rounded p-3 bg-gray-50">
            <div className="flex gap-3">
              <div className="w-28 h-20 bg-white border flex-shrink-0 overflow-hidden rounded">
                <SafeImage src={q.image} alt={q.title || 'image'} />
              </div>
              <div>
                <div className="text-sm text-gray-500">{q.ticket_number} · {q.ticket_category}</div>
                <div className="font-medium">{q.question}</div>
                <div className="mt-2 text-xs text-gray-600">{(q.topic||[]).join(', ')}</div>
                <div className="mt-2">
                  <button className="text-sm text-blue-600" onClick={()=>setSelected(selected===q.id?null:q.id)}>{selected===q.id ? 'Скрыть' : 'Показать'}</button>
                </div>
              </div>
            </div>
            {selected===q.id && (
              <div className="mt-3">
                {q.answers.map((a, i)=> (
                  <div key={i} className={`p-2 rounded ${a.is_correct ? 'bg-green-50 border border-green-200' : 'bg-white'}`}>
                    <div className="text-sm">{i+1}. {a.answer_text}</div>
                  </div>
                ))}
                <div className="mt-2 text-xs text-gray-700">{q.answer_tip}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SafeImage({src, alt}){
  if (!src) return <div className="w-full h-full bg-gray-200 flex items-center justify-center">нет</div>;
  // src in JSON looks like './images/A_B/xxx.jpg' or './images/no_image.jpg'
  let path = src.replace(/^\.\/+/,'/').replace(/^\//,'/');
  // Ensure leading /
  if (!path.startsWith('/')) path = '/' + path;
  // If path doesn't contain /images, try prefixing /images/
  if (!path.includes('/images/')) path = '/images' + path;
  return <img src={path} alt={alt} className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.src='/images/no_image.jpg';}} />;
}

function ExamView({examModeActive, examQuestions, examIndex, selectedAnswer, setSelectedAnswer, answerCurrent, nextExam, examResults, setExamLength, examLength, openExam}){
  if (!examQuestions || examQuestions.length===0){
    return (
      <div className="p-4">
        <div className="mb-4">Экзамен не запущен.</div>
        <div className="flex gap-2">
          <input type="number" value={examLength} onChange={e=>setExamLength(Math.max(5, Math.min(120, Number(e.target.value)||20)))} className="border rounded px-3 py-2 w-24" />
          <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={()=>openExam({length:examLength})}>Начать экзамен</button>
        </div>
      </div>
    );
  }

  const q = examQuestions[examIndex];
  const answered = examResults.find(r=>r.id===q.id);

  return (
    <div>
      <div className="text-sm text-gray-600">Вопрос {examIndex+1} / {examQuestions.length}</div>
      <div className="mt-3 border rounded p-4 bg-white">
        <div className="md:flex gap-4">
          <div className="w-full md:w-1/3 h-48 bg-gray-100 overflow-hidden rounded">
            <SafeImage src={q.image} alt={q.title} />
          </div>
          <div className="flex-1">
            <div className="font-medium">{q.question}</div>
            <div className="mt-3 space-y-2">
              {q.answers.map((a,i)=>{
                const isSel = selectedAnswer === i || (answered && answered.chosen===i);
                const isCorrect = a.is_correct;
                const cls = answered ? (isCorrect ? 'bg-green-50 border border-green-200' : (isSel ? 'bg-red-50 border border-red-200' : 'bg-white')) : (isSel ? 'bg-blue-50 border border-blue-200' : 'bg-white');
                return (
                  <button key={i} disabled={!!answered} onClick={()=>{ setSelectedAnswer(i); answerCurrent(i); }} className={`w-full text-left p-3 rounded ${cls}`}>
                    <div>{i+1}. {a.answer_text}</div>
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className="mt-3 text-sm text-gray-700">
                <div><strong>{answered.correct ? 'Верно' : 'Неверно'}</strong></div>
                <div className="mt-2">{q.correct_answer}</div>
                <div className="mt-2 text-xs text-gray-600">{q.answer_tip}</div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button className="px-3 py-2 bg-gray-200 rounded" onClick={nextExam}>{examIndex+1 < examQuestions.length ? 'Далее' : 'Завершить'}</button>
              <div className="text-sm text-gray-500 self-center">Ответы: {examResults.length} / {examQuestions.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsView({stats, allQuestions, resetStats}){
  const totalAnswered = Object.values(stats).reduce((s, v) => s + (v.attempts||0), 0);
  const totalCorrect = Object.values(stats).reduce((s, v) => s + (v.correct||0), 0);
  const questionsAttempted = Object.keys(stats).length;

  // Top problematic questions (lowest correctness with enough attempts)
  const list = Object.entries(stats).map(([id, v])=>({id, ...v}));
  list.sort((a,b)=>{
    const rateA = (a.correct||0)/(a.attempts||1);
    const rateB = (b.correct||0)/(b.attempts||1);
    return rateA - rateB;
  });

  function qById(id){ return allQuestions.find(q=>q.id===id); }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">Всего попыток: <div className="text-lg font-semibold">{totalAnswered}</div></div>
        <div className="p-4 border rounded">Всего верных: <div className="text-lg font-semibold">{totalCorrect}</div></div>
        <div className="p-4 border rounded">Уникальных вопросов: <div className="text-lg font-semibold">{questionsAttempted}</div></div>
      </div>

      <div className="mt-4">
        <h3 className="font-medium">Наиболее сложные вопросы</h3>
        <div className="mt-2 space-y-2">
          {list.slice(0,10).map(item=>{
            const q = qById(item.id);
            const rate = Math.round(((item.correct||0)/(item.attempts||1))*100);
            return (
              <div key={item.id} className="border p-3 rounded bg-gray-50">
                <div className="text-sm text-gray-500">{q ? q.ticket_number : ''} · попыток {item.attempts} · {rate}%</div>
                <div className="font-medium">{q ? q.question : item.id}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={resetStats}>Сбросить статистику</button>
      </div>
    </div>
  );
}

function SettingsView({resetStats}){
  return (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="font-medium">Настройки</h3>
        <div className="mt-2 text-sm text-gray-600">Здесь можно сбросить статистику и посмотреть информацию об приложении.</div>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={resetStats}>Сбросить статистику</button>
        <a className="px-3 py-2 bg-gray-200 rounded" href="https://github.com/etspring/pdd_russia" target="_blank" rel="noreferrer">Исходники</a>
      </div>

      <div className="pt-2 border-t mt-2">
        <div className="text-sm">О приложении</div>
        <div className="text-xs text-gray-600 mt-1">Mini app для подготовки к ПДД. Вопросы и картинки — из вашего репозитория. Разработано для хостинга на Vercel.</div>
      </div>

      <div>
        <a className="text-sm text-blue-600" href="https://vercel.com/new" target="_blank" rel="noreferrer">Развернуть на Vercel</a>
      </div>
    </div>
  );
}
