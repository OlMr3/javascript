class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = Math.floor(window.innerWidth * 0.8 / 20) * 20;
        this.height = Math.floor(window.innerHeight * 0.8 / 20) * 20;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.snake = new Snake(this);
        this.food = new Food(this);
        this.bomb = new Bomb(this);
        this.heart = new Heart(this);
        this.score = 0;
        this.lives = 3;
       this.isGameOver = false;
      this.addEventListeners;
       this.loadImages().then(() => {
        this.startGame();
       });
       window.addEventListener('resize', ()=>this.resize());
    }
    loadImages() {
        const imagesToLoad = [{name: 'snake', src: 'images/head.svg'},
            {name: 'food', src: 'images/apple.svg'},
            {name: 'bomb', src: 'images/bomb.svg'},
            {name: 'heart', src: 'images/heart.svg'}
        ];
        const promises = imagesToLoad.map(imageInfo =>{
            return new Promise((resolve) =>{
                const img = new Image();
                img.src = imageInfo.src;
                img.onload =() =>{
                    this[imageInfo.name] = img;
                    resolve();
                };
            });
        });
        return Promise.all(promises);
    }
    resize(){
        this.width = Math.floor(window.innerWidth * 0.8 / 20) * 20;
        this.height = Math.floor(window.innerHeight * 0.8 / 20) * 20;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

    }
    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (!this.isGameOver) {
                this.snake.changeDirection(event.key);
            }
        });

        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
    }

    startGame() {
        this.isGameOver = false;
        this.score = 0;
        this.lives = 3;
        this.snake.reset();
        this.food.spawn();
        this.bomb.spawn();
        this.heart.spawn();
        document.getElementById('game-over').style.display = 'none';
        this.update();
    }
    update(){
        if (this.lives > 0){
            this.clear();
            this.snake.move();
            if(this.snake.eat(this.food)){
                this.score++;
                document.getElementById('score').innerText = `Счет: ${this.score}`;
                this.food.spawn();
            }
        if (this.snake.eat(this.bomb)){
            this.lives--;
            document.getElementById('lives').innerText = `Жизни: ${this.lives}`;
            if (this.lives > 0){
                this.snake.reset();
            }
        }
        if (this.snake.eat(this.heart)){
            this.lives++;
            document.getElementById('lives').innerText = `Жизни: ${this.lives}`;
            this.heart.spawn();
        }
        if (this.snake.collideWithWalls() || this.snake.collideWithSelf()){
            this.lives--;
            document.getElementById('lives').innerText = `Жизни: ${this.lives}`;
            if (this.lives > 0){
                this.snake.reset();
            }
        }
        if(this.lives <= 0){
            document.getElementById('final-score').innerText = `Ваш счет: ${this.score}`
            document.getElementById('game-over').style.display = 'block';
        } else {
            requestAnimationFrame(() => this.update());
        }
        this.food.draw();
        this.bomb.draw();
        this.heart.draw();
        this.snake.draw();
        }
    }
    clear(){
        //очистка канваса
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


}

class Snake {
    constructor(game) {
        this.game = game;
        this.body = [{ x: 10, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.size = 1;
        this.moveCooldown = 100; // миллисекунды
        this.lastMoveTime = 0;
    }

    reset() {
        this.body = [{ x: 5, y: 5 }];
        
        this.direction = { x: 0, y: 0 };
        this.size = 1;
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
        const now = Date.now();
        if (now - this.lastMoveTime >= this.moveCooldown) {
            const head = { ...this.body[0] };
            head.x += this.direction.x;
            head.y += this.direction.y;
            this.body.unshift(head);
            if (this.body.length > this.size) {
                this.body.pop();
            }
            this.lastMoveTime = now;
        }
    }

    draw() {
        this.body.forEach(segment => {
            this.game.ctx.drawImage(this.game.snake, segment.x * 20, segment.y * 20, 20, 20);
        });
    }

    eat(item) {
        const head = this.body[0];
        if (head.x === item.x && head.y === item.y) {
            this.size++;
            return true;
        }
        return false;
    }

    collideWithWalls() {
        const head = this.body[0];
        return head.x < 0 || head.x >= this.game.width / 20 || head.y < 0 || head.y >= this.game.height / 20;
    }

    collideWithSelf() {
        const head = this.body[0];
        return this.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }
}


class Food {
    constructor(game) {
        this.game = game;
        this.spawn();
    }

    spawn() {
        this.x = Math.floor(Math.random() * (this.game.width / 20));
        this.y = Math.floor(Math.random() * (this.game.height / 20));
    }

    draw() {
        this.game.ctx.drawImage(this.game.food, this.x * 20, this.y * 20, 20, 20);
    }
}


class Bomb {
    constructor(game) {
        this.game = game;
        this.spawn();
    }

    spawn() {
        this.x = Math.floor(Math.random() * (this.game.width / 20));
        this.y = Math.floor(Math.random() * (this.game.height / 20));
    }

    draw() {
        this.game.ctx.drawImage(this.game.bomb, this.x * 20, this.y * 20, 20, 20);
    }
}


class Heart {
    constructor(game) {
        this.game = game;
        this.spawn();
    }

    spawn() {
        this.x = Math.floor(Math.random() * (this.game.width / 20));
        this.y = Math.floor(Math.random() * (this.game.height / 20));
    }

    draw() {
        this.game.ctx.drawImage(this.game.heart, this.x * 20, this.y * 20, 20, 20);
    }
}
const game = new Game('gameCanvas');

