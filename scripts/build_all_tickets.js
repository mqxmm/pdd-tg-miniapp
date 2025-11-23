// scripts/build_all_tickets.js
const fs = require('fs');
const path = require('path');

const ticketsRoot = path.join(__dirname, '..', 'questions', 'A_B', 'tickets'); // путь к вашим JSON билетам
const outDir = path.join(__dirname, '..', 'public', 'data');

const out = [];

fs.readdirSync(ticketsRoot).forEach(file => {
  if (!file.endsWith('.json')) return;
  const content = JSON.parse(fs.readFileSync(path.join(ticketsRoot, file), 'utf8'));
  // каждый файл - массив вопросов
  content.forEach(q => {
    // нормализуем путь к картинке: если в json './images/...' оставить как есть
    out.push(q);
  });
});

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'all_tickets.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote', out.length, 'questions to public/data/all_tickets.json');
