class Snake {
    constructor(headImage, cols, rows) {
      this.headImage = headImage; //сохраняем изображение головы змейки
      this.cols = cols; //сохраняем кол-во столбов игрового поля
      this.rows = rows; //сохраняем кол-во строк игрового поля
      this.reset(cols, rows); // Вызываем метод reset для инициализации состояния змейки
    }
    reset(cols, rows) {
      // Начальная позиция змейки — центр поля
      const startX = Math.floor(cols / 2);
      const startY = Math.floor(rows / 2);
      this.segments = [
        { x: startX, y: startY },
        { x: startX - 1, y: startY }, //голова змейки будет справа, а следующие 2 сегмента слева. в начале игры змейка 3 клетки
        { x: startX - 2, y: startY }
      ];
      this.direction = { x: 0, y: 0 }; // змейка не двигается при запуске, как только нажата клавиша - начнется движение
      this.nextDirection = { x: 0, y: 0 };
      this.alive = true; //отслеживание состояния змейки
      this.moveCooldown = 0; // для контроля скорости движения
      this.moveInterval = 0.15; // время между шагами змейки (в секундах)
    }
  
    setDirection(newDir) {
      // Запрещаем разворот на противоположное направление
      if (
        (newDir.x === -this.direction.x && newDir.y === 0) ||
        (newDir.y === -this.direction.y && newDir.x === 0)
      ) {
        return;
      }
      this.nextDirection = newDir;
    }
  
    update(deltaTime) {
      if (!this.alive) return false;
      this.moveCooldown += deltaTime;
      if (this.moveCooldown >= this.moveInterval) {
        this.moveCooldown -= this.moveInterval;
        // Обновляем направление
        this.direction = this.nextDirection;
        // Вычисляем новую позицию головы
        const newHead = {
          x: this.segments[0].x + this.direction.x,
          y: this.segments[0].y + this.direction.y,
        };
        // Добавляем новую голову в начало массива сегментов
        this.segments.unshift(newHead);
        // Удаляем последний сегмент (если не растём)
        if (!this.growing) {
          this.segments.pop();
        } else {
          // Если растём — не удаляем хвост и сбрасываем флаг роста
          this.growing = false;
        }
        return true; // змейка сделала шаг
      }
      return false; // змейка не двигалась в этом кадре
    }
  
    grow() {
      this.growing = true;
    }
  
    getHeadPosition() {
      return this.segments[0];
    }
  
    checkSelfCollision() { //проверка на столкновение с собой
      const head = this.getHeadPosition();
      
      for (let i =1; i <this.segments.length; i++) {
        if (this.segments[i].x === head.x && this.segments[i].y === head.y) {
          return true;
        }
      }
      
      return false;
    }
  
    draw(ctx, size) {
      ctx.save();
  
      for(let i=0; i<this.segments.length; i++){
        const seg=this.segments[i];
        
        const px=seg.x*size;
        const py=seg.y*size;
  
        if(i===0){
          // Рисуем голову с поворотом в направлении движения
          ctx.translate(px + size/2, py + size/2);
          let angle=0;
          if(this.direction.x===1 && this.direction.y===0){
            angle=0;
          } else if(this.direction.x===-1 && this.direction.y===0){
            angle=Math.PI;
          } else if(this.direction.x===0 && this.direction.y===-1){
            angle=-Math.PI/2;
          } else if(this.direction.x===0 && this.direction.y===1){
            angle=Math.PI/2;
          }
          
          ctx.rotate(angle);
          
          ctx.drawImage(this.headImage, -size/2, -size/2, size, size);
          
          ctx.rotate(-angle);
          ctx.translate(-(px + size/2), -(py + size/2));
          
        } else {
          // Рисуем тело змейки простым прямоугольником или цветом
          
          ctx.fillStyle='green';
          ctx.fillRect(px, py, size, size); //тело змейки
          ctx.strokeStyle='darkgreen';
          ctx.strokeRect(px, py, size, size); //рамка змейки
        }   
       }
  
       ctx.restore();
     }
  }
  class Food {
    constructor(x, y, image) {
      this.x = x;
      this.y = y;
      
      this.image = image;
    }
    
    draw(ctx,size){
       ctx.drawImage(this.image,this.x*size,this.y*size,size,size);
     }
  }
  class Bomb {
    constructor(x,y,image){
      this.x=x;
      this.y=y;
      this.image=image;
    }
    
    draw(ctx,size){
      ctx.drawImage(this.image,this.x*size,this.y*size,size,size);
    }
 }
 class Heart{
    constructor(x,y,image){
      this.x=x;
      this.y=y;
      this.image=image;
    }
    
    draw(ctx,size){
      ctx.drawImage(this.image,this.x*size,this.y*size,size,size);
    }
 }
 // Класс Game отвечает за логику игры
// Класс Game отвечает за логику игры
class Game {
    constructor(canvas) {
      // Сохраняем ссылку на элемент canvas и его контекст для рисования
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
  
      // Устанавливаем размеры ячеек и количество столбцов и строк
      this.cellSize = 20; // Размер одной ячейки в пикселях
      this.cols = 30; // Количество столбцов
      this.rows = 20; // Количество строк
  
      // Инициализируем счет, жизни и состояние игры
      this.score = 0;
      this.lives = 3;
      this.isGameOver = false;
  
      // Объект для хранения загруженных изображений
      this.images = {};
  
      // Загружаем изображения и после завершения загрузки инициализируем игру
      this.loadImages(() => {
        this.init(); // Инициализация игры
        requestAnimationFrame(this.gameLoop.bind(this)); // Запуск игрового цикла
      });
  
      // Обработчик событий для нажатий клавиш
      window.addEventListener('keydown', (e) => {
        if (this.isGameOver) return; // Если игра окончена, игнорируем нажатия
  
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            this.snake.setDirection({ x: 0, y: -1 }); // Движение вверх
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            this.snake.setDirection({ x: 0, y: +1 }); // Движение вниз
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            this.snake.setDirection({ x: -1, y: 0 }); // Движение влево
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            this.snake.setDirection({ x: +1, y: 0 }); // Движение вправо
            break;
        }
      });
  
      // Обработчик события изменения размера окна
      window.addEventListener('resize', () => {
        this.resize(); // Пересчитываем размеры канваса при изменении окна
      });
    }
      resize() {
        // Устанавливаем новые размеры канваса в зависимости от размеров окна
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Если необходимо, можно пересчитывать количество ячеек в зависимости от новых размеров
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);

        // Если нужно, можно также перерисовать элементы игры после изменения размера
        this.reset(); // Или другой метод для обновления состояния игры
    };
  
      // Элементы интерфейса для отображения состояния "game over"
      this.overlay = document.getElementById('overlay');
      this.gameOverText = document.getElementById('game-over-text');
  
      document.getElementById('restart-btn').addEventListener('click', () => {
        if (this.isGameOver) {
          this.score = 0; // Сбрасываем счет
          this.lives = 3; // Сбрасываем жизни
          this.isGameOver = false; // Устанавливаем состояние игры как активное
          this.overlay.style.display = 'none'; // Скрываем оверлей
  
          // Перезапускаем игру
          this.reset();
          requestAnimationFrame(this.gameLoop.bind(this)); // Запускаем игровой цикл заново
        }
      });
    }
  
    loadImages(callback) {
      const imageSources = {
        snakeHead: 'images/head.svg',
        food: 'images/apple.svg',
        bomb: 'images/bomb.svg',
        heart: 'images/heart.svg'
      };
  
      const keys = Object.keys(imageSources);
      let loadedCount = 0;
  
      keys.forEach(key => {
        const img = new Image();
        img.src = imageSources[key]; // Устанавливаем источник изображения
  
        img.onload = () => { 
          loadedCount++; 
          if (loadedCount === keys.length) { 
            callback(); // Вызываем коллбек после загрузки всех изображений 
          } 
        };
  
        img.onerror = () => { 
          console.error(`Ошибка загрузки изображения ${imageSources[key]}`); 
        };
  
        this.images[key] = img; // Сохраняем загруженное изображение в объекте images
      });
    }
  
    init() {
      // Инициализация объектов игры после загрузки изображений
      this.snake = new Snake(this.images.snakeHead, this.cols, this.rows); 
  
      // Создаем объекты еды, бомбы и сердца с соответствующими изображениями
      this.food = this.createFood();
      this.bomb = this.createBomb();
      this.heart = this.createHeart();
    }
  
    createFood() {
       let x, y;
       do {
         x = Math.floor(Math.random() * this.cols);
         y = Math.floor(Math.random() * this.rows);
       } while (this.snake.segments.some(seg => seg.x === x && seg.y === y)); 
  
       return new Food(x, y, this.images.food); 
     }
  
     createBomb() {
       let x, y;
       do {
         x = Math.floor(Math.random() * this.cols);
         y = Math.floor(Math.random() * this.rows);
       } while (this.snake.segments.some(seg => seg.x === x && seg.y === y));
  
       return new Bomb(x, y, this.images.bomb);
     }
  
     createHeart() {
       let x, y;
       do {
         x = Math.floor(Math.random() * this.cols);
         y = Math.floor(Math.random() * this.rows);
       } while (this.snake.segments.some(seg => seg.x === x && seg.y === y));
  
       return new Heart(x, y, this.images.heart);
     }
  
     reset() {
       if(this.snake) { 
         this.snake.reset(this.cols,this.rows); 
       }
       
       if(this.food) { 
         let pos; 
         do { 
           pos={x: Math.floor(Math.random()*this.cols),y: Math.floor(Math.random()*this.rows)}; 
         } while(this.snake.segments.some(seg=>seg.x===pos.x && seg.y===pos.y));
         Object.assign(this.food,pos); 
       }
       
       if(this.bomb){
         let pos; 
         do { 
           pos={x: Math.floor(Math.random()*this.cols),y: Math.floor(Math.random()*this.rows)}; 
         } while(this.snake.segments.some(seg=>seg.x===pos.x && seg.y===pos.y));
         Object.assign(this.bomb,pos); 
       }
       
       if(this.heart){
         let pos; 
         do { 
           pos={x: Math.floor(Math.random()*this.cols),y: Math.floor(Math.random()*this.rows)}; 
         } while(this.snake.segments.some(seg=>seg.x===pos.x && seg.y===pos.y));
         Object.assign(this.heart,pos); 
       }
     }
  
     gameLoop(timestamp) {
       if (this.lastTimestamp === undefined) { 
         this.lastTimestamp = timestamp; 
       }
  
       const deltaTime = (timestamp - this.lastTimestamp) / 1000; 
  
       if (!this.isGameOver) {
  
         if (this.snake.update(deltaTime)) {
  
           const headPos=this.snake.getHeadPosition();
  
           if(headPos.x ===this.food.x && headPos.y ===this.food.y){
             alert("Вы съели еду!");  
             console.log("Счет:", ++this.score);  
             console.log("Жизни:", --this.lives);  
             console.log("Позиция еды:", headPos);  
             console.log("Позиция змеи:", JSON.stringify(this.snake.segments));  
             console.log("Состояние игры:", !this.isGameOver ? "Игра продолжается" : "Игра окончена");  
             console.log("-------------------------");  
  
             alert("Вы съели еду! Ваш счет увеличен на один."); 
  
             if(headPos.x ===this.bomb.x && headPos.y ===this.bomb.y){
               alert("Вы попали на бомбу! Игра окончена.");
               alert(`Ваш финальный счет: ${score}`);
               isGameOver=true;
               overlay.style.display='flex';
               gameOverText.innerText=`Игра окончена! Ваш счет: ${score}`;
             }
  
             if(headPos.x ===this.heart.x && headPos.y ===this.heart.y){
               alert("Вы нашли сердце! Жизни восстановлены.");
               if(lives <3){
                 lives++;
               }
               heart=createHeart();
             }
  
             if(
               headPos.x <0 || headPos.x >=cols ||
               headPos.y <0 || headPos.y >=rows ||
               snake.checkSelfCollision()
             ){
               alert("Вы врезались в стену или в себя! Игра окончена.");
               isGameOver=true;
               overlay.style.display='flex';
               gameOverText.innerText=`Игра окончена! Ваш счет: ${score}`;
             }
           }
  
           const {ctx} =this;
  
           ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  
           if(!isGameOver){
                 snake.draw(ctx,size);
           }
  
           ctx.drawImage(food.image, food.x * size, food.y * size, size, size);
           ctx.drawImage(bomb.image,bomb.x*size,bomb.y*size,size,size);
           ctx.drawImage(heart.image, heart.x*size , heart.y*size , size , size);
  
           requestAnimationFrame(gameLoop.bind(this));
        }
    }
}
  
  // Инициализация игры после загрузки страницы
  
  const canvasElement=document.getElementById('game');
  const game=new Game(canvasElement);
  
  window.addEventListener('load', () => game.resize());