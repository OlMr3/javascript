class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth * 0.8; // 80% ширины окна
        this.height = window.innerHeight * 0.8; // 80% высоты окна
        this.cellSize = 24;
        this.cols = Math.floor(this.width/this.cellSize);
        this.rows = Math.floor(this.height/this.cellSize);
        this.snake = new Snake(this);
        this.food = new Food(this);
        this.bomb = new Bomb(this);
        this.heart = new Heart(this);
        this.score = 0;
        this.lives = 3;
        this.gameSpeed = 100;
        this.lastMoveTime = 0;
        window.addEventListener('resize', () => this.resize());
        document.getElementById('startButton').addEventListener('click', () => this.start());
        document.getElementById('restartButton').addEventListener('click', () => this.restart());
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
        this.resize();
    }
    resize() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.cols = Math.floor(this.width/this.cellSize);
        this.rows = Math.floor(this.height/this.cellSize);
    }
    start() {
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
        
        this.score = 0;
        this.lives = 3;
        this.snake.reset();
        const gameLoop = (timestamp) => {
            if (this.lives > 0) {
                if (timestamp - this.lastMoveTime > this.gameSpeed){
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
        document.getElementById('gameOver').style.display = 'none';
        this.start();
    }
    update() {
        if (this.lives > 0) {
            // Обновление состояния игры
            this.snake.move();
            if (this.snake.eat(this.food)) {
                this.score++;
                document.getElementById('score').innerText = `Счет: ${this.score}`;
                this.food.spawn();
            }
            if (this.snake.eat(this.bomb)) {
                this.lives--;
                document.getElementById('lives').innerText = `Жизни: ${this.lives}`;
                this.bomb.spawn();
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
                document.getElementById('lives').innerText = `Жизни: ${this.lives}`;
                this.heart.spawn();
            }

            if (this.snake.checkCollision()) {
                // Если змейка врезалась в стену или в себя
                this.lives--;
                document.getElementById('lives').innerText = `Жизни: ${this.lives}`;
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
        document.getElementById('finalScore').innerText = `Ваш счет: ${this.score}`;
        document.getElementById('gameOver').style.display = 'block';
    }
    draw() {
        // Очистка канваса и отрисовка объектов
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
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
        const headImageSrc = 'images/head.svg';
        loadImage(headImageSrc).then(img => {
            this.headImg = img;
            // Рисуем после загрузки изображения
            this.draw(); // Вызов метода draw после загрузки изображения
        });
     
   }  
   reset() {  
       // Сброс состояния змейки  
       const startX = Math.floor(this.game.cols / 2) * this.size;
       const startY = Math.floor(this.game.rows / 2) * this.size;
      	this.body= [{ x: startX , y: startY}];  
     	this.direction= {x :0 ,y :0};
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
  /* move() {  
     	const head= {x :this.body[0].x +	this.direction.x *10 ,y :this.body[0].y +	this.direction.y *10};  
     	this.body.unshift(head); 
     	this.body.pop();  
   }  */
   eat(item) {  
     	if(item.isEaten(this.body[0])){  
         	this.body.push({...this.body[this.body.length -1]});  
         	return true;  
             
     	}  
     	return false;  
   } 

   checkCollision() {  
     	const head=	this.body[0];   
     	if(head.x <	0	|| head.x >=	this.game.width || head.y<	0	|| head.y >=	this.game.height){   
         	return true;   
     	}   
     	for(let i=1;i<this.body.length;i++){   
         	if(head.x===	this.body[i].x && head.y===	this.body[i].y){   
             	return true;   
         	}   
     	}   
     	return false;   
   }  
   setDirection(x, y) {  
    this.direction.x= x;  
    this.direction.y= y;  
}  

draw() {  
    const ctx = this.game.ctx;    
    
   
    
    ctx.drawImage(this.headImg, this.body[0].x, this.body[0].y, this.size, this.size);    
    
    for (let i = 1; i < this.body.length; i++) {    
        ctx.fillStyle = 'green';
        ctx.fillRect(this.body[i].x, this.body[i].y, this.size, this.size);    
    }    
}  
}  
class Food {    
   constructor(game){    
      	this.game =	game;    
      	this.position={};   
        this.size = this.game.cellSize;
          loadImage('images/apple.svg').then(img => {
            this.image = img;
            // Спавн еды после загрузки изображения
            return Promise.resolve().then(() => { return Promise.resolve(this.spawn()); });
        });
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

  /* isEaten(snakeHead){    
      	return snakeHead.x===this.position.x && snakeHead.y===this.position.y;    
   }  */
         /* isEaten(snakeHead) {
            return (
                Math.abs(snakeHead.x - this.position.x) < this.size &&
                Math.abs(snakeHead.y - this.position.y) < this.size
            );
        }*/
            isEaten(snakeHead) {
                return Math.floor(snakeHead.x / this.size) === Math.floor(this.position.x / this.size) &&
                       Math.floor(snakeHead.y / this.size) === Math.floor(this.position.y / this.size);
            }
            
          

   draw(){    
      	const ctx=this.game.ctx;     
      	     
      	ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);     
   }     
}   
class Bomb extends Food{    
    constructor(game){
        super (game);
        loadImage('images/bomb.svg').then(img => { 
            this.image = img;
            this.spawn();  
        });  
    }
}   
class Heart extends Food{   
    constructor (game){
        super (game)
        loadImage('images/heart.svg').then(img => { 
            this.image = img;
            this.spawn();  
        });  
    }   
}      
function loadImage(src) {
    return new Promise((resolve, reject) => {
         const img=new Image();     
         img.src=src;
         img.onload=()=>resolve(img);     
         img.onerror=(e)=>reject(e);     
     });
}
const game=new Game('gameCanvas'); 
