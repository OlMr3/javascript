const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const gameContainer = document.getElementById('gameContainer');
// Размеры игрового поля и клетки
let gridSize = 0;
let tileCountX = 0;
let tileCountY = 0;
let gameInterval;
// Змейка
let snake = [];
let velocityX = 0;
let velocityY = 0;
let nextVelocityX = 0;  // Для плавного движения
let nextVelocityY = 0;  // Для плавного движения
let moveProgress = 0; //прогресс движения от 0 до 1
// Еда
let food = {};
// Бомба
let bomb = {};
// Сердечко
let heart = {};
// Изображения
const headImg = new Image();
headImg.src = 'images/head.svg'; // Замените на путь к вашей картинке головы
const foodImg = new Image();
foodImg.src = 'images/apple.svg'; // Замените на путь к вашей картинке еды
const bombImg = new Image();
bombImg.src = 'images/bomb.svg'; // Замените на путь к вашей картинке бомбы
const heartImg = new Image();
heartImg.src = 'images/heart.svg'; // Замените на путь к вашей картинке сердечка
// Статистика
let score = 0;
let lives = 3;
let gameSpeed = 150; // ms
let initialGameSpeed = 150;
let eatenFoodCount = 0;
let isMoving = false;
let gameStarted = false;
// Функция для определения размеров игрового поля и клетки
function setGridSize() {
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;

    tileCountX = 20; // Количество клеток по горизонтали
    tileCountY = Math.floor(tileCountX * (containerHeight / containerWidth)); // Рассчитываем количество клеток по вертикали, чтобы сохранить пропорции

    gridSize = containerWidth / tileCountX; // Размер одной клетки
    canvas.width = containerWidth;
    canvas.height = containerHeight;
}
function startGame() {
    setGridSize();
    snake = [{ x: 10, y: 10 }];
    velocityX = 0;
    velocityY = 0;
    nextVelocityX = 0;
    nextVelocityY = 0;
    food = createFood();
    bomb = createBomb();
    heart = createHeart();
    score = 0;
    lives = 3;
    gameSpeed = initialGameSpeed;
    eatenFoodCount = 0;
    isMoving = false;
    gameStarted = true;
    gameOverScreen.style.display = 'none';
    scoreDisplay.textContent = `Счет: ${score}`;
    livesDisplay.textContent = `Жизни: ${lives}`;
    document.getElementById('startButton').style.display = 'none';
    gameLoop();
}
function restartGame() {
    startGame();
}
function updateScore() {
    scoreDisplay.textContent = `Счет: ${score}`;
}
function updateLives() {
    livesDisplay.textContent = `Жизни: ${lives}`;
}
function die() {
    lives--;
    updateLives();

    if (lives <= 0) {
        gameOver();
    } else {
        // Reset snake position or other necessary actions
        snake = [{ x: 10, y: 10 }];
        velocityX = 0;
        velocityY = 0;
        nextVelocityX = 0;
        nextVelocityY = 0;
        moveProgress = 0; // Reset moveProgress
        food = createFood();
        bomb = createBomb();
        heart = createHeart();
        isMoving = false;
    }
}
function gameOver() {
    finalScoreDisplay.textContent = score;
    gameOverScreen.style.display = 'block';
    document.getElementById('startButton').style.display = 'block';
    gameStarted = false;
}

function createFood() {
    let food = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY)
    };
    if (collision(food, snake)) {
        return createFood();
    }
    return food;
}

function createBomb() {
    let bomb = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY)
    };
    if (collision(bomb, snake) || (bomb.x === food.x && bomb.y === food.y)) {
        return createBomb();
    }
    return bomb;
}
function createHeart() {
    let heart = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY)
    };
    if (collision(heart, snake) || (heart.x === food.x && heart.y === food.y) || (heart.x === bomb.x && heart.y === bomb.y)) {
        return createHeart();
    }
    return heart;
}

function drawFood() {
    ctx.drawImage(foodImg, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawBomb() {
    ctx.drawImage(bombImg, bomb.x * gridSize, bomb.y * gridSize, gridSize, gridSize);
}

function drawHeart() {
    ctx.drawImage(heartImg, heart.x * gridSize, heart.y * gridSize, gridSize, gridSize);
}
function collision(first, second) {
    for (let i = 0; i < second.length; i++) {
        if (first.x === second[i].x && first.y === second[i].y) {
            return true;
        }
    }
    return false;
}
function eatFood() {
    score += 1;
    updateScore();
    food = createFood();
    bomb = createBomb();
    heart = createHeart();
    eatenFoodCount++;
   /* moveProgress = 0;*/

    if (eatenFoodCount % 5 === 0 && gameSpeed > 50) {
        gameSpeed -= 1;
    }
}
let lastTime = 0;

function gameLoop(timestamp) {
     if(gameOverScreen.style.display === 'block') return; // Остановить цикл, если игра окончена
     requestAnimationFrame(gameLoop);
     const deltaTime = timestamp - lastTime;
     lastTime = timestamp;

     // Обновляем состояние игры (позиции, коллизии, и т.д.)
     update(deltaTime);
     // Отрисовываем игру
     draw();
 }
/* function update() {
       if (!isMoving) return; // Не двигаемся, если не нажата кнопка
      moveProgress += 0.1;// Регулируйте скорость здесь.  Чем меньше число, тем медленнее движение
       if (moveProgress >= 1) {
           moveProgress = 0;

           // Обновляем позицию головы змейки
           const newHead = { x: snake[0].x + nextVelocityX, y: snake[0].y + nextVelocityY };

           // Проверка на выход за границы и столкновения
           if (newHead.x < 0 || newHead.x >= tileCountX || newHead.y < 0 || newHead.y >= tileCountY || collision(newHead, snake.slice(1))) {
               die();
               return;
           }
           snake.unshift(newHead);

           // Проверяем, съели ли еду
           if (newHead.x === food.x && newHead.y === food.y) {
               eatFood();
           } else {
               snake.pop(); // Убираем последний элемент, чтобы змейка двигалась
           }
       }
   }*/
function update(deltaTime) {
    if (!isMoving) return;
    
    // Обновляем прогресс движения
   moveProgress += (deltaTime / gameSpeed);
    if (moveProgress >= 1) {
        moveProgress = 0;
 
        // Сохраняем текущую позицию головы
        const currentHead = { x: snake[0].x, y: snake[0].y };
        
        // Обновляем позицию головы змейки
        const newHead = { x: currentHead.x + velocityX, y: currentHead.y + velocityY };
 
        // Проверка на выход за границы и столкновения
        if (newHead.x < 0 || newHead.x >= tileCountX || newHead.y < 0 || newHead.y >= tileCountY || collision(newHead, snake.slice(1))) {
            die();
            return;
        }
 
        // Добавляем новую голову
        snake.unshift(newHead);
 
        // Проверяем, съели ли еду
        if (newHead.x === food.x && newHead.y === food.y) {
            eatFood();
        } else if (newHead.x === heart.x && newHead.y === heart.y){
            lives++;
            updateLives();
            heart = createHeart();
        } else if(newHead.x === bomb.x && newHead.y === bomb.y){
            lives--;
            updateLives();
            bomb = createBomb();
            // Убираем последний элемент только если не съели еду
            
        } else {
            snake.pop();
        }
        velocityX = nextVelocityX;
        velocityY = nextVelocityY;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем еду, бомбы и сердечки
    drawFood();
    drawBomb();
    drawHeart();

    // Рисуем змейку
    for (let i = 0; i < snake.length; i++) {
        let x = snake[i].x * gridSize;
        let y = snake[i].y * gridSize;

        if (i === 0) { // Голова
            ctx.drawImage(headImg, Math.round(x), Math.round(y), gridSize, gridSize);
        } else { // Тело
            ctx.fillStyle = 'darkgreen'; // Или другое оформление тела
            ctx.fillRect(Math.round(x), Math.round(y), gridSize, gridSize);
        }
    }
}
/*  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем еду, бомбы и сердечки
      drawFood();
      drawBomb();
      drawHeart();
      
      // Рисуем змейку
      for (let i = 0; i < snake.length; i++) {
          let x = snake[i].x * gridSize;
          let y = snake[i].y * gridSize;
  
          if (i === 0) { // Голова
              // Рисуем голову в текущей позиции, без смещения
              ctx.drawImage(headImg, Math.round(x), Math.round(y), gridSize, gridSize);
          } else { // Тело
              ctx.fillStyle = 'darkgreen';
              ctx.fillRect(Math.round(x), Math.round(y), gridSize, gridSize);
          }
      }
  }*/


/* function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Рисуем еду, бомбы и сердечки
      drawFood();
      drawBomb();
      drawHeart();
      // Рисуем змейку
      for (let i = 0; i < snake.length; i++) {
          let x = snake[i].x * gridSize;
          let y = snake[i].y * gridSize;

          if (i === 0) { // Голова
              let offsetX = nextVelocityX * gridSize * moveProgress;
              let offsetY = nextVelocityY * gridSize * moveProgress;
              ctx.drawImage(headImg, Math.round(x + offsetX), Math.round(y + offsetY), gridSize, gridSize);

          } else { // Тело
              ctx.fillStyle = 'darkgreen'; // Или другое оформление тела
              ctx.fillRect(Math.round(x), Math.round(y), gridSize, gridSize);
          }
      }
  }*/
// В обработчиках клавиш:
document.addEventListener('keydown', function (event) {
    event = event || window.event;
    event.preventDefault;
    switch (event.key) {
        case 'ArrowUp':
            if (velocityY !== 1) {  // Предотвращаем движение в противоположную сторону
                nextVelocityX = 0;
                nextVelocityY = -1;
                isMoving = true;
            }
            break;
        case 'ArrowDown':
            if (velocityY !== -1) {
                nextVelocityX = 0;
                nextVelocityY = 1;
                isMoving = true;
            }
            break;
        case 'ArrowLeft':
            if (velocityX !== 1) {
                nextVelocityX = -1;
                nextVelocityY = 0;
                isMoving = true;
            }
            break;
        case 'ArrowRight':
            if (velocityX !== -1) {
                nextVelocityX = 1;
                nextVelocityY = 0;
                isMoving = true;
            }
            break;
    }
});