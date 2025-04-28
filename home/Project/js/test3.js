class Game{
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth * 0.8; // 80% ширины окна
        this.height = window.innerHeight * 0.8; // 80% высоты окна
        this.cellSize = 24;
        this.cols = Math.floor(this.width/this.cellSize);
        this.rows = Math.floor(this.height/this.cellSize);
        this.snake = new Snake(this);
        this.food = new Food(this);
        this.score = 0;
        this.lives = 3;
        this.gameSpeed = 100;
        this.lastMoveTime = 0;
        this.isGameOver = false;
        document.getElementById('startButton').addEventListener('click', () => this.start());
       /* document.getElementById('restartButton').addEventListener('click', () => this.restart());*/
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    if (this.snake.direction.y === 0) {
                        this.snake.setDirection(0, -1);
                    }
                    break;
                case 'ArrowDown':
                    if (this.snake.direction.y === 0) {
                        this.snake.setDirection(0, 1);
                    }
                    break;
                case 'ArrowLeft':
                    if (this.snake.direction.x === 0) {
                        this.snake.setDirection(-1, 0);
                    }
                    break;
                case 'ArrowRight':
                    if (this.snake.direction.x === 0) {
                        this.snake.setDirection(1, 0);
                    }
                    break;
            }
        });
        this.loadImages().then(() => {
            console.log("Изображения загружены");
            // Начать игру после загрузки изображений
            document.getElementById('startButton').disabled = false;
        });
    }
    loadImages() {
        return new Promise((resolve) => {
            const headImage = new Image();
            const foodImage = new Image();
            let imagesLoaded = 0; // Счетчик загруженных изображений

            headImage.src = 'images/head.svg'; // Путь к изображению головы змеи
            foodImage.src = 'images/apple.svg'; // Путь к изображению еды

            headImage.onload = () => {
                this.snake.headImage = headImage;
                imagesLoaded++;
                if (imagesLoaded === 2) resolve(); // Проверка, загружены ли оба изображения
            };

            foodImage.onload = () => {
                this.food.image = foodImage;
                imagesLoaded++;
                if (imagesLoaded === 2) resolve(); // Проверка, загружены ли оба изображения
            };
        });
    }
    start(){
        if(!this.isGameOver){
            this.reset();
        }
        document.getElementById('gameOver').style.display = 'none';
        this.score = 0;
        this.lives = 3;
        requestAnimationFrame(() => this.update());
    }
    reset() {
        // Сброс состояния игры
        this.snake.reset();
        this.food.spawn();
        this.isGameOver = false;
        document.getElementById('score').innerText = `Счет: ${this.score}`;
        document.getElementById('lives').innerText = `Жизни: ${this.lives}`;
        document.getElementById('gameOver').style.display = 'none';
        requestAnimationFrame(() => this.update());
      }
    update(){
        if(this.lives > 0)
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.snake.move();
        if(this.snake.body[0].x === this.food.position.x && this.snake.body[0].y === this.food.position.y){
            this.score++;
            this.snake.grow();
            document.getElementById('score').innerText = `Счет: ${this.score}`;
            this.food.spawn();
        }
        if (this.snake.checkCollision()){
            if (--this.lives <= 0) {
                // Игра окончена
                document.getElementById('gameOver').innerText =
                    `Игра окончена! Ваш счет: ${this.score}`;
                document.getElementById('gameOver').style.display = 'block';
                return; 
            } else {
                // Перезапуск змейки без потери счета
                document.getElementById('lives').innerText =
                    `Жизни: ${this.lives}`;
                this.snake.reset();
            }
            this.draw();
        }

    }
    draw(){
        this.snake.draw();
        this.food.draw();
    }
}
class Snake{
    constructor(game){
        this.game = game;
        this.size = this.game.cellSize;
        const startX = Math.floor(this.game.cols / 2);
        const startY = Math.floor(this.game.rows / 2);
        this.body= [{ x: startX , y: startY}]; 
        this.direction = {x: 0, y: 0};
        this.length = 1;
        this.headImage = null;
    }
    reset() {  
        // Сброс состояния змейки  
        const startX = Math.floor(this.game.cols / 2);
        const startY = Math.floor(this.game.rows / 2);
           this.body= [{ x: startX , y: startY}];  
          this.direction= {x :0 ,y :0};
          this.length = 1;
    }  
    move(){
        const headX = this.body[0].x + this.direction.x;
        const headY = this.body[0].y + this.direction.y;
        const newHead = {x: headX, y: headY};
        this.body.unshift(newHead);
        if (this.length < this.body.length){
            this.body.pop();
        }
    }
    grow(){
        this.length++;
    }
    setDirection(newDirection) {
        // Запрещаем движение в противоположном направлении
        if (newDirection.x !== -this.direction.x || newDirection.y !== -this.direction.y) {
            this.direction = newDirection;
        }
    }
    checkCollision() {
        const head = this.body[0];
        
        // Проверка на столкновение со стенами
        if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
            return true;
        }

        // Проверка на столкновение с собой
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) {
                return true;
            }
        }

        return false;
    }
    draw(){
        const ctx = this.game.ctx;
        ctx.drawImage(this.headImage, this.body[0].x, this.body[0].y, this.size, this.size );
        for (let i = 1; i < this.body.length; i++) {    
            ctx.fillStyle = 'green';
            ctx.fillRect(this.body[i].x, this.body[i].y, this.size, this.size);    
        }    
    }
}
class Food {
    constructor(game){
        this.game = game;
        this.position={};   
        this.size = this.game.cellSize;
        this.image = null;
        this.spawn();
    }
    spawn(){
        const cols=Math.floor(this.game.width/this.size);    
      	const rows=Math.floor(this.game.height/this.size);    
      	this.position={    
          	x:(Math.floor(Math.random()*cols)*this.size),    
          	y:(Math.floor(Math.random()*rows)*this.size),    
      	};    
    }
    draw(){
        const ctx = this.game.ctx;
        ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size)
    }
}
const game = new Game('gameCanvas')