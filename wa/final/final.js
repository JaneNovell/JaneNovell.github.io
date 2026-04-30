let volume = 0;
let level = 1;

let comboLength = 3;
let maxTime = 5;

let currentCombo = "";
let timeLeft = 5;
let timerInterval = null;
let listening = false;
let inputBuffer = "";
let qteTimeout = null;
let gain = 1;

const audio = document.getElementById("audio");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const songPicker = document.getElementById("songPicker");
const typeInput = document.getElementById("typeInput");

document.addEventListener("DOMContentLoaded", () => {
  const volumeSlider = document.getElementById("volumeSlider");

  startBtn.addEventListener("click", startGame);
  stopBtn.addEventListener("click", stopGame);
  resetBtn.addEventListener("click", resetGame);

  volumeSlider.addEventListener("input", () => {
    gain = parseInt(volumeSlider.value);
    document.getElementById("gainText").textContent = gain;
  });

  songPicker.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    audio.pause();
    audio.src = url;
    audio.load();
  });
});

function resetGame() {
  listening = false;
  clearInterval(timerInterval);
  clearTimeout(qteTimeout);

  audio.pause();
  audio.currentTime = 0;

  volume = 0;
  level = 1;
  comboLength = 3;
  maxTime = 5;
  currentCombo = "";
  inputBuffer = "";

  typeInput.value = "";
  document.getElementById("qteDisplay").textContent = "Press Start";
  document.getElementById("timer").textContent = "";

  updateUI();
}

const keys = "ASDFJKLQWERTYUIOPZXCVBNM";

function randomCombo(length) {
  let combo = "";
  for (let i = 0; i < length; i++) {
    combo += keys[Math.floor(Math.random() * keys.length)];
  }
  return combo;
}

function updateUI() {
  document.getElementById("volumeBar").style.width = volume + "%";
  document.getElementById("volumeText").textContent = volume + "%";
  document.getElementById("levelText").textContent = level;

  audio.volume = volume / 100;
}

function startGame() {
  clearInterval(timerInterval);
  clearTimeout(qteTimeout);

  if (!audio.src) {
    alert("Please select a song first");
    return;
  }

  audio.play().catch(() => {});
  typeInput.focus();

  updateUI();
  startQTE();
}

function startQTE() {
  typeInput.focus();
  typeInput.value = "";

  if (volume >= 100) {
    document.getElementById("qteDisplay").textContent = "MAX VOLUME!";
    return;
  }

  currentCombo = randomCombo(comboLength);
  document.getElementById("qteDisplay").textContent = currentCombo;

  timeLeft = maxTime;
  listening = true;
  inputBuffer = "";

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    document.getElementById("timer").textContent =
      `Time: ${timeLeft.toFixed(1)}s`;

    if (timeLeft <= 0) failQTE();
  }, 100);
}

function successQTE() {
  clearInterval(timerInterval);
  listening = false;

  level++;
  volume = Math.min(volume + gain, 100);

  comboLength = 3 + Math.floor(level / 2);
  maxTime = Math.max(1.5, 5 - level * 0.3);

  updateUI();

  document.getElementById("qteDisplay").textContent = "✔";

  qteTimeout = setTimeout(startQTE, 700);
}

function failQTE() {
  if (!listening) return;

  clearInterval(timerInterval);
  listening = false;

  level = Math.max(1, level - 1);

  document.getElementById("qteDisplay").textContent = "X";

  qteTimeout = setTimeout(startQTE, 700);
}

function stopGame() {
  listening = false;
  clearInterval(timerInterval);
  clearTimeout(qteTimeout);

  audio.pause();

  document.getElementById("qteDisplay").textContent = "Stopped";
  document.getElementById("timer").textContent = "";
}

typeInput.addEventListener("input", () => {
  if (!listening) return;

  let value = typeInput.value.toUpperCase().replace(/[^A-Z]/g, "");

  if (value.length > currentCombo.length) {
    value = value.slice(0, currentCombo.length);
  }

  typeInput.value = value;
  inputBuffer = value;

  if (inputBuffer === currentCombo) {
    inputBuffer = "";
    typeInput.value = "";
    successQTE();
  }
});