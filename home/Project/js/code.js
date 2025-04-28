
class Snake {
    constructor() {
        this.body = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.grow = false; // Флаг для увеличения змейки
        this.image = new Image();
        this.image.src = 'snake_head.png'; // Путь к изображению головы змейки
    }

    update() {
        const head = { x: this.body[0].x + this.direction.x * 10, y: this.body[0].y + this.direction.y * 10 };

        if (this.grow) {
            this.body.unshift(head);
            this.grow = false; // Сбрасываем флаг
        } else {
            this.body.unshift(head);
            this.body.pop(); // Удаляем последний сегмент
        }
    }

    changeDirection(newDirection) {
        // Запрещаем движение в противоположном направлении
        if (newDirection.x !== -this.direction.x || newDirection.y !== -this.direction.y) {
            this.direction = newDirection;
        }
    }

    checkCollision(canvasWidth, canvasHeight) {
        const head = this.body[0];

        // Столкновение со стенами
        if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) return true;

        // Столкновение с самим собой
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) return true;
        }

        return false;
    }

    growSnake() {
        this.grow = true; // Увеличиваем змейку при поедании еды
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.body[0].x, this.body[0].y, 10, 10);
        
        for (let i = 1; i < this.body.length; i++) {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.body[i].x, this.body[i].y, 10, 10);
        }
    }
}

class Food {
    constructor(canvasWidth, canvasHeight) {
        this.position = {};
        this.spawn(canvasWidth, canvasHeight);
        
        // Загрузка изображения еды
        this.image = new Image();
        this.image.src = 'food.png'; // Путь к изображению еды
    }

    spawn(canvasWidth, canvasHeight) {
        const xLimit = Math.floor(canvasWidth / 10);
        const yLimit = Math.floor(canvasHeight / 10);
        
        do {
            this.position.x = Math.floor(Math.random() * xLimit) * 10;
            this.position.y = Math.floor(Math.random() * yLimit) * 10;
        } while (this.position.x % 10 !== 0 || this.position.y % 10 !== 0); // Убедимся что координаты кратны 10 для правильного размещения на сетке.
        
     }

     draw(ctx) { 
         ctx.drawImage(this.image, this.position.x, this.position.y, 10, 10); 
     } 
} 

class Heart { 
     constructor(canvasWidth, canvasHeight) { 
         this.position = {}; 
         this.spawn(canvasWidth, canvasHeight); 

         // Загрузка изображения сердечка 
         this.image = new Image(); 
         this.image.src = 'heart.png'; // Путь к изображению сердечка 
     } 

     spawn(canvasWidth, canvasHeight) { 
         const xLimit = Math.floor(canvasWidth / 10); 
         const yLimit = Math.floor(canvasHeight / 10); 

         do { 
             this.position.x = Math.floor(Math.random() * xLimit) * 10; 
             this.position.y = Math.floor(Math.random() * yLimit) * 10; 
         } while (this.position.x % 10 !== 0 || this.position.y % 10 !== 0); 
     } 

     draw(ctx) { 
         ctx.drawImage(this.image, this.position.x, this.position.y, 10, 10); 
     } 
} 

class Bomb { 
     constructor(canvasWidth, canvasHeight) { 
         this.position = {}; 
         this.spawn(canvasWidth, canvasHeight); 

         // Загрузка изображения бомбы 
         this.image = new Image(); 
         this.image.src = 'bomb.png'; // Путь к изображению бомбы 
     } 

     spawn(canvasWidth, canvasHeight) { 
         const xLimit = Math.floor(canvasWidth / 10); 
         const yLimit = Math.floor(canvasHeight / 10); 

         do { 
             this.position.x = Math.floor(Math.random() * xLimit) * 10; 
             this.position.y = Math.floor(Math.random() * yLimit) * 10; 
         } while (this.position.x % 10 !== 0 || this.position.y % 10 !== 0);  
     } 

     draw(ctx) {  
          ctx.drawImage(this.image,this.position.x,this.position.y ,10 ,10 );  
      }  
}  

class Game {  
      constructor() {  
          // Инициализация канваса и контекста  
          const containerElement=document.getElementById('game-container');  
          const containerStyle=window.getComputedStyle(containerElement);  
          const containerPadding=parseInt(containerStyle.padding)*2;  

          // Установка размеров канваса  
          const width=window.innerWidth*0.8-containerPadding;  
          const height=window.innerHeight*0.8-containerPadding;  

          // Создание канваса и контекста  
          const gameCanvas=document.getElementById('gameCanvas');  
          gameCanvas.width=width;  
          gameCanvas.height=height;  
          this.timeElapsed = 0; // Переменная для отслеживания времени
        this.lastTime = 0; // Переменная для отслеживания времени последнего кадра
        this.gameLoop = this.gameLoop.bind(this); // Привязываем контекст

          // Инициализация элементов игры  
          document.getElementById('startButton').addEventListener('click', () => {   
              clearInterval(this.gameInterval);   
              document.getElementById('gameOver').style.display='none';   
              document.getElementById('score').textContent='0';   
              document.getElementById('lives').textContent='3';   
              document.getElementById('finalScore').textContent='';   
              gameCanvas.style.display='block';   
              gameCanvas.style.border='1px solid black';   

              // Создание объектов игры   
              gameCanvas.style.display='block';   
              gameCanvas.style.border='1px solid black';   

              // Создание объектов игры   
              gameCanvas.style.display='block';   
              gameCanvas.style.border='1px solid black';   

              // Создание объектов игры   
              gameCanvas.style.display='block';   
              gameCanvas.style.border='1px solid black');   }}

              

let food=new Food(gameCanvas.width ,gameCanvas.height );    
                  let heart=new Heart(gameCanvas.width ,gameCanvas.height );    
                  let bomb=new Bomb(gameCanvas.width ,gameCanvas.height );    
                  let snake=new Snake();    

                  let score=0 ;    
                  let lives=3 ;    

                  window.addEventListener('keydown', event => {    
                      switch(event.key){    
                          case 'ArrowUp':    
                              snake.changeDirection({x :0 ,y :-1 });    
                              break ;    
                          case 'ArrowDown':    
                              snake.changeDirection({x :0 ,y :1 });    
                              break ;    
                          case 'ArrowLeft':    
                              snake.changeDirection({x :-1 ,y :0 });    
                              break ;    
                          case 'ArrowRight':    
                              snake.changeDirection({x :1 ,y :0 });    
                              break ;    
                      }     
                  });    

                  const updateScoreAndLivesDisplay=()=>{     
                      document.getElementById('score').textContent=score ;     
                      document.getElementById('lives').textContent=lives ;     
                  };    

                  updateScoreAndLivesDisplay();    

                  const checkCollisions=()=>{     
                      if(snake.checkCollision(gameCanvas.width ,gameCanvas.height)){     
                          lives--;     
                          if(lives<=0){     
                              clearInterval(this.gameInterval);     
                              document.getElementById('gameOver').style.display='block';     
                              document.getElementById('finalScore').textContent=score ;     
                          } else{     
                              updateScoreAndLivesDisplay();     
                          }     
                      }     

                      if(snake.body[0].x===food.position.x && snake.body[0].y===food.position.y){     
                          score++;     
                          snake.growSnake();     
                          food.spawn(gameCanvas.width ,gameCanvas.height );     
                      }     

                      if(snake.body[0].x===heart.position.x && snake.body[0].y===heart.position.y){      
                          lives++;      
                          heart.spawn(gameCanvas.width ,gameCanvas.height );      
                      }      

                      if(snake.body[0].x===bomb.position.x && snake.body[0].y===bomb.position.y){      
                          lives--;      
                          bomb.spawn(gameCanvas.width ,gameCanvas.height );      
                      }      
                  };    

                    const gameLoop = () => {
                      snake.update();
                      checkCollisions();
                      ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Очистка канваса
                      snake.draw(ctx);
                      food.draw(ctx);
                      heart.draw(ctx);
                      bomb.draw(ctx);
                  };

                  this.gameInterval = setInterval(gameLoop, 100); // Запуск игрового цикла
              });
          }
      }

gameLoop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp; // Инициализация lastTime при первом вызове

    const deltaTime = (timestamp - this.lastTime) / 1000; // Вычисляем время между кадрами в секундах
    this.lastTime = timestamp;

    this.timeElapsed += deltaTime; // Увеличиваем время

    snake.update();
    checkCollisions();
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Очистка канваса
    snake.draw(ctx);
    food.draw(ctx);
    heart.draw(ctx);
    bomb.draw(ctx);

    // Отображение времени на экране
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Time: ${Math.floor(this.timeElapsed)}`, 10, 20); // Отображаем время

    requestAnimationFrame(this.gameLoop); // Запрос следующего кадра
}

start() {
    requestAnimationFrame(this.gameLoop); // Запуск игрового цикла
}


const game = new Game();
game.start(); // Запускаем игру

// Инициализация игры
/*const game = new Game();

              

Изменения 

class Game {
    constructor() {
        // ... ваш существующий код ...

        this.timeElapsed = 0; // Переменная для отслеживания времени
        this.lastTime = 0; // Переменная для отслеживания времени последнего кадра
        this.gameLoop = this.gameLoop.bind(this); // Привязываем контекст
    }

    gameLoop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp; // Инициализация lastTime при первом вызове

        const deltaTime = (timestamp - this.lastTime) / 1000; // Вычисляем время между кадрами в секундах
        this.lastTime = timestamp;

        this.timeElapsed += deltaTime; // Увеличиваем время

        snake.update();
        checkCollisions();
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Очистка канваса
        snake.draw(ctx);
        food.draw(ctx);
        heart.draw(ctx);
        bomb.draw(ctx);

        // Отображение времени на экране
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Time: ${Math.floor(this.timeElapsed)}`, 10, 20); // Отображаем время

        requestAnimationFrame(this.gameLoop); // Запрос следующего кадра
    }

    start() {
        requestAnimationFrame(this.gameLoop); // Запуск игрового цикла
    }
}

const game = new Game();
game.start(); // Запускаем игру*/



   /* resetGame() {
        this.startGame();
    }

    run() {
        if (!this.isGameOver) {
            this.update();
            this.draw();
            requestAnimationFrame(this.run.bind(this));
        }
    }

    update() {
        this.snake.update();
        this.checkCollisions();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.snake.draw();
        this.food.draw();
        this.bomb.draw();
        this.heart.draw();
        document.getElementById('score').innerText = `Счет: ${this.score}`;
        document.getElementById('lives').innerText = `Жизни: ${this.lives}`;
    }

    checkCollisions() {
        if (this.snake.eat(this.food)) {
            this.score++;
            this.food.spawn();
        }
        if (this.snake.eat(this.bomb)) {
            this.lives--;
            this.bomb.spawn();
        }
        if (this.snake.eat(this.heart)) {
            this.lives++;
            this.heart.spawn();
        }
        if (this.snake.collideWithWalls() || this.snake.collideWithSelf()) {
            this.lives--;
        }
        if (this.lives <= 0) {
            this.endGame();
        }
    }

    endGame() {
        this.isGameOver = true;
        document.getElementById('final-score').innerText = `Ваш счет: ${this.score}`;
        document.getElementById('game-over').style.display = 'block';
    }*/