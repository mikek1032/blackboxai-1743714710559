// Game variables
let gameRunning = false;
let selectedCar = '';
let timer = 30;
let gameInterval;
let ferrari = {
    x: 100,
    y: 300,
    speed: 0,
    maxSpeed: 10,
    acceleration: 0.1,
    deceleration: 0.05,
    direction: 0, // -1 left, 0 straight, 1 right
    width: 80,
    height: 160
};

let ford = {
    x: 100,
    y: 150,
    speed: 0,
    maxSpeed: 8,
    acceleration: 0.08,
    deceleration: 0.03,
    direction: 0,
    width: 80,
    height: 160
};

// DOM elements
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const resultsScreen = document.getElementById('resultsScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const timerDisplay = document.getElementById('timer');
const ferrariSpeedDisplay = document.getElementById('ferrariSpeed');
const fordSpeedDisplay = document.getElementById('fordSpeed');
const winnerText = document.getElementById('winnerText');
const winnerImage = document.getElementById('winnerImage');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Car selection
document.querySelectorAll('.car-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.car-option').forEach(opt => {
            opt.classList.remove('border-2', 'border-red-600');
        });
        option.classList.add('border-2', 'border-red-600');
        selectedCar = option.dataset.car;
    });
});

// Start game
startBtn.addEventListener('click', () => {
    if (!selectedCar) {
        alert('Please select a car first!');
        return;
    }
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
});

// Restart game
restartBtn.addEventListener('click', () => {
    resultsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    resetGame();
});

// Key controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    // Ferrari controls (arrow keys)
    if (e.key === 'ArrowRight') ferrari.direction = 1;
    if (e.key === 'ArrowLeft') ferrari.direction = -1;
    if (e.key === 'ArrowUp') ferrari.speed = Math.min(ferrari.speed + ferrari.acceleration, ferrari.maxSpeed);
    if (e.key === 'ArrowDown') ferrari.speed = Math.max(ferrari.speed - ferrari.deceleration, 0);

    // Ford controls (WASD)
    if (e.key === 'd') ford.direction = 1;
    if (e.key === 'a') ford.direction = -1;
    if (e.key === 'w') ford.speed = Math.min(ford.speed + ford.acceleration, ford.maxSpeed);
    if (e.key === 's') ford.speed = Math.max(ford.speed - ford.deceleration, 0);
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') ferrari.direction = 0;
    if (e.key === 'd' || e.key === 'a') ford.direction = 0;
});

function startGame() {
    gameRunning = true;
    resetGame();
    gameInterval = setInterval(updateGame, 20);
}

function resetGame() {
    timer = 30;
    ferrari = {
        x: 100,
        y: 300,
        speed: 0,
        direction: 0
    };
    ford = {
        x: 100,
        y: 150,
        speed: 0,
        direction: 0
    };
}

function updateGame() {
    // Update car positions
    ferrari.x += ferrari.direction * 5;
    ford.x += ford.direction * 5;

    // Boundary checking
    ferrari.x = Math.max(0, Math.min(canvas.width - ferrari.width, ferrari.x));
    ford.x = Math.max(0, Math.min(canvas.width - ford.width, ford.x));

    // Update timer
    timer -= 0.02;
    timerDisplay.textContent = Math.max(0, Math.floor(timer)).toString();

    // Update speed displays
    ferrariSpeedDisplay.textContent = Math.floor(ferrari.speed * 20);
    fordSpeedDisplay.textContent = Math.floor(ford.speed * 20);

    // Check for game end
    if (timer <= 0) {
        endGame();
        return;
    }

    // Draw game
    drawGame();
}

function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cars
    ctx.fillStyle = 'red';
    ctx.fillRect(ferrari.x, ferrari.y, ferrari.width, ferrari.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(ford.x, ford.y, ford.width, ford.height);

    // Draw car labels
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText('Ferrari', ferrari.x + 10, ferrari.y + 20);
    ctx.fillText('Ford', ford.x + 20, ford.y + 20);
}

function endGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    gameScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');

    // Determine winner
    const ferrariDistance = ferrari.x;
    const fordDistance = ford.x;
    
    if (ferrariDistance > fordDistance) {
        winnerText.textContent = 'Ferrari Wins!';
        winnerText.className = 'text-4xl font-bold mb-8 text-red-600';
        winnerImage.src = 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg';
    } else if (fordDistance > ferrariDistance) {
        winnerText.textContent = 'Ford Wins!';
        winnerText.className = 'text-4xl font-bold mb-8 text-blue-600';
        winnerImage.src = 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg';
    } else {
        winnerText.textContent = 'It\'s a Tie!';
        winnerText.className = 'text-4xl font-bold mb-8 text-yellow-400';
        winnerImage.src = 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg';
    }
}