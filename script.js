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
  "typing fast comes from calm and consistent practice"
];

let letters = [];
let index = 0;

let time = 30;
let started = false;
let interval = null;

let correctChars = 0;
let totalTyped = 0;


function loadSentence() {
  index = 0;
  const text = texts[Math.floor(Math.random() * texts.length)];

  quoteEl.innerHTML = text
    .split("")
    .map((c, i) => `<span class="${i === 0 ? "active" : ""}">${c}</span>`)
    .join("");

  letters = quoteEl.querySelectorAll("span");
}

function startTimer() {
  if (started) return;
  started = true;

  interval = setInterval(() => {
    time--;
    timerEl.innerText = time;
    updateWPM();

    if (time === 0) {
      clearInterval(interval);
      document.removeEventListener("keydown", handleKey);
      showResult();
    }
  }, 1000);
}

function updateWPM() {
  const elapsed = (30 - time) / 60;
  if (elapsed > 0) {
    const wpm = Math.round((correctChars / 5) / elapsed);
    wpmEl.innerText = `${wpm} wpm`;
  }
}

// KEYS
function handleKey(e) {
  const current = letters[index];
  startTimer();

  if (e.key === "Enter") {
    resetTest();
    return;
  }

  if (e.key === "Backspace") {
    if (index === 0) return;
    letters[index]?.classList.remove("active");
    index--;
    letters[index].classList.remove("correct", "wrong");
    letters[index].classList.add("active");
    return;
  }

  if (e.key.length !== 1 || !current) return;

  totalTyped++;

  if (e.key === current.innerText) {
    current.classList.add("correct");
    correctChars++;
  } else {
    current.classList.add("wrong");
  }

  current.classList.remove("active");
  index++;

  if (index === letters.length) {
    loadSentence();
    return;
  }

  letters[index].classList.add("active");
}

function showResult() {
  const minutes = 30 / 60;
  const wpm = Math.round((correctChars / 5) / minutes);
  const accuracy = totalTyped
    ? Math.round((correctChars / totalTyped) * 100)
    : 0;

  finalWpmEl.innerText = wpm;
  finalAccuracyEl.innerText = accuracy;
  resultEl.classList.remove("hidden");
}

function resetTest() {
  clearInterval(interval);
  started = false;
  time = 30;
  correctChars = 0;
  totalTyped = 0;

  timerEl.innerText = time;
  wpmEl.innerText = "0 wpm";
  resultEl.classList.add("hidden");

  document.addEventListener("keydown", handleKey);
  loadSentence();
}

loadSentence();
timerEl.innerText = time;
document.addEventListener("keydown", handleKey);
restartBtn.addEventListener("click", resetTest);
input.focus();
