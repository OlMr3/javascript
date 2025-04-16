class TGameModel {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;

        // Создание объектов модели данных
        this.snake = new this.Snake(this);
        this.food = null;
        this.bomb = null;
        this.heart = null;

        // Инициализация игры
        this.spawnFood();
        this.spawnBomb();
        this.spawnHeart();
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.snake.reset();
        this.isGameOver = false;

        // Перезапуск еды и объектов
        this.spawnFood();
        this.spawnBomb();
        this.spawnHeart();
    }

    spawnFood() {
       const x = Math.floor(Math.random() * this.cols);
       const y = Math.floor(Math.random() * this.rows);
       this.food = new this.Food(x, y);
   }

   spawnBomb() {
       const x = Math.floor(Math.random() * this.cols);
       const y = Math.floor(Math.random() * this.rows);
       this.bomb = new this.Bomb(x, y);
   }

   spawnHeart() {
       const x = Math.floor(Math.random() * this.cols);
       const y = Math.floor(Math.random() * this.rows);
       this.heart = new this.Heart(x, y);
   }

   update(deltaTime) {
      if (this.isGameOver) return;

      const moved = this.snake.update(deltaTime);

      if (moved) {
          if (this.checkCollisionWithFood()) {
              // Обновление счета
              ++this.score; 
              // Увеличение длины змейки
              this.snake.grow();
              // Спавн новой еды
              if (!this.food) { 
                  this.spawnFood(); 
              }
          }
          if (this.checkCollisionWithHeart()) {
              // Увеличение жизней
              ++this.lives; 
              // Удалить сердце после поедания
              if (this.heart) { 
                  this.heart = null; 
                  // Спавн нового сердца
                  if (!this.heart) { 
                      this.spawnHeart(); 
                  }
              }
          }
          if (this.checkCollisionWithBomb() || 
              this.snake.checkSelfCollision() || 
              this.checkWallCollision()) {
              if (--this.lives <= 0) {
                  return (this.isGameOver=true); 
              } else {
                  if (!this.food) { 
                      // Спавн новой еды
                      this.spawnFood(); 
                  }
                  if (!this.bomb) { 
                      // Спавн новой бомбы
                      this.spawnBomb(); 
                  }
                  if (!this.heart) { 
                      // Спавн нового сердца
                      this.spawnHeart(); 
                  }
              }
          }
      }
   }

   checkCollisionWithFood() {
       const headPos = { ...this.snake.body[0] }; // Получаем позицию головы змейки
       return headPos.x === (this.food ? this.food.x : -1) && headPos.y === (this.food ? this.food.y : -1);
   }

   checkCollisionWithHeart() {
       const headPos = { ...this.snake.body[0] }; // Получаем позицию головы змейки
       return headPos.x === (this.heart ? this.heart.x : -1) && headPos.y === (this.heart ? this.heart.y : -1);
   }

   checkCollisionWithBomb() {
       const headPos = { ...this.snake.body[0] }; // Получаем позицию головы змейки
       return headPos.x === (this.bomb ? this.bomb.x : -1) && headPos.y === (this.bomb ? this.bomb.y : -1);
   }

   checkWallCollision() {
     const headPos = { ...this.snake.body[0] }; // Получаем позицию головы змейки
     return (
         headPos.x < 0 || 
         headPos.x >= this.cols || 
         headPos.y < 0 || 
         headPos.y >= this.rows
     );
 }

 Snake(parent) { // Вложенный класс Змейки
     class SnakeClass {
         constructor(parent) {
             parent.body=[{ x: Math.floor(parent.cols / 2), y: Math.floor(parent.rows / 2) }];
             parent.direction='RIGHT'; // Начальное направление движения.
         }
         reset() { 
             parent.body.length=0; 
             parent.body.push({ x: Math.floor(parent.cols / 2), y: Math.floor(parent.rows / 2) }); 
         }
         setDirection(newDir) { parent.direction=newDir; }
         update(deltaTime) { 
             let moved=false; 

             let newHead={...parent.body[0]}; 

             switch(parent.direction){ case 'UP': newHead.y--; break; case 'DOWN': newHead.y++; break; case 'LEFT': newHead.x--; break; case 'RIGHT': newHead.x++; break; } 

             parent.body.unshift(newHead); 

             moved=true; 

             if(!moved){ parent.body.pop(); } 

             return moved; 
         } 

         grow() { parent.body.push({...parent.body[parent.body.length-1]}); } 

         getHeadPosition() { return {...parent.body[0]}; } 

         checkSelfCollision() { for(let i=1;i<parent.body.length;i++){ if(parent.body[i].x===parent.body[0].x && parent.body[i].y===parent.body[0].y){ return true; } } return false; }  
     }
     return SnakeClass;
 }

 Food(x, y) { // Вложенный класс Еды
     class FoodClass {
         constructor(x, y) {
             [this.x,this.y]=[x,y];
         }
     }
     return FoodClass;
 }

 Bomb(x, y) { // Вложенный класс Бомбы
     class BombClass {
         constructor(x, y) {
             [this.x,this.y]=[x,y];
         }
     }
     return BombClass;
 }

 Heart(x, y) { // Вложенный класс Сердца
     class HeartClass {
         constructor(x, y) {
             [this.x,this.y]=[x,y];
         }
     }
     return HeartClass;
 }

}

class ImageLoader {
    constructor(paths) {
        // Загрузка изображений по указанным путям.
        const imageNames = Object.keys(paths);
        
        for (const name of imageNames) {
            const img = new Image();
            img.src = paths[name];
            paths[name] = img;  // Сохраняем загруженное изображение обратно в объект.
        }

        return paths;
    }
}

// Пример использования:
const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const gameModel=new TGameModel(20,20);

// Загрузка изображений.
gameModel.images = new ImageLoader({
    snakeHead: 'path/to/snake_head.png',
    food: 'path/to/food.png',
    bomb: 'path/to/bomb.png',
    heart: 'path/to/heart.png'
});

// Обработчик событий для управления движением змейки.
document.addEventListener('keydown', function(event){
   switch(event.key){
       case 'ArrowUp': gameModel.snake.setDirection('UP'); break;
       case 'ArrowDown': gameModel.snake.setDirection('DOWN'); break;
       case 'ArrowLeft': gameModel.snake.setDirection('LEFT'); break;
       case 'ArrowRight': gameModel.snake.setDirection('RIGHT'); break;
   }
});

// Функция для запуска игры.
function startGame(){
   gameModel.reset();  
   requestAnimationFrame(gameLoop);  
}

// Функция игрового цикла.
function gameLoop(timestamp){
    gameModel.update(timestamp);  
    draw(ctx);  
    requestAnimationFrame(gameLoop);  
}

// Функция отрисовки.
function draw(ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);  

    for(let segment of	gameModel.snake.body){  
      ctx.drawImage(gameModel.images.snakeHead,
                    segment.x*size,
                    segment.y*size,
                    size,
                    size);  
    }  

    ctx.drawImage(gameModel.images.food,
               	gameModel.food.x*size,
               	gameModel.food.y*size,
               	size,
               	size);  

    ctx.drawImage(gameModel.images.bomb,
               	gameModel.bomb.x*size,
               	gameModel.bomb.y*size,
               	size,
               	size);  

    ctx.drawImage(gameModel.images.heart,
               	gameModel.heart.x*size,
               	gameModel.heart.y*size,
               	size,
               	size);  
}




/*class TGameModel {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.snake = new this.Snake(this);
        this.food = null;
        this.bomb = null;
        this.heart = null;

        // Загрузка изображений
        this.images = {
            snakeHead: new Image(),
            food: new Image(),
            bomb: new Image(),
            heart: new Image()
        };
        
        // Укажите пути к вашим изображениям
        this.images.snakeHead.src = 'path/to/snake_head.png';
        this.images.food.src = 'path/to/food.png';
        this.images.bomb.src = 'path/to/bomb.png';
        this.images.heart.src = 'path/to/heart.png';

        // Инициализация игры
        this.spawnFood();
        this.spawnBomb();
        this.spawnHeart();
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.snake.reset();
        this.isGameOver = false;

        // Перезапуск еды и объектов
        this.spawnFood();
        this.spawnBomb();
        this.spawnHeart();

       // Скрыть сообщение об окончании игры
       document.getElementById('gameOverMessage').style.display = 'none';
    }

    spawnFood() {
       const x = Math.floor(Math.random() * this.cols);
       const y = Math.floor(Math.random() * this.rows);
       this.food = new this.Food(x, y);
   }

   spawnBomb() {
       const x = Math.floor(Math.random() * this.cols);
       const y = Math.floor(Math.random() * this.rows);
       this.bomb = new this.Bomb(x, y);
   }

   spawnHeart() {
       const x = Math.floor(Math.random() * this.cols);
       const y = Math.floor(Math.random() * this.rows);
       this.heart = new this.Heart(x, y);
   }

   update(deltaTime) {
      if (this.isGameOver) return;

      const moved = this.snake.update(deltaTime);

      if (moved) {
          if (this.checkCollisionWithFood()) {
              // Обновление счета
              document.getElementById('score').innerText = "Счет: " + ++this.score; 
              // Увеличение длины змейки
              this.snake.grow();
              // Спавн новой еды
              if (!this.food) { 
                  this.spawnFood(); 
              }
          }
          if (this.checkCollisionWithHeart()) {
              // Увеличение жизней
              document.getElementById('lives').innerText = "Жизни: " + ++this.lives; 
              // Удалить сердце после поедания
              if (this.heart) { 
                  this.heart = null; 
                  // Спавн нового сердца
                  if (!this.heart) { 
                      this.spawnHeart(); 
                  }
              }
          }
          if (this.checkCollisionWithBomb() || 
              this.snake.checkSelfCollision() || 
              this.checkWallCollision()) {
              if (--this.lives <= 0) {
                  document.getElementById('gameOverMessage').style.display='block'; 
                  document.getElementById('gameOverMessage').innerText =
                      "Игра окончена! Ваш счет: " + this.score + ". Нажмите 'Старт', чтобы начать заново.";
                  return (this.isGameOver=true); 
              } else {
                  alert("Вы потеряли жизнь! Осталось жизней: " + (this.lives));
                  if (!this.food) { 
                      // Спавн новой еды
                      this.spawnFood(); 
                  }
                  if (!this.bomb) { 
                      // Спавн новой бомбы
                      this.spawnBomb(); 
                  }
                  if (!this.heart) { 
                      // Спавн нового сердца
                      this.spawnHeart(); 
                  }
              }
          }
      }
   }

   checkCollisionWithFood() {
       const headPos = { ...this.snake.body[0] }; // Получаем позицию головы змейки
       return headPos.x === (this.food ? this.food.x : -1) && headPos.y === (this.food ? this.food.y : -1);
   }

   checkCollisionWithHeart() {
       const headPos = { ...this.snake.body[0] }; // Получаем позицию головы змейки
       return headPos.x === (this.heart ? this.heart.x : -1) && headPos.y === (this.heart ? this.heart.y : -1);
   }

   checkCollisionWithBomb() {
       const headPos = { ...this.snake.body[0] }; // Получаем позицию головы змейки
       return headPos.x === (this.bomb ? this.bomb.x : -1) && headPos.y === (this.bomb ? this.bomb.y : -1);
   }

   checkWallCollision() {
     const headPos = { ...this.snake.body[0] }; // Получаем позицию головы змейки
     return (
         headPos.x < 0 || 
         headPos.x >= this.cols || 
         headPos.y < 0 || 
         headPos.y >= this.rows
     );
 }

 Snake(parent) { // Вложенный класс Змейки
     class SnakeClass {
         constructor(parent) {
             parent.body=[{ x: Math.floor(parent.cols / 2), y: Math.floor(parent.rows / 2) }];
             parent.direction='RIGHT'; // Начальное направление движения.
         }
         reset() { 
             parent.body.length=0; 
             parent.body.push({ x: Math.floor(parent.cols / 2), y: Math.floor(parent.rows / 2) }); 
         }
         setDirection(newDir) { parent.direction=newDir; }
         update(deltaTime) { 
             let moved=false; 

             let newHead={...parent.body[0]}; 

             switch(parent.direction){ case 'UP': newHead.y--; break; case 'DOWN': newHead.y++; break; case 'LEFT': newHead.x--; break; case 'RIGHT': newHead.x++; break; } 

             parent.body.unshift(newHead); 

             moved=true; 

             if(!moved){ parent.body.pop(); } 

             return moved; 
         } 

         grow() { parent.body.push({...parent.body[parent.body.length-1]}); } 

         getHeadPosition() { return {...parent.body[0]}; } 

         checkSelfCollision() { for(let i=1;i<parent.body.length;i++){ if(parent.body[i].x===parent.body[0].x && parent.body[i].y===parent.body[0].y){ return true; } } return false; } 

         draw(ctx, size) { /* Отрисовка головы змейки 
             ctx.drawImage(parent.images.snakeHead, size * parent.body[0].x, size * parent.body[0].y, size, size);  
         }  
     }
     return SnakeClass;
 }

 Food(x, y) { // Вложенный класс Еды
     class FoodClass {
         constructor(x, y) {
             [this.x,this.y]=[x,y];
         }
     }
     return FoodClass;
 }

 Bomb(x, y) { // Вложенный класс Бомбы
     class BombClass {
         constructor(x, y) {
             [this.x,this.y]=[x,y];
         }
     }
     return BombClass;
 }

 Heart(x, y) { // Вложенный класс Сердца
     class HeartClass {
         constructor(x, y) {
             [this.x,this.y]=[x,y];
         }
     }
     return HeartClass;
 }

 draw(ctx){
    const size=Math.min(canvas.width/this.cols, canvas.height/this.rows);  
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);  

    for(let segment of	this.snake.body){  
      ctx.drawImage(this.images.snakeHead,
                    segment.x*size,
                    segment.y*size,
                    size,
                    size);  
    }  

    ctx.drawImage(this.images.food,
               	this.food.x*size,
               	this.food.y*size,
               	size,
               	size);  

    ctx.drawImage(this.images.bomb,
               	this.bomb.x*size,
               	this.bomb.y*size,
               	size,
               	size);  

    ctx.drawImage(this.images.heart,
               	this.heart.x*size,
               	this.heart.y*size,
               	size,
               	size);  
}

}

// Пример использования:
const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const gameModel=new TGameModel(20,20);

// Обработчик событий для управления движением змейки.
document.addEventListener('keydown', function(event){
   switch(event.key){
       case 'ArrowUp': gameModel.snake.setDirection('UP'); break;
       case 'ArrowDown': gameModel.snake.setDirection('DOWN'); break;
       case 'ArrowLeft': gameModel.snake.setDirection('LEFT'); break;
       case 'ArrowRight': gameModel.snake.setDirection('RIGHT'); break;
   }
});

// Функция для запуска игры.
function startGame(){
   gameModel.reset();  
   requestAnimationFrame(gameLoop);  
}

// Основной игровой цикл.
function*/