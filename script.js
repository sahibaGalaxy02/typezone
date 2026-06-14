const quoteEl = document.getElementById("quote");
const input = document.getElementById("input");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");

const resultEl = document.getElementById("result");
const finalWpmEl = document.getElementById("final-wpm");
const finalAccuracyEl = document.getElementById("final-accuracy");
const restartBtn = document.getElementById("restart-btn");

const texts = [
  "just if how great many the problem while never you through into under than right eye",
  "practice typing every day to improve speed and accuracy",
  "learning by doing is the best way to master skills",
  "focus on accuracy before increasing your typing speed",
  "typing fast comes from calm and consistent practice !!,
];

let letters = [];
let index = 0;
let time = 30;
let started = false;
let interval = null;
let typedStates = [];

function loadSentence() {
  index = 0;
  const text = texts[Math.floor(Math.random() * texts.length)];

  quoteEl.innerHTML = text
    .split("")
    .map((c, i) => `<span class="${i === 0 ? "active" : ""}">${c}</span>`)
    .join("");

  letters = quoteEl.querySelectorAll("span");
  typedStates = new Array(letters.length).fill(null);
}

function startTimer() {
  if (started) return;
  started = true;

  interval = setInterval(() => {
    time--;
    timerEl.innerText = time;
    updateStats();

    if (time <= 0) {
      clearInterval(interval);
      document.removeEventListener("keydown", handleKey);
      showResult();
    }
  }, 1000);
}

function getCorrectChars() {
  return typedStates.filter(state => state === true).length;
}

function getTotalTyped() {
  return typedStates.filter(state => state !== null).length;
}

function updateStats() {
  const correctChars = getCorrectChars();
  const totalTyped = getTotalTyped();

  const elapsed = (30 - time) / 60;
  const wpm = elapsed > 0 ? Math.round((correctChars / 5) / elapsed) : 0;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0;

  wpmEl.innerText = `${wpm} wpm`;
  return { correctChars, totalTyped, wpm, accuracy };
}

function handleKey(e) {
  const current = letters[index];
  startTimer();

  if (e.key === "Enter") {
    e.preventDefault();
    return;
  }

  if (e.key === "Backspace") {
    e.preventDefault();

    if (index === 0) return;

    letters[index]?.classList.remove("active");
    index--;
    typedStates[index] = null;
    letters[index].classList.remove("correct", "wrong");
    letters[index].classList.add("active");
    updateStats();
    return;
  }

  if (e.key.length !== 1 || !current) return;

  if (e.key === current.innerText) {
    current.classList.add("correct");
    current.classList.remove("wrong");
    typedStates[index] = true;
  } else {
    current.classList.add("wrong");
    current.classList.remove("correct");
    typedStates[index] = false;
  }

  current.classList.remove("active");
  index++;
  updateStats();

  if (index === letters.length) {
    loadSentence();
    updateStats();
    return;
  }

  letters[index].classList.add("active");
}

function showResult() {
  const { wpm, accuracy } = updateStats();
  finalWpmEl.innerText = wpm;
  finalAccuracyEl.innerText = accuracy;
  resultEl.classList.remove("hidden");
}

function resetTest() {
  clearInterval(interval);
  started = false;
  time = 30;

  timerEl.innerText = time;
  wpmEl.innerText = "0 wpm";
  resultEl.classList.add("hidden");

  document.removeEventListener("keydown", handleKey);
  loadSentence();
  document.addEventListener("keydown", handleKey);
  input.focus();
}

loadSentence();
timerEl.innerText = time;
document.addEventListener("keydown", handleKey);
restartBtn.addEventListener("click", resetTest);
input.focus();
