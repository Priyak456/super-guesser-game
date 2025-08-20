'use strict';

// --- ELEMENT SELECTION ---
const messageDisplay = document.querySelector('.message');
const numberDisplay = document.querySelector('.number');
const scoreDisplay = document.querySelector('.score');
const guessInput = document.querySelector('.guess');
const checkButton = document.querySelector('.check');
const againButton = document.querySelector('.again');
const highscoreDisplay = document.querySelector('.highscore');
const bodyElement = document.querySelector('body');
const betweenText = document.querySelector('.between');
const difficultyButtons = document.querySelectorAll('.btn-difficulty');

// --- GAME CONFIGURATION ---
const difficultySettings = {
  easy: { max: 50, score: 15 },
  medium: { max: 100, score: 10 },
  hard: { max: 200, score: 5 },
};

let secretNumber;
let score;
let highscore = 0;
let currentDifficulty = 'medium';

// --- NEW (FEATURE 1): LOAD HIGHSCORE FROM LOCALSTORAGE ---
const storedHighscore = localStorage.getItem('highscore');
if (storedHighscore) {
  highscore = Number(storedHighscore);
  highscoreDisplay.textContent = highscore;
}

// --- GAME LOGIC FUNCTIONS ---
const resetGame = function () {
  const settings = difficultySettings[currentDifficulty];
  score = settings.score;
  secretNumber = Math.trunc(Math.random() * settings.max) + 1;

  displayMessage('Start guessing...');
  scoreDisplay.textContent = score;
  numberDisplay.textContent = '?';
  guessInput.value = '';
  betweenText.textContent = `(Between 1 and ${settings.max})`;

  bodyElement.classList.remove('winner-animation', 'loser-background');
  bodyElement.style.backgroundColor = 'var(--color-bg)';
  numberDisplay.style.width = '15rem';
};

const displayMessage = function (message) {
  messageDisplay.textContent = message;
};

// --- NEW (FEATURE 2): REUSABLE GUESS HANDLING FUNCTION ---
const handleGuess = function () {
  const guess = Number(guessInput.value);

  if (!guess) {
    displayMessage('⛔️ No number!');
  } else if (guess === secretNumber) {
    displayMessage('🎉 Correct Number!');
    numberDisplay.textContent = secretNumber;
    bodyElement.classList.add('winner-animation');
    numberDisplay.style.width = '30rem';

    if (score > highscore) {
      highscore = score;
      highscoreDisplay.textContent = highscore;
      localStorage.setItem('highscore', highscore); // Save new highscore
    }
  } else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(guess > secretNumber ? '📈 Too high!' : '📉 Too low!');
      score--;
      scoreDisplay.textContent = score;
    } else {
      displayMessage('💥 You lost the game!');
      scoreDisplay.textContent = 0;
      numberDisplay.textContent = secretNumber;
      bodyElement.classList.add('loser-background');
    }
  }
};

// --- EVENT LISTENERS ---
checkButton.addEventListener('click', handleGuess);

// --- NEW (FEATURE 2): "ENTER" KEY SUPPORT ---
guessInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    handleGuess();
  }
});

againButton.addEventListener('click', resetGame);

difficultyButtons.forEach(button => {
  button.addEventListener('click', function () {
    currentDifficulty = this.dataset.difficulty;
    difficultyButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    resetGame();
  });
});

// --- INITIALIZE THE GAME ---
resetGame();