//type box that you can backspace
//song picker/loader


let volume = 0;
let level = 1;

let comboLength = 3;
let maxTime = 5;

let currentCombo = "";
let timeLeft = 5;
let timerInterval = null;
let listening = false;
let inputBuffer = "";


const audio = document.getElementById("audio");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

document.addEventListener("DOMContentLoaded", () => {

  startBtn.addEventListener("click", startGame);
  stopBtn.addEventListener("click", stopGame);

});


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
  audio.play();
  updateUI();
  startQTE();
}

function startQTE() {
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

    if (timeLeft <= 0) failQTE(); }, 100);
}


function successQTE() {
  clearInterval(timerInterval);
  listening = false;

  level++;
  volume = Math.min(volume + 10, 100);

  comboLength = 3 + Math.floor(level / 2);
  maxTime = Math.max(1.5, 5 - level * 0.3);

  updateUI();

  document.getElementById("qteDisplay").textContent = "✔";

  setTimeout(startQTE, 700);
}

function failQTE() {
  clearInterval(timerInterval);
  listening = false;

  level = Math.max(1, level - 1);

  document.getElementById("qteDisplay").textContent = "X";

  setTimeout(startQTE, 700);
}

function stopGame() {
  listening = false;
  clearInterval(timerInterval);

  audio.pause();

  document.getElementById("qteDisplay").textContent = "Stopped";
  document.getElementById("timer").textContent = "";
}

document.addEventListener("keydown", (e) => {
  if (!listening) return;

  inputBuffer += e.key.toUpperCase();

  if (inputBuffer.length > currentCombo.length) {
    inputBuffer = inputBuffer.slice(-currentCombo.length);
  }

  if (inputBuffer === currentCombo) {
    inputBuffer = "";
    successQTE();
  }
});