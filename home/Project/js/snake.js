class Game {
    constructor(canvasId) {
        this.container = document.getElementById('container')
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 25;
        this.width = Math.floor(window.innerWidth * 0.7 / this.cellSize) * this.cellSize;  // 70% ширины окна
        this.height = Math.floor(window.innerHeight * 0.7 / this.cellSize) * this.cellSize; // 70% высоты окна
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.cols = Math.floor(this.width / this.cellSize);
        this.rows = Math.floor(this.height / this.cellSize);
        this.snake = new Snake(this);
        this.food = new Food(this);
        this.bomb = new Bomb(this);
        this.heart = new Heart(this);
        this.score = 0;
        this.lives = 3;
        this.gameSpeed = 100;
        this.lastMoveTime = 0;
        this.eatSound = new Audio('audio/eat.mp3');
        this.deadSound = new Audio('audio/dead.mp3');
        this.turnSound = new Audio('audio/turn.mp3');
        this.bombSound = new Audio('audio/bomb.WAV');
        this.isGameRunning = false;
        document.getElementById('saveName').addEventListener('click', () =>{
            this.playerName = document.getElementById('playerName').value;
            if(this.playerName){
                document.getElementById('curName').textContent = this.playerName;
                document.getElementById('playerInput').style.display = 'none';
                document.getElementById('container').style.visibility = 'visible';
                window.scrollTo(0,0);
            } else {
                alert('Введите имя')
            }
          
        })
        window.addEventListener('resize', () => this.resize());
        document.getElementById('startButton').addEventListener('click', () => this.start());
        document.getElementById('restartButton').addEventListener('click', () => this.restart());
        document.addEventListener('keydown', (event) => {
            event.preventDefault;
            if (!this.isGameRunning) return;
            switch (event.key) {
                case 'ArrowUp':
                    if (this.snake.direction.y === 0) {
                        this.snake.setDirection(0, -1);
                        this.turnSound.play();
                    }
                    break;
                case 'ArrowDown':
                    if (this.snake.direction.y === 0) {
                        this.snake.setDirection(0, 1);
                        this.turnSound.play();
                    }
                    break;
                case 'ArrowLeft':
                    if (this.snake.direction.x === 0) {
                        this.snake.setDirection(-1, 0);
                        this.turnSound.play();
                    }
                    break;
                case 'ArrowRight':
                    if (this.snake.direction.x === 0) {
                        this.snake.setDirection(1, 0);
                        this.turnSound.play();
                    }
                    break;
            }
        });
        this.controls = document.getElementById('controls');

const handleDirectionChange = (direction) => {
    if (!this.isGameRunning) return;
    switch (direction) {
        case 'up':
            this.snake.setDirection(0, -1);
            this.turnSound.play();
            break;
        case 'down':
            this.snake.setDirection(0, 1);
            this.turnSound.play();
            break;
        case 'left':
            this.snake.setDirection(-1, 0);
            this.turnSound.play();
            break;
        case 'right':
            this.snake.setDirection(1, 0);
            this.turnSound.play();
            break;
    }
};

this.controls.addEventListener('click', (event) => {
    const target = event.target;
    handleDirectionChange(target.id);
});

// Добавление обработчиков для касания
this.controls.addEventListener('touchstart', (event) => {
    const target = event.target;
    handleDirectionChange(target.id);
    event.preventDefault(); // Предотвращаем стандартное поведение
});

        this.resize();
    }
    resize() {
    const maxWidth = 1000; // Максимальная ширина канваса
    const maxHeight = 800; // Минимальная высота канваса

        const oldWidth = this.width;
        const oldHeight = this.height;
        if (window.innerWidth <= 950){
            this.cellSize = 10;
        } else {
            this.cellSize = 25;
        }
        this.width = Math.min(Math.floor(window.innerWidth * 0.7 / this.cellSize) * this.cellSize, maxWidth);
        this.height = Math.min(Math.floor(window.innerHeight * 0.7 / this.cellSize) * this.cellSize, maxHeight);
        if (window.innerWidth <= 950){
            this.width = 330;
            this.height = 320;
            if(window.innerWidth > window.innerHeight){
                this.width = 330;
                this.height = 320;
            }
        } 
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.snake.size = this.cellSize;
        this.food.size = this.cellSize; 
        this.bomb.size = this.cellSize;
        this.heart.size = this.cellSize;
        this.cols = Math.floor(this.width / this.cellSize);
        this.rows = Math.floor(this.height / this.cellSize);
        this.snake.reset();
        if (this.food.position.x >= oldWidth ||
            this.food.position.y >= oldHeight ||
            !this.isInBounds(this.food.position)) {
            // Если еда вне границ, переместить её в новые границы
            this.food.spawn();
        }
        if (this.bomb.position.x >= oldWidth ||
            this.bomb.position.y >= oldHeight ||
            !this.isInBounds(this.bomb.position)) {
            // Если бомба вне границ, переместить её в новые границы
            this.bomb.spawn();
        }
        if (this.heart.position.x >= oldWidth ||
            this.heart.position.y >= oldHeight ||
            !this.isInBounds(this.heart.position)) {
            // Если сердце вне границ, переместить его в новые границы
            this.heart.spawn();
        }
        this.draw();
    }
    isInBounds(position) {
        return position.x >= 0 && position.x < this.width && position.y >= 0 && position.y < this.height;
    }
    updateScoreAndLives() {
        document.getElementById('score').innerText = `Счет: ${this.score}`;
        document.getElementById('lives').innerText = `Жизни: ${this.lives}`;
    }
    start() {
        if (this.lives <= 0) return;
        this.isGameRunning = true;
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
        this.score = 0;
        this.lives = 3;
        this.snake.reset();
        this.lastMoveTime = performance.now();
        const gameLoop = (timestamp) => {
            if (this.lives > 0) {
                if (timestamp - this.lastMoveTime > this.gameSpeed) {
                    this.update();
                    this.lastMoveTime = timestamp;
                }
                this.draw();
                requestAnimationFrame(gameLoop);
            }
        };
        requestAnimationFrame(gameLoop);
    }
    restart() {
        this.lives = 3;
        this.score = 0;
        this.updateScoreAndLives();
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('restartButton').style.display = 'none';
        this.start();
    }
    update() {
        if (this.lives > 0) {
            // Обновление состояния игры
            this.snake.move();
            if (this.snake.eat(this.food)) {
                this.score++;
                this.updateScoreAndLives();
                this.food.spawn();
                this.bomb.spawn();
                this.heart.spawn();
                this.eatSound.play();
            }
            if (this.snake.eat(this.bomb)) {
                this.lives--;
                this.updateScoreAndLives();
                this.food.spawn();
                this.bomb.spawn();
                this.heart.spawn();
                this.bombSound.play();
                if (this.lives > 0) {
                    // Перезапуск змейки без потери счета
                    this.snake.reset();
                } else {
                    this.endGame();
                    return;
                }
            }
            if (this.snake.eat(this.heart)) {
                this.lives++;
                this.updateScoreAndLives();
                this.food.spawn();
                this.bomb.spawn();
                this.heart.spawn();
                this.eatSound.play();
            }

            if (this.snake.checkCollision()) {
                // Если змейка врезалась в стену или в себя
                this.lives--;
                this.updateScoreAndLives();
                this.deadSound.play();
                if (navigator.vibrate){
                    navigator.vibrate(200);
                }
                if (this.lives > 0) {
                    // Перезапуск змейки без потери счета
                    this.snake.reset();
                } else {
                    this.endGame();
                    return;
                }
            }
        }
    }
    endGame() {
        // Игра окончена
        this.isGameRunning = false;
        document.getElementById('finalScore').innerText = `Ваш счет: ${this.score}`;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('restartButton').style.display = 'block';
        updatePlayerScore(this.playerName, this.score); //передаем имя игрока и финальный счет в файл ajax для обновления рекорда

    }
    draw() {
        // Очистка канваса и отрисовка объектов
        const ctx = this.ctx
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let x = 0; x < this.width; x += this.cellSize) {
            for (let y = 0; y < this.height; y += this.cellSize) {
                ctx.fillStyle = (x / this.cellSize + y / this.cellSize) % 2 === 0 ? 'rgb(140, 213, 140)' : 'rgb(177, 242, 177)'; // Цвета клеток
                ctx.fillRect(x, y, this.cellSize, this.cellSize);
            }
        }

        // Отрисовка всех объектов на канвасе
        this.snake.draw();
        this.food.draw();
        if (this.bomb) {
            // Проверяем наличие бомбы перед отрисовкой
            this.bomb.draw();
        }
        if (this.heart) {
            // Проверяем наличие сердца перед отрисовкой
            this.heart.draw();
        }
    }
}
class Snake {
    constructor(game) {
        // Начальные параметры змейки
        this.game = game;
        this.size = this.game.cellSize;
        const startX = Math.floor(this.game.cols / 2) * this.size;
        const startY = Math.floor(this.game.rows / 2) * this.size;
        this.body = [{ x: startX, y: startY }];
        this.direction = { x: 0, y: 0 }; 
        this.image = new Image();
        this.image.src = 'images/head.svg';
        this.image.onload = () => {
            this.draw();
        }
    }
    reset() {
        // Сброс состояния змейки  
        const startX = Math.floor(this.game.cols / 2) * this.size;
        const startY = Math.floor(this.game.rows / 2) * this.size;
        this.body = [{ x: startX, y: startY }];
        this.direction = { x: 0, y: 0 };
    } 
    //движение
    move() {
        const head = { x: this.body[0].x + this.direction.x * this.size, y: this.body[0].y + this.direction.y * this.size };

        if (this.eat(this.game.food)) { // Проверяем на поедание еды
            // Если еда съедена, не удаляем последний сегмент
            // Добавляем новый сегмент в конец тела змейки
            this.body.unshift(head);
        } else {
            // Если еда не съедена, перемещаемся и удаляем последний сегмент
            this.body.unshift(head);
            this.body.pop();
        }
    }
    eat(item) {
        if (item.isEaten(this.body[0])) {
            this.body.push({ ...this.body[this.body.length - 1] });
            return true;

        }
        return false;
    }
    //проверка на столкновения со стеной и собой
    checkCollision() {
        const head = { x: this.body[0].x + this.direction.x * this.size, y: this.body[0].y + this.direction.y * this.size };
        if (head.x + this.size < 0 || head.x - this.size >= this.game.width || head.y + this.size < 0 || head.y - this.size >= this.game.height) {
            return true;
        }
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }
    //запрещаем движение в противоположную сторону
    setDirection(x, y) {
        if ((this.direction.x === 0 && x !== 0) || (this.direction.y === 0 && y !== 0)) {
            this.direction.x = x;
            this.direction.y = y;
        }
    }
    draw() {
        if (this.image.complete) {
            const ctx = this.game.ctx;
            ctx.drawImage(this.image, this.body[0].x, this.body[0].y, this.size, this.size);

            for (let i = 1; i < this.body.length; i++) {
                ctx.fillStyle = 'rgb(23, 59, 23)';
                ctx.fillRect(this.body[i].x, this.body[i].y, this.size, this.size);
            }

        }

    }
}
class Food {
    constructor(game) {
        this.game = game;
        this.position = {};
        this.size = this.game.cellSize;
        this.image = new Image();
        this.image.src = 'images/apple.svg'
        this.image.onload = () => {
            this.draw();
        }
    }
        spawn() {
            const cols = Math.floor(this.game.width / this.size);
            const rows = Math.floor(this.game.height / this.size);
            let position;
        
            do {
                position = {
                    x: (Math.floor(Math.random() * cols) * this.size),
                    y: (Math.floor(Math.random() * rows) * this.size),
                };
            } while (this.isOccupied(position));
        
            this.position = position;
        }
        
        isOccupied(position) {
            // Проверяем, занята ли позиция телом змейки
            for (let segment of this.game.snake.body) {
                if (segment.x === position.x && segment.y === position.y) {
                    return true; // Позиция занята
                }
            }
            return false; // Позиция свободна
        }
    isEaten(snakeHead) {
        return Math.floor(snakeHead.x / this.size) === Math.floor(this.position.x / this.size) &&
             Math.floor(snakeHead.y / this.size) === Math.floor(this.position.y / this.size);
    }
    draw() {
        const ctx = this.game.ctx;
         ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
    }
}
class Bomb extends Food {
    constructor(game) {
        super(game);
        this.image = new Image();
        this.image.src = 'images/bomb.svg'
    }
}
class Heart extends Food {
    constructor(game) {
        super(game)
        this.image = new Image();
        this.image.src = 'images/heart.svg'
    }
}
const game = new Game('gameCanvas');
