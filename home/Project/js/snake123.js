class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.finalScoreElement = document.getElementById('finalScore');
        this.gameOverElement = document.getElementById('gameOver');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');

        this.snake = new Snake(this);
        this.food = new Food(this);
        this.bomb = new Bomb(this);
        this.heart = new Heart(this);

        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.loadImages();
    }

    loadImages() {
        this.images = {
            snakeHead: new Image(),
            food: new Image(),
            bomb: new Image(),
            heart: new Image()
        };

        this.images.snakeHead.src = 'images/head.svg';
        this.images.food.src = 'images/apple.svg';
        this.images.bomb.src = 'images/bomb.svg';
        this.images.heart.src = 'images/heart.svg';

        let loadedImages = 0;
        for (let key in this.images) {
            this.images[key].onload = () => {
                loadedImages++;
                if (loadedImages === Object.keys(this.images).length) {
                    this.startButton.style.display = 'block';
                }
            };
        }
    }

    resizeCanvas() {
        this.canvas.width = Math.min(window.innerWidth * 0.8, 600);
        this.canvas.height = Math.min(window.innerHeight * 0.8, 400);
        this.snake.draw();
        this.food.draw();
        this.bomb.draw();
        this.heart.draw();
    }

    startGame() {
        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        this.gameOverElement.style.display = 'none';
        this.snake.reset();
        this.food.spawn();
        this.bomb.spawn();
        this.heart.spawn();
        this.update();
    }

    restartGame() {
        this.startGame();
    }

    update() {
        if (this.isGameOver) return;
        this.snake.move();
        this.checkCollisions();
        this.draw();
        requestAnimationFrame(() => this.update());
    }

    checkCollisions() {
        // Проверка на столкновение со стенами
        if (this.snake.x < 0 || this.snake.x >= this.canvas.width || this.snake.y < 0 || this.snake.y >= this.canvas.height) {
            this.snake.die();
        }

        // Проверка на столкновение с самим собой
        for (let i = 1; i < this.snake.body.length; i++) {
            if (this.snake.body[i].x === this.snake.x && this.snake.body[i].y === this.snake.y) {
                this.snake.die();
            }
        }

        // Проверка на столкновение с едой
        if (this.snake.x === this.food.x && this.snake.y === this.food.y) {
            this.score++;
            this.scoreElement.textContent = this.score;
            this.snake.grow();
            this.food.spawn();
        }

        // Проверка на столкновение с бомбой
        if (this.snake.x === this.bomb.x && this.snake.y === this.bomb.y) {
            this.lives--;
            this.livesElement.textContent = this.lives;
            this.bomb.spawn();
            if (this.lives <= 0) {
                this.endGame();
            }
        }

        // Проверка на столкновение с сердечком
        if (this.snake.x === this.heart.x && this.snake.y === this.heart.y) {
            this.lives++;
            this.livesElement.textContent = this.lives;
            this.heart.spawn();
        }
    }

    endGame() {
        this.isGameOver = true;
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'block';
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.snake.draw();
        this.food.draw();
        this.bomb.draw();
        this.heart.draw();
    }
}

class Snake {
    constructor(game) {
        this.game = game;
        this.body = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.size = 10;
        this.speed = 10;

        document.addEventListener('keydown', (event) => this.changeDirection(event));
    }

    changeDirection(event) {
        switch (event.key) {
            case 'ArrowUp':
                if (this.direction.y === 0) this.direction = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                if (this.direction.y === 0) this.direction = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                if (this.direction.x === 0) this.direction = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                if (this.direction.x === 0) this.direction = { x: 1, y: 0 };
                break;
        }
    }

    move() {
        const head = { x: this.body[0].x + this.direction.x * this.size, y: this.body[0].y + this.direction.y * this.size };
        this.body.unshift(head);
        this.body.pop();
    }

    grow() {
        this.body.push({ ...this.body[this.body.length - 1] });
    }

    die() {
        this.game.lives--;
        this.game.livesElement.textContent = this.game.lives;
        if (this.game.lives <= 0) {
            this.game.endGame();
        } else {
            this.reset();
        }
    }

    reset() {
        this.body = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
    }

    draw() {
        const ctx=	this.game.ctx; 
        ctx.drawImage(this.game.images.snakeHead, this.body[0].x, this.body[0].y)
        
        for (let i=1;i<this.body.length;i++) {
            ctx.fillStyle = 'green';
            ctx.fillRect(0, 0, this.body[i].x,this.body[i].y);
        }
    }
}

class Food {
    constructor(game) {
        this.game = game;
        this.size = 10;
        this.spawn();
    }

    spawn() {
        this.x = Math.floor(Math.random() * (this.game.canvas.width / this.size)) * this.size;
        this.y = Math.floor(Math.random() * (this.game.canvas.height / this.size)) * this.size;
    }

    draw() {
        this.game.ctx.drawImage(this.game.images.food, this.x, this.y, this.game.images.food.width, this.game.images.food.height);
    }
}

class Bomb {
    constructor(game) {
        this.game = game;
        this.size = 10;
        this.spawn();
    }

    spawn() {
        this.x = Math.floor(Math.random() * (this.game.canvas.width / this.size)) * this.size;
        this.y = Math.floor(Math.random() * (this.game.canvas.height / this.size)) * this.size;
    }

    draw() {
        this.game.ctx.drawImage(this.game.images.bomb, this.x, this.y, this.game.images.bomb.width, this.game.images.bomb.height);
    }
}

class Heart {
    constructor(game) {
        this.game = game;
        this.size = 10;
        this.spawn();
    }

    spawn() {
        this.x = Math.floor(Math.random() * (this.game.canvas.width / this.size)) * this.size;
        this.y = Math.floor(Math.random() * (this.game.canvas.height / this.size)) * this.size;
    }

    draw() {
        this.game.ctx.drawImage(this.game.images.heart, this.x, this.y, this.game.images.heart.width, this.game.images.heart.height);
    }
}
const game = new Game()
/*window.onload = () => {
    new Game();
};*/


  
       // Загрузка изображения головы змейки
      /* const headImg = new Image();
       headImg.onload = this.draw;

       headImg.src = 'images/head.svg'; 
      /* const foodImageSrc = 'images/apple.svg'; 
       const bombImageSrc = 'images/bomb.svg'; 
       const heartImageSrc = 'images/heart.svg'; */

       /*Promise.all([
           loadImage(headImageSrc),
          /* loadImage(foodImageSrc),
           loadImage(bombImageSrc),
           loadImage(heartImageSrc)*/
       /*]).then(images => {
           [this.headImg, ...this.bodyImg] = images; 
          /* game.start(); 
       });*/
       
     /*  window.addEventListener('keydown', (e) => { 
           switch(e.key) { 
               case 'ArrowUp': 
                   if (this.direction.y === 0) { 
                       this.direction.x = 0; 
                       this.direction.y = -1; 
                   } 
                   break; 
               case 'ArrowDown': 
                   if (this.direction.y === 0) { 
                       this.direction.x = 0; 
                       this.direction.y = 1; 
                   } 
                   break; 
               case 'ArrowLeft': 
                   if (this.direction.x === 0) { 
                       this.direction.x = -1; 
                       this.direction.y = 0; 
                   } 
                   break; 
               case 'ArrowRight': 
                   if (this.direction.x === 0) { 
                       this.direction.x = 1; 
                      	this.direction.y= 0
                   }		  
                   break;  
           }  
       });  */