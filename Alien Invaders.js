document.addEventListener('DOMContentLoaded', function () {
    //catching the elements
    const btn_start = document.querySelector(".startButton");
    const myShip = document.querySelector(".myShip");
    const container = document.querySelector(".container");
    const fireme = document.querySelector(".fireme");
    const scoreOutput = document.querySelector(".score");
    const restartButton = document.querySelector('.gameOver');
    const winningAnimation = document.querySelector('.win');
    const message = document.querySelector('.message');
    const audioWin = new Audio('Audio/Win.mp3');
    const audioLose = new Audio('Audio/Lose.mp3');
    const audioBlasterOneShot = new Audio('Audio/BlasterOneShot.mp3');
    const gameAudio = new Audio('Audio/InterstellarOdyssey.ogg');
    const engineOn = document.querySelector('.engineOn');


    //the background music in an infinite loop
    gameAudio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);



    //the button object
    let keyV = {};

    //taking actions
    document.addEventListener('keydown', function (e) {
        let key = e.keyCode;
        if (key === 37) keyV.left = true;
        else if (key === 39) keyV.right = true;
        else if (key === 38) keyV.up = true;
        else if (key === 40) keyV.down = true;
        //only if a shot is not already in prgress
        else if (key === 32 && !player.fire) addShoot();
    });
    //stoping the actions
    document.addEventListener('keyup', function (e) {
        let key = e.keyCode;
        if (key === 37) keyV.left = false;
        else if (key === 39) keyV.right = false;
        else if (key === 38) keyV.up = false;
        else if (key === 40) keyV.down = false;
    });

    //setting the boundries
    const containerDim = container.getBoundingClientRect();
    console.log(containerDim);

    //the game object
    let player = {
        score: 0,
        speed: 5,
        gameOver: true,
        fire: false,
        alienSpeed: 5

    };
    //deleting all the enemies
    function clearAliens() {
        let tempAliens = document.querySelectorAll('.alien');
        for (var i = 0; i < tempAliens.length; i++) {
            tempAliens[i].parentNode.removeChild(tempAliens[i]);
        }
    }

    // button that starts the game
    btn_start.addEventListener('click', startGame);
    // starting the game and restarting settings
    function startGame() {

        if (player.gameOver) {
            clearAliens();
            player.gameOver = false;
            btn_start.classList.add('hide');
            restartButton.classList.add('hide');
            winningAnimation.classList.add('hide');
            player.alienSpeed = 5;
            player.score = 0;
            scoreOutput.innerHTML = '0';
            messageOutPut("");
            setupAliens(10);
            gameAudio.play();
            player.animFrame = requestAnimationFrame(update);

        }
    }

    //showing the Game Over animation
    function gameOver() {
        restartButton.classList.remove('hide');
        messageOutPut(' You Lost!');
        endShot();
        audioLose.play();
    }
    // clicking the game over restarts the game
    restartButton.addEventListener('click', startGame);

    //you won animation
    function winning() {
        winningAnimation.classList.remove('hide');
        messageOutPut(' You Won!');
        endShot();
        audioWin.play();
    }
    //clicking the you won restarts the game
    winningAnimation.addEventListener('click', startGame);

    //setting up the location of the enemies
    function setupAliens(num) {
        let tempWidth = 100;
        //setting the right border
        let lastCol = containerDim.right - tempWidth;
        //location of the first enemy
        let row = {
            x: containerDim.left + 50,
            y: 50
        };
        //calling a function to generate enemies
        for (let i = 0; i < num; i++) {

            if ((row.x + tempWidth) > lastCol) {
                row.y += 70;
                row.x = containerDim.left + 50;
            }
            //generating the enemies with a space between them
            alienMaker(row, tempWidth);
            row.x += tempWidth + 20;
        }

    }

    //generating a random color
    function randomColor() {
        return '#' + Math.random().toString(16).substr(-6);
    }

    // generating the enemies and drawing them
    function alienMaker(row, tempWidth) {
        if (row.y > containerDim.height - 200) return;
        let div = document.createElement('div');
        div.classList.add('alien');
        div.width = tempWidth;
        div.style.width = div.width;
        div.xpos = Math.floor(row.x);
        div.ypos = Math.floor(row.y);
        div.style.left = div.xpos + 'px';
        div.style.top = div.ypos + 'px';
        div.style.backgroundColor = randomColor();
        div.directionMove = 1;
        container.appendChild(div);
        let eye1 = document.createElement('span');
        eye1.classList.add('eye');
        eye1.style.left = '10px';
        div.appendChild(eye1);
        let eye2 = document.createElement('span');
        eye2.classList.add('eye');
        eye2.style.right = '10px';
        div.appendChild(eye2);
        let mouth = document.createElement('span');
        mouth.classList.add('mouth');
        div.appendChild(mouth);
    }



    //shooting

    function addShoot() {
        player.fire = true;
        fireme.classList.remove('hide');
        fireme.xpos = myShip.offsetLeft + (myShip.offsetWidth / 2);
        fireme.ypos = myShip.offsetTop - 10;
        fireme.style.left = fireme.xpos + 'px';
        fireme.style.top = fireme.ypos + 'px';
        audioBlasterOneShot.play();

    }
    // making the shot disappear
    function endShot() {
        player.fire = false;
        fireme.classList.add('hide');
    }

    //checking a collision between two objects
    function isCollide(a, b) {
        let aRect = a.getBoundingClientRect();
        let bRect = b.getBoundingClientRect();
        //returning of there is a collision of rectangles
        return !(
            (aRect.bottom < bRect.top) ||
            (aRect.top > bRect.bottom) ||
            (aRect.right < bRect.left) ||
            (aRect.left > bRect.right)
        )
    }
    //messages to the user
    function messageOutPut(msg) {
        message.innerHTML = msg;
    }
    // when the enemy gets shot he disappears and the other enemies move faster
    function enemyShot(el) {
        player.alienSpeed++;
        player.score++;
        scoreOutput.textContent = player.score;
        endShot();
        el.parentNode.removeChild(el);
        messageOutPut(' Hit!');
    }

    //animations taking place
    function update() {
        //selecting the enemies
        let tempAliens = document.querySelectorAll('.alien');
        //if all enemies are destroyed
        if (tempAliens.length === 0) {
            player.gameOver = true;
            winning();
        }
        for (let i = tempAliens.length - 1; i > -1; i--) {
            let el = tempAliens[i];
            //if an enemy was shot, update the score and fasten the speed of the enemies
            if (isCollide(el, fireme)) enemyShot(el);
            //if the enemy reaches the boundries change the direction and come closer to the ship
            if ((el.xpos + el.width) > (containerDim.right - 150) || el.xpos < containerDim.left - 100) {
                el.directionMove *= -1;
                el.ypos += 40;
            }
                //if the enemies reach the ship game over
                if (el.ypos > containerDim.bottom - 100 || isCollide(myShip,el)) {
                    player.gameOver = true;
                    gameOver();
                }
            
            //moving the enemies
            el.xpos = el.xpos + (player.alienSpeed * el.directionMove);
            el.style.left = el.xpos + 'px';
            el.style.top = el.ypos + 'px';
        }

        //firing
        if (player.fire) {
            fireme.ypos -= 15;
            fireme.style.top = fireme.ypos + 'px';
            //a missed shot
            if (fireme.ypos <= containerDim.top - 50) {
                endShot();
            }
        }
        //moving the ship left and right
        let tempPosX = myShip.offsetLeft;
        let tempPosY = myShip.offsetTop;
        if (keyV.left && tempPosX > containerDim.left - 100) tempPosX -= player.speed;
        if (keyV.right && (tempPosX + myShip.offsetWidth) < (containerDim.right - 150)) tempPosX += player.speed;
        if (keyV.up && tempPosY > (containerDim.top+(containerDim.height/2))) tempPosY -= player.speed;
        if (keyV.down && ((tempPosY + myShip.offsetHeight) < (containerDim.bottom - (engineOn.height+50)))) tempPosY += player.speed;
        myShip.style.left = tempPosX + 'px';
        myShip.style.top = tempPosY + 'px';

        if (keyV.left || keyV.right || keyV.up || keyV.down) engineOn.classList.remove('hide');
        if (!keyV.left && !keyV.right && !keyV.up && !keyV.down) engineOn.classList.add('hide');
        //repeating
        if (!player.gameOver) player.animFrame = requestAnimationFrame(update);
    }
});
