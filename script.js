// script.js
const tasks = [
  {
    section: "Кинематика",
    difficulty: "Лёгкий",
    question: "Тело прошло 60 м за 3 с. Какова его скорость?",
    answer: "20",
    hints: [
      "Формула скорости: v = S / t",
      "60 / 3 = ?",
      "Ответ: 20 м/с"
    ]
  },
  {
    section: "Динамика",
    difficulty: "Средний",
    question: "Какова сила, если масса тела 10 кг и ускорение 2 м/с²?",
    answer: "20",
    hints: [
      "Формула силы: F = ma",
      "10 × 2 = ?",
      "Ответ: 20 Н"
    ]
  },
  {
    section: "Работа и энергия",
    difficulty: "Сложный",
    question: "Какую работу совершает сила 50 Н при перемещении на 4 м?",
    answer: "200",
    hints: [
      "Формула работы: A = F × s",
      "50 × 4 = ?",
      "Ответ: 200 Дж"
    ]
  }
];

let currentTask = null;
let hintStep = 0;
let score = parseInt(localStorage.getItem("score")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;
let achievements = JSON.parse(localStorage.getItem("achievements")) || [];
let difficulty = localStorage.getItem("difficulty") || "Лёгкий";

const questionEl = document.getElementById("question");
const sectionEl = document.getElementById("section");
const hintEl = document.getElementById("hint");
const scoreEl = document.getElementById("score");
const achievementsEl = document.getElementById("achievements");
const leaderboardEl = document.getElementById("leaderboard");

function loadLeaderboard() {
  const board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardEl.innerHTML = board
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(entry => `<li>${entry.name}: ${entry.score}</li>`) 
    .join("");
}

function saveLeaderboard() {
  const name = prompt("Введите ваше имя для таблицы рекордов:") || "Аноним";
  const board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  board.push({ name, score });
  localStorage.setItem("leaderboard", JSON.stringify(board));
  loadLeaderboard();
}

function getRandomTask() {
  const filtered = tasks.filter(t => t.difficulty === difficulty);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function showTask() {
  hintStep = 0;
  currentTask = getRandomTask();
  questionEl.textContent = currentTask.question;
  sectionEl.textContent = `Раздел: ${currentTask.section}`;
  hintEl.style.display = "none";
  hintEl.textContent = "";
  document.getElementById("answer").value = "";
}

function showHint() {
  if (hintStep < currentTask.hints.length) {
    hintEl.textContent = currentTask.hints[hintStep];
    hintEl.style.display = "block";
    hintStep++;
  }
}

function updateStats() {
  scoreEl.textContent = `Баллы: ${score} | Уровень: ${level}`;
  localStorage.setItem("score", score);
  localStorage.setItem("level", level);
  localStorage.setItem("difficulty", difficulty);
}

function checkAchievements() {
  const levels = [
    { value: 20, text: "🎉 Первый успех!" },
    { value: 50, text: "🏅 Продвинутый уровень!" },
    { value: 100, text: "🥇 Мастер физики!" }
  ];

  levels.forEach(a => {
    if (score >= a.value && !achievements.includes(a.text)) {
      achievements.push(a.text);
      const div = document.createElement("div");
      div.className = "achievement";
      div.textContent = a.text;
      achievementsEl.appendChild(div);
    }
  });
  localStorage.setItem("achievements", JSON.stringify(achievements));
}

function submitAnswer() {
  const userAnswer = document.getElementById("answer").value.trim();
  if (userAnswer === currentTask.answer) {
    alert("Правильно!");
    score += 10;
    if (score % 30 === 0) level++;
    updateStats();
    checkAchievements();
    showTask();
  } else {
    alert("Неправильно. Попробуйте ещё раз или нажмите 'Подсказка'");
  }
}

document.getElementById("difficulty").value = difficulty;
document.getElementById("difficulty").addEventListener("change", (e) => {
  difficulty = e.target.value;
  localStorage.setItem("difficulty", difficulty);
  showTask();
});

window.addEventListener("beforeunload", () => {
  saveLeaderboard();
});

updateStats();
checkAchievements();
showTask();
loadLeaderboard();