let gameSequence = [];      
let playerSequence = [];    
let score = 0;            
let highScore = 0;
let isPlayingSequence = false;
let isGameActive = false;
const tones = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; 
const audioCtx = new (window.AudioContext)();
const boxes = document.querySelectorAll('.box');
const startBtn = document.getElementById('start-btn');
const scoreBoard = document.getElementById('score-board');
function playTone(index) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = tones[index];
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4); 
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.4);
}

function flashBox(index) {
    const box = document.querySelector(`.box-${index}`);
    box.classList.add('active'); 
    playTone(index);
    setTimeout(() => {
        box.classList.remove('active'); 
    }, 300);
}
async function playSequence() {
    isPlayingSequence = true;
    startBtn.disabled = true;
    startBtn.innerText = "Watch...";
    for (let i = 0; i < gameSequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        flashBox(gameSequence[i]);
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    isPlayingSequence = false;
    startBtn.innerText = "Your Turn!";
}
function nextLevel() {
    playerSequence = [];
    const randomBoxIndex = Math.floor(Math.random() * 6); 
    gameSequence.push(randomBoxIndex);
    scoreBoard.innerText = `Score: ${score} | High Score: ${highScore}`;
    playSequence();
}
function startGame() {
    if (isPlayingSequence) return;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume(); 
    }
    gameSequence = [];
    score = 0;
    isGameActive = true;
    nextLevel();
}
function handleBoxClick(e) {
    if (isPlayingSequence || !isGameActive) return;
    const clickedIndex = parseInt(e.target.getAttribute('data-index'));
    flashBox(clickedIndex);
    playerSequence.push(clickedIndex);
    const currentStep = playerSequence.length - 1;
    if (playerSequence[currentStep] !== gameSequence[currentStep]) {
        isGameActive = false;
        if (score > highScore) highScore = score;
        scoreBoard.innerText = `Game Over! Final Score: ${score} | High Score: ${highScore}`;
        startBtn.disabled = false;
        startBtn.innerText = "Try Again";
        return;
    }
    if (playerSequence.length === gameSequence.length) {
        score++;
        setTimeout(nextLevel, 1000);
    }
}
startBtn.addEventListener('click', startGame);
boxes.forEach(box => box.addEventListener('click', handleBoxClick));
