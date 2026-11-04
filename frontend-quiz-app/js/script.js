// ---------- Quiz data ----------
const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Tool Multi Language",
      "Home Text Markup Level"
    ],
    answer: 0
  },
  {
    question: "Which tag is used for the largest heading?",
    options: ["<h6>", "<head>", "<h1>", "<heading>"],
    answer: 2
  },
  {
    question: "Which CSS property changes the text color?",
    options: ["font-color", "color", "text-style", "background"],
    answer: 1
  },
  {
    question: "Which CSS layout system arranges items in rows and columns?",
    options: ["Float", "Flexbox", "Grid", "Both Flexbox and Grid"],
    answer: 3
  },
  {
    question: "Which keyword declares a constant in JavaScript?",
    options: ["var", "let", "const", "static"],
    answer: 2
  },
  {
    question: "Which method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: 0
  },
  {
    question: "Which symbol is used for ID selectors in CSS?",
    options: [".", "#", "*", "&"],
    answer: 1
  },
  {
    question: "Which method selects an element by its ID in JavaScript?",
    options: [
      "document.getElementById()",
      "document.queryClass()",
      "document.findId()",
      "document.selectById()"
    ],
    answer: 0
  }
];

const TIME_LIMIT = 15;

// ---------- State ----------
let currentIndex = 0;
let score = 0;
let timeLeft = TIME_LIMIT;
let timerId = null;
let answered = false;

// ---------- Elements ----------
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionCount = document.getElementById("question-count");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");

// ---------- Helpers ----------
function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

// ---------- Quiz flow ----------
function startQuiz() {
  currentIndex = 0;
  score = 0;
  showScreen(quizScreen);
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  nextBtn.disabled = true;

  const q = questions[currentIndex];
  questionCount.textContent = `Question ${currentIndex + 1} / ${questions.length}`;
  progressBar.style.width = `${(currentIndex / questions.length) * 100}%`;
  questionText.textContent = q.question;
  nextBtn.textContent = currentIndex === questions.length - 1 ? "Finish" : "Next";

  optionsBox.innerHTML = "";
  q.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", () => selectAnswer(i));
    optionsBox.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = TIME_LIMIT;
  updateTimer();

  timerId = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      selectAnswer(-1); // time is up, no option chosen
    }
  }, 1000);
}

function updateTimer() {
  timerEl.textContent = `⏱ ${timeLeft}`;
  timerEl.classList.toggle("warning", timeLeft <= 5);
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const correctIndex = questions[currentIndex].answer;
  const buttons = optionsBox.querySelectorAll(".option");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add("correct");
  });

  if (selectedIndex === correctIndex) {
    score++;
  } else if (buttons[selectedIndex]) {
    buttons[selectedIndex].classList.add("wrong");
  }

  nextBtn.disabled = false;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  clearInterval(timerId);
  progressBar.style.width = "100%";
  showScreen(resultScreen);
  scoreEl.textContent = `${score} / ${questions.length}`;

  const percent = (score / questions.length) * 100;
  if (percent === 100) {
    messageEl.textContent = "Perfect score! Outstanding! 🏆";
  } else if (percent >= 70) {
    messageEl.textContent = "Great job! Keep it up! 👏";
  } else if (percent >= 40) {
    messageEl.textContent = "Good effort. A little more practice! 💪";
  } else {
    messageEl.textContent = "Keep learning and try again! 📚";
  }
}

// ---------- Events ----------
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startQuiz);