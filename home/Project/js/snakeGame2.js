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
  class GameObject {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
    }
    
    draw(ctx, size) {
        ctx.drawImage(this.image, this.x * size, this.y * size, size, size);
    }
}

class Food extends GameObject {
    constructor(x, y, image) {
        super(x, y, image);
    }
}

class Bomb extends GameObject {
    constructor(x, y, image) {
        super(x, y, image);
    }
}

class Heart extends GameObject {
    constructor(x, y, image) {
        super(x, y, image);
    }
}
class Game {
    
}