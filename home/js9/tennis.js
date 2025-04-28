 /* let racketH = {
            racket1PosX: field.getBoundingClientRect().left,
            racket1PosY: field.getBoundingClientRect().top + field.getBoundingClientRect().height / 2 - racket1.getBoundingClientRect().height / 2,
            racket1Spead: 0,
            racket2PosX: field.getBoundingClientRect().left + field.getBoundingClientRect().width - racket2.getBoundingClientRect().width,
            racket2PosY: field.getBoundingClientRect().top + field.getBoundingClientRect().height / 2 - racket1.getBoundingClientRect().height / 2,
            racket2Spead: 0,
            with: 20,
            height: 110,
            update: function () {
                const racket1Obj = racket1;
                const racket2Obj = racket2;
                racket1Obj.style.left = this.racket1PosX + 'px';
                racket1Obj.style.top = this.racket1PosY + 'px';
                racket2Obj.style.left = this.racket2PosX + 'px';
                racket2Obj.style.top = this.racket2PosY + 'px';
            }
        };*/
 
 
 /* function start() {
            ballH.speedX = 8;
            ballH.speedY = 3;
            setInterval(tick, 1000 / 60);
        }
        function tick() {
            racketH.update();
            racketH.racket1PosY += racketH.racket1Spead;
            if (racketH.racket1PosY + racketH.height > (field.getBoundingClientRect().top + racketAreaH.height)) {
                racketH.racket1PosY = field.getBoundingClientRect().top + racketAreaH.height - racketH.height;
            }
            if (racketH.racket1PosY < field.getBoundingClientRect().top) {
                racketH.racket1PosY = field.getBoundingClientRect().top;
            }
            racketH.racket2PosY += racketH.racket2Spead;
            if (racketH.racket2PosY + racketH.height > (field.getBoundingClientRect().top + racketAreaH.height)) {
                racketH.racket2PosY = field.getBoundingClientRect().top + racketAreaH.height - racketH.height;
            }
            if (racketH.racket2PosY < field.getBoundingClientRect().top) {
                racketH.racket2PosY = field.getBoundingClientRect().top;
            }
            ballH.posX += ballH.speedX;
            if ((ballH.posY + ball.height < racketH.racket2PosY || ballH.posY > (racketH.racket2PosY + racketH.height)) && ballH.posX + ballH.width >= (field.getBoundingClientRect().left + field.getBoundingClientRect().width)) {
                score1 += 1;
                scoreBoardInnerHTML();
                ballH.speedX = 0;
                ballH.speedY = 0;
                ballH.posX = field.getBoundingClientRect().left + field.getBoundingClientRect().width - ballH.width - 1;

            } else if (!(ballH.posY + ballH.height < racketH.racket2PosY || ballH.posY > (racketH.racket2PosY + racketH.height)) && ballH.posX + ballH.width > (racketH.racket2PosX)) {
                ballH.speedX = - ballH.speedX;
                ballH.posX = field.getBoundingClientRect().left + field.getBoundingClientRect().width - racketH.width - ballH.width;
            }
            if ((ballH.posY + ballH.height < racketH.racket1PosY || ballH.posY > (racketH.racket1PosY + racketH.height)) && ballH.posX <= (field.getBoundingClientRect().left)) {

                score2 += 1;
                scoreBoardInnerHTML();
                ballH.speedX = 0;
                ballH.speedY = 0;
                ballH.posX = field.getBoundingClientRect().left + 1;
            }
            else if (!(ballH.posY + ballH.height < racketH.racket1PosY || ballH.posY > (racketH.racket1PosY + racketH.height)) && ballH.posX < (racketH.width + racketH.racket1PosX)) {
                ballH.speedX = - ballH.speedX;
                ballH.posX = field.getBoundingClientRect().left + racketH.width;
            }
            ballH.posY -= ballH.speedY;
            if (ballH.posY + ballH.height > (field.getBoundingClientRect().top + areaH.height)) {
        ballH.speedY =- ballH.speedY;
        ballH.posY = field.getBoundingClientRect().top + areaH.height - ballH.height;
    }

    // вылетел ли мяч выше потолка?
    if (ballH.posY < field.getBoundingClientRect().top) {
        ballH.speedY =- ballH.speedY;
        ballH.posY = field.getBoundingClientRect().top;
    }

    ballH.update();
        }*/