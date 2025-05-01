class Game {
    constructor(canvasId) {
        this.container = document.getElementById('container')
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 25;
        /* this.updateDimensions();*/
        this.width = Math.floor(window.innerWidth * 0.7 / this.cellSize) * this.cellSize;  // 80% ширины окна
        this.height = Math.floor(window.innerHeight * 0.7 / this.cellSize) * this.cellSize; // 80% высоты окна
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
                console.log('Имя игрока:', this.playerName);
                document.getElementById('playerInput').style.display = 'none';
                document.getElementById('container').style.visibility = 'visible';
                this.openFullscreen();
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
    /* updateDimensions() {
         // Устанавливаем cellSize в зависимости от ширины окна
         const minCellSize = 20; // Минимальный размер клетки
         const maxCellSize = 30; // Максимальный размер клетки
 
         // Пример: cellSize будет 5% от ширины окна, но не меньше minCellSize и не больше maxCellSize
         this.cellSize = Math.min(Math.max(Math.floor(window.innerWidth * 0.05), minCellSize), maxCellSize);
 
         // Обновление размеров канваса
         this.width = Math.floor(window.innerWidth * 0.8 / this.cellSize) * this.cellSize;
         this.height = Math.floor(window.innerHeight * 0.8 / this.cellSize) * this.cellSize;
 
         // Обновление канваса
         this.canvas.width = this.width;
         this.canvas.height = this.height;
 
         // Пересчет количества колонок и строк
         this.cols = Math.floor(this.width / this.cellSize);
         this.rows = Math.floor(this.height / this.cellSize);
     }*/
    resize() {
        /* this.updateDimensions();*/
    const maxWidth = 1000; // Максимальная ширина канваса
    const maxHeight = 800; // Минимальная высота канваса

        const oldWidth = this.width;
        const oldHeight = this.height;
        if (window.innerWidth <= 650){
            this.cellSize = 15;
        } else {
            this.cellSize = 25;
        }
        this.width = Math.min(Math.floor(window.innerWidth * 0.7 / this.cellSize) * this.cellSize, maxWidth);
        this.height = Math.min(Math.floor(window.innerHeight * 0.7 / this.cellSize) * this.cellSize, maxHeight);
       /* this.width = Math.floor(window.innerWidth * 0.8 / this.cellSize) * this.cellSize;
        this.height = Math.floor(window.innerHeight * 0.8 / this.cellSize) * this.cellSize;*/
        if (window.innerWidth <= 650){
            this.width = 300;
            this.height = 390;
        } 

        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.snake.size = this.cellSize;
        this.food.size = this.cellSize; 
        this.bomb.size = this.cellSize;
        this.heart.size = this.cellSize;// Обновляем размер змейки
        /*  this.food.size = this.cellSize; // Обновляем размер еды
          if (this.bomb) {
              this.bomb.size = this.cellSize; // Обновляем размер бомбы
          }
          if (this.heart) {
              this.heart.size = this.cellSize; // Обновляем размер сердца
          }*/
        const oldCols = Math.floor(oldWidth / this.cellSize);
        const oldRows = Math.floor(oldHeight / this.cellSize);
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
    openFullscreen() {
        const elem = document.getElementById("Container");
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari и Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
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
        const gameLoop = (timestamp) => {
            if (this.lives > 0) {
                if (timestamp - this.lastMoveTime > this.gameSpeed) {
                    this.update();
                    this.lastMoveTime += this.gameSpeed;
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
        /* document.getElementById('score').innerText = `Счет: ${this.score}`;
         document.getElementById('lives').innerText = `Жизни: ${this.lives}`;*/
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('restartButton').style.display = 'none';
        this.start();
    }
    update() {
        if (this.lives > 0) {
            // Обновление состояния игры
            this.snake.move();
           /* this.food.update();
            if (this.bomb) {
                this.bomb.update();
            }
            if (this.heart) {
                this.heart.update();
            }*/
            if (this.snake.eat(this.food)) {
                this.score++;
                this.updateScoreAndLives();
                /* document.getElementById('score').innerText = `Счет: ${this.score}`;*/
                this.food.spawn();
                this.bomb.spawn();
                this.heart.spawn();
                this.eatSound.play();
            }
            if (this.snake.eat(this.bomb)) {
                this.lives--;
                this.updateScoreAndLives();
                /*document.getElementById('lives').innerText = `Жизни: ${this.lives}`;*/
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
                /* document.getElementById('lives').innerText = `Жизни: ${this.lives}`;*/
                this.food.spawn();
                this.bomb.spawn();
                this.heart.spawn();
                this.eatSound.play();
            }

            if (this.snake.checkCollision()) {
                // Если змейка врезалась в стену или в себя
                this.lives--;
                this.updateScoreAndLives();
                /* document.getElementById('lives').innerText = `Жизни: ${this.lives}`;*/
                this.deadSound.play();
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
        console.log('Имя игрока перед обновлением счета:', this.playerName);
        updatePlayerScore(this.playerName, this.score);

    }
    draw() {
        // Очистка канваса и отрисовка объектов
        const ctx = this.ctx
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let x = 0; x < this.width; x += this.cellSize) {
            for (let y = 0; y < this.height; y += this.cellSize) {
                ctx.fillStyle = (x / this.cellSize + y / this.cellSize) % 2 === 0 ? 'rgba(180, 220, 180, 0.86)' : 'rgba(212, 240, 212, 0.968)'; // Цвета клеток
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
        this.direction = { x: 0, y: 0 }; // Начальное направление вправо
        this.image = new Image();
        this.image.src = 'images/head.svg';
        this.image.onload = () => {
            this.draw();
        }
        /*loadImage(headImageSrc).then(img => {
            this.headImg = img;
            // Рисуем после загрузки изображения
            this.draw(); // Вызов метода draw после загрузки изображения
        }).catch(err => {
            console.error('Ошибка загрузки изображения головы: ', err)
        });*/

    }
    reset() {
        // Сброс состояния змейки  
        const startX = Math.floor(this.game.cols / 2) * this.size;
        const startY = Math.floor(this.game.rows / 2) * this.size;
        this.body = [{ x: startX, y: startY }];
        this.direction = { x: 0, y: 0 };
    }
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
        this.scale = 1;
        this.growing = true;
        this.image = new Image();
        this.image.src = 'images/apple.svg'
        this.image.onload = () => {
            this.spawn();
            this.draw();
        }
        /* loadImage('images/apple.svg').then(img => {
             this.image = img;
             // Спавн еды после загрузки изображения
             return Promise.resolve().then(() => { return Promise.resolve(this.spawn()); });
         });*/

    }
    spawn() {
        const cols = Math.floor(this.game.width / this.size);
        const rows = Math.floor(this.game.height / this.size);
        this.position = {
            x: (Math.floor(Math.random() * cols/2) * this.size),
            y: (Math.floor(Math.random() * rows/2) * this.size),
        };
        /*console.log(`Food position: x=${this.position.x}, y=${this.position.y}`);*/
    }
    isEaten(snakeHead) {

       /* const scaledSize = this.size * this.scale;
        const scaledX = this.position.x + (this.size - scaledSize); // Центрируем по X
        const scaledY = this.position.y + (this.size - scaledSize); // Центрируем по Y
        return Math.floor(snakeHead.x >= scaledX && snakeHead.x <= scaledX + scaledSize) &&
            Math.floor(snakeHead.y >= scaledY && snakeHead.y <= scaledY + scaledSize);*/
        return Math.floor(snakeHead.x / this.size) === Math.floor(this.position.x / this.size) &&
             Math.floor(snakeHead.y / this.size) === Math.floor(this.position.y / this.size);
    }
    draw() {
        const ctx = this.game.ctx;
       /* ctx.save();
        ctx.translate(this.position.x + (this.size - (this.scale * this.scale)),
            this.position.y + (this.size - (this.scale * this.scale))); // Перемещаем контекст
        ctx.scale(this.scale, this.scale); // Применяем масштаб
        ctx.drawImage(this.image, 0, 0, this.size, this.size);
        ctx.restore();*/

         ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
    }
    /*update() {
        // Логика изменения размера
        if (this.growing) {
            if (this.scale < 1.2) { // Максимальный размер
                this.scale += 0.03; // Увеличиваем масштаб
            } else {
                this.growing = false; // Меняем направление роста
            }
        } else {
            if (this.scale > 1) { // Минимальный размер
                this.scale -= 0.03; // Уменьшаем масштаб
            } else {
                this.growing = true; // Меняем направление роста
            }
        }
    }*/
}
class Bomb extends Food {
    constructor(game) {
        super(game);
        this.image = new Image();
        this.image.src = 'images/bomb.svg'
        /* loadImage('images/bomb.svg').then(img => {
             this.image = img;
             this.spawn();
         });*/
    }
}
class Heart extends Food {
    constructor(game) {
        super(game)
        this.image = new Image();
        this.image.src = 'images/heart.svg'
        /*loadImage('images/heart.svg').then(img => {
            this.image = img;
            this.spawn();
        });*/
    }
}
const game = new Game('gameCanvas');
/*function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
    });
}*/
