const gameScreen = document.getElementById("gameScreen");
const ctx = gameScreen.getContext("2d");

gameScreen.width = window.innerWidth - 20;
gameScreen.height = window.innerHeight - 20;

//#region $Image

//#region $background
const backgroundImgGround = new Image();
backgroundImgGround.src =
    "https://365psd.com/images/istock/previews/8787/87879565-game-background.jpg";

const backgroundImgSpace = new Image();
backgroundImgSpace.src = "https://i.ytimg.com/vi/JPJ1doUobGY/maxresdefault.jpg";
//#endregion

//#region  $airplanes
const enemyAirplaneImg = new Image();
enemyAirplaneImg.src =
    "https://cdn.pixabay.com/photo/2020/01/19/15/02/ufo-4778062_960_720.png";

const anotherEnemyAirplaneImg = new Image();
anotherEnemyAirplaneImg.src =
    "https://images.vexels.com/media/users/3/157795/isolated/lists/3b2b23922ab44dae1ced628d82d3179a-ufo-spacecraft.png";

const myAirplaneImg = new Image();
myAirplaneImg.src =
    "https://images.vexels.com/media/users/3/145892/isolated/preview/85f69d4127e7a10e3ce3000d72ffae00-ufo-illustration-by-vexels.png";

const birdImg = new Image();
birdImg.src =
    "https://cdn.bulbagarden.net/upload/thumb/3/39/278Wingull.png/250px-278Wingull.png";
//#endregion

//#region $alien
const alienImg = new Image();
alienImg.src = "https://opengameart.org/sites/default/files/1ST%20FRAME_3.PNG";
//#endregion

//#region asteroid
const asteroidImg = new Image();
asteroidImg.src =
    "https://images.vexels.com/media/users/3/141796/isolated/preview/13873aa01e1cf392a3bb9971dca3c6fd-asteroids-fall-blue-by-vexels.png";
//#endregion

//#endregion

//#region $Audio
const backgroundAudio = new Audio();
backgroundAudio.src = "audio/Star Wars Main Theme (Full) (mp3cut.net).mp3";

const shotAudio = new Audio();
shotAudio.src = "audio/Sound Effects Shot Laser STAR WARS (mp3cut.net).mp3";

const explosionAudio = new Audio();
explosionAudio.src = "audio/EXPLOSION SOUND EFFECT (mp3cut.net).mp3";

const alienAudio = new Audio();
alienAudio.src = "audio/Roblox Boing Sound (mp3cut.net).mp3";

const endGameAudio = new Audio();
endGameAudio.src = "audio/Loser Sound Effects (mp3cut.net).mp3";
//#endregion

const screen = {
    w: gameScreen.width,
    h: gameScreen.height,
};

const speed = {
    global: 1,
    myAirplane: 5,
    shot: 3,
    enemyAirplane: 10,
    cooling: 2,
    alien: 10,
    asteroid: 5,
};

const specialOn = {
    strong: false,
    slowWorm: false,
    lotsOfAirplanes: false,
    fastFlight: false,
};

const timeOut = {};

const airplaneStats = Object.freeze({ down: 1, up: 2 });

class MyAirplane {
    constructor(x, y, w, h, Vup, Vdown) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.Vup = Vup;
        this.Vdown = Vdown;
        this.state = airplaneStats.down;
        this.shot = false;
        this.lastTime = time;

        this.warm = 0;
        this.maxWarm = 150;
        this.lastTimeWorm = time;
        this.warming = false;
    }

    updateLocation() {
        if (time - this.lastTime >= speed.myAirplane) {
            this.lastTime = time;
            if (this.state === airplaneStats.down) {
                this.y += this.Vdown;
            } else if (this.state === airplaneStats.up) {
                if (backgroundImg === backgroundImgSpace && this.y <= 0) {
                } else {
                    this.y += this.Vup;
                }
            }
        }
    }

    cooling() {
        if (time - this.lastTimeWorm >= speed.cooling) {
            this.lastTimeWorm = time;
            this.warm += -1;
        }
    }

    warmimg() {
        this.warm += 1;
    }

    draw() {
        //ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.drawImage(myAirplaneImg, this.x, this.y, this.w, this.h);
    }
}

class Shot {
    constructor(x, y, w, h, vx, strong) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.strong = strong;
        this.lastTime = time;
        this.damage = false;
    }

    updateLocation() {
        if (time - this.lastTime >= speed.shot) {
            this.lastTime = time;
            this.x += this.vx;
        }
    }

    hit(oneEnemyAirplane) {
        oneEnemyAirplane.life += this.strong;
        this.damage = true;
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class EnemyAirplane {
    constructor(x, y, w, h, vx, life, img) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.life = life;
        this.lastTime = time;
        this.img = img;
    }

    updateLocation() {
        if (time - this.lastTime >= speed.enemyAirplane) {
            this.lastTime = time;
            this.x += this.vx;
        }
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
}

class Alien {
    constructor(x, y, w, h, img, life, vy) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img;
        this.lastTime = time;
        this.vy = vy;
        this.realized = false;
        this.life = life;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }

    updateLocation() {
        if (time - this.lastTime >= speed.alien) {
            this.y += this.vy;
            this.lastTime = time;
        }
    }

    get() {
        this.realized = true;
        alienAudio.play();
        doSpecialAlien();
    }
}

class Asteroid {
    constructor(x, y, w, h, vx, vy, img) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.img = img;
        this.lastTime = time;
    }

    updateLocation() {
        if (time - this.lastTime >= speed.asteroid) {
            this.lastTime = time;
            this.x += this.vx;
            this.y += this.vy;
        }
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
}

class Random {
    constructor(x) {
        this.x = x;
    }

    random() {
        return Math.floor(Math.random() * this.x);
    }
}

const ground = 145;

let time,
    allShots,
    allEnemyAirplane,
    allAlien,
    allAsteroid,
    airplane,
    numberOfAirplanes,
    widthShot,
    gameOn,
    score,
    myBestScore,
    lastTime,
    specialTitle,
    startGameText,
    shotStrong,
    backgroundImg,
    enemyAirImg;

window.onload = setUpGame();
function setUpGame() {
    time = 0;
    score = 0;
    myBestScore = localStorage.getItem("bestScoreToJangGame");
    lastTime = 0;
    shotStrong = -1;
    numberOfAirplanes = 3;
    widthShot = 4;
    specialTitle = "";
    startGameText = "play jang!";
    backgroundImg = backgroundImgGround;
    allShots = [];
    allEnemyAirplane = [];
    allAlien = [];
    allAsteroid = [];
    airplane = new MyAirplane(300, 300, 100, 75, -6, 4);
    gameOn = true;
    endGameAudio.pause();
    endGameAudio.currentTime = 0;

    airplaneFly();
    airplaneShot();

    mainLoop();
}

function airplaneFly() {
    document.addEventListener("keydown", (event) => {
        if (event.keyCode === 38) {
            airplane.state = airplaneStats.up;
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.keyCode === 38) {
            airplane.state = airplaneStats.down;
        }
    });
}

function airplaneShot() {
    document.addEventListener("keydown", (event) => {
        if (event.keyCode === 32) {
            airplane.shot = true;
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.keyCode === 32) {
            airplane.shot = false;
        }
    });
}

function mainLoop() {
    makeNewEnemyArplane();
    makeShote();
    makeAsteroid();
    chackShotDamage();
    airplaneWarming();

    removeShot();
    removeEnemyAirplane();
    removeAlien();
    removeAsteroid();

    updateAirplane();
    updateEnemyAirplane();
    updateShot();
    updateAlien();
    updateAsteroid();

    level();
    changeBackground();
    draw();

    backgroundAudio.volume = 0.05;
    backgroundAudio.play();
    time++;
    gameOn = !chackLose();

    console.log(allAsteroid);

    if (gameOn) {
        setTimeout(mainLoop, speed.global);
    } else {
        endGame();
    }
}

function makeNewEnemyArplane() {
    if (allEnemyAirplane.length < numberOfAirplanes) {
        let newAirplane = new Random(250).random();
        if (newAirplane === 10) {
            let [w, h, vx, life, img] = typeofAirplane();
            newAirplane = new EnemyAirplane(
                screen.w,
                new Random(screen.h - (ground + h + airplane.h)).random(),
                w,
                h,
                vx,
                life,
                img
            );
            if (
                newAirplane.y + newAirplane.h < screen.h - ground &&
                newAirplane.y > airplane.w / 2
            ) {
                allEnemyAirplane.push(newAirplane);
            }
        }
    }
}

function typeofAirplane() {
    let type = new Random(9).random();
    let w, h, vx, life, img;
    switch (type) {
        case 0:
            w = 30;
            h = 20;
            vx = -5;
            life = 20;
            img = enemyAirplaneImg;
            break;
        case 1:
            w = 150;
            h = 60;
            vx = -2;
            life = 80;
            img = enemyAirplaneImg;
            break;
        case 2:
            w = 20;
            h = 10;
            vx = -7;
            life = 10;
            img = enemyAirplaneImg;
            break;
        case 3:
            w = 50;
            h = 25;
            vx = -3;
            life = 40;
            img = anotherEnemyAirplaneImg;
            break;
        case 4:
            w = 300;
            h = 120;
            vx = -1;
            life = 350;
            img = enemyAirplaneImg;
            break;
        case 5:
            w = 30;
            h = 10;
            vx = -5;
            life = 15;
            img = enemyAirplaneImg;
            break;
        case 6:
            w = 40;
            h = 40;
            vx = -4;
            life = 45;
            img = anotherEnemyAirplaneImg;
            break;
        case 7:
            w = 100;
            h = 40;
            vx = -20;
            life = 3;
            img = birdImg;
            break;
        case 8:
            w = 50;
            h = 25;
            vx = -15;
            life = 5;
            img = birdImg;
            break;
        default:
            w = 40;
            h = 20;
            vx = -5;
            life = 20;
            img = anotherEnemyAirplaneImg;
            break;
    }
    return [w, h, vx, life, img];
}

function makeShote() {
    if (airplane.shot === true && airplane.warming === false) {
        let newShot = new Shot(
            airplane.x + airplane.w,
            airplane.y + airplane.h / 2,
            widthShot,
            2,
            10,
            shotStrong
        );
        allShots.push(newShot);
        airplane.warmimg();
        shotAudio.play();
    }
}

function makeAsteroid() {
    let newAsteroid = new Random(200).random();
    if (
        backgroundImg === backgroundImgSpace &&
        newAsteroid === 10 &&
        allAsteroid.length < 1
    ) {
        let [h, w, vx, vy, img] = typeOfAsteroid();
        newAsteroid = new Asteroid(
            new Random(screen.w - w).random(),
            -h,
            w,
            h,
            vx,
            vy,
            img
        );

        allAsteroid.push(newAsteroid);
    }
}

function typeOfAsteroid() {
    let h, w, vx, vy, img;
    h = new Random(3).random();

    switch (h) {
        case 0:
            h = 40;
            w = 40;
            vx = -5;
            vy = 5;
            img = asteroidImg;
            break;

        case 1:
            h = 30;
            w = 30;
            vx = -8;
            vy = 8;
            img = asteroidImg;
            break;

        case 2:
            h = 100;
            w = 100;
            vx = -3;
            vy = 2;
            img = asteroidImg;
            break;

        case 3:
            h = 50;
            w = 50;
            vx = -4;
            vy = 9;
            img = asteroidImg;
            break;

        default:
            h = 50;
            w = 50;
            vx = -4;
            vy = 9;
            img = asteroidImg;
            break;
    }
    return [h, w, vx, vy, img];
}

function chackShotDamage() {
    allShots.forEach((oneShot) => {
        allEnemyAirplane.forEach((oneAirplane) => {
            if (
                oneShot.x + oneShot.w > oneAirplane.x &&
                oneShot.x < oneAirplane.x + oneAirplane.w &&
                oneShot.y + oneShot.h > oneAirplane.y &&
                oneShot.y < oneAirplane.y + oneAirplane.h
            ) {
                oneShot.hit(oneAirplane);
            }
        });
        allAlien.forEach((oneAlien) => {
            if (
                oneShot.x + oneShot.w > oneAlien.x &&
                oneShot.x < oneAlien.x + oneAlien.w &&
                oneShot.y + oneShot.h > oneAlien.y &&
                oneShot.y < oneAlien.y + oneAlien.h
            ) {
                oneShot.hit(oneAlien);
            }
        });
    });
}

function airplaneWarming() {
    if (airplane.warm >= airplane.maxWarm) {
        airplane.warming = true;
    } else if (airplane.warm <= 0) {
        airplane.warming = false;
    }
    if (airplane.shot === false && airplane.warm > 0) {
        airplane.cooling();
    }
}

function removeShot() {
    allShots = allShots.filter((oneShot) => {
        if (oneShot.damage === true || oneShot.x > screen.w) {
            return false;
        } else {
            return true;
        }
    });
}

function removeEnemyAirplane() {
    allEnemyAirplane = allEnemyAirplane.filter((oneAirplane) => {
        if (oneAirplane.life > 0) {
            return true;
        } else {
            makeNewAlien(oneAirplane);
            score++;
            explosionAudio.play();
            return false;
        }
    });
}

function makeNewAlien(oneAirplane) {
    let newAlien = new Alien(
        oneAirplane.x,
        oneAirplane.y,
        20,
        40,
        alienImg,
        40,
        (oneAirplane.vx * -1) / 2
    );
    allAlien.push(newAlien);
}

function removeAlien() {
    allAlien = allAlien.filter((oneAlien) => {
        if (
            backgroundImg === backgroundImgGround &&
            oneAlien.y + oneAlien.h >= screen.h - ground
        ) {
            return false;
        } else if (
            backgroundImg === backgroundImgSpace &&
            oneAlien.y > screen.h
        ) {
            return false;
        } else if (oneAlien.life <= 0) {
            if (oneAlien.realized === false) {
                oneAlien.get();
            }
            return false;
        } else {
            return true;
        }
    });
}

function removeAsteroid() {
    allAsteroid = allAsteroid.filter((oneAsteroid) => {
        if (
            oneAsteroid.x + oneAsteroid.w < 0 ||
            oneAsteroid.y - oneAsteroid.h > screen.h
        ) {
            return false;
        } else {
            return true;
        }
    });
}

function doSpecialAlien() {
    let value = chooseSpeciel();
    switch (value) {
        case "score":
            score += 3;
            break;

        case "strong":
            shotStrong = -4;
            widthShot = 10;
            specialOn.strong = true;
            setTimeout(() => {
                specialOn.strong = false;
                shotStrong = -1;
                widthShot = 4;
            }, 6000);
            break;

        case "distroy airplane":
            for (let i = 0; i < 2; i++) {
                if (allEnemyAirplane.length > 0) {
                    allEnemyAirplane.shift();
                    score++;
                }
            }
            break;

        case "warm slow":
            airplane.maxWarm = 400;
            airplane.warm = 0;
            specialOn.slowWorm = true;
            setTimeout(() => {
                specialOn.slowWorm = false;
                airplane.maxWarm = 150;
                airplane.warm = 0;
            }, 7000);
            break;

        case "lots of airplanes":
            let lastNumberOfAirplanes = numberOfAirplanes;
            numberOfAirplanes = 10;
            specialOn.lotsOfAirplanes = true;
            setTimeout(() => {
                specialOn.lotsOfAirplanes = false;
                numberOfAirplanes = lastNumberOfAirplanes;
            }, 7000);
            break;

        case "big spaceship":
            allEnemyAirplane.push(
                new EnemyAirplane(
                    screen.w,
                    new Random(screen.h - ground - 250).random(),
                    450,
                    250,
                    -0.5,
                    2000,
                    anotherEnemyAirplaneImg
                )
            );
            break;

        case "+5 score":
            score += 5;
            break;

        case "fly fast":
            airplane.Vup = -12;
            airplane.Vdown = 8;
            specialOn.fastFlight = true;
            setTimeout(() => {
                airplane.Vup = -6;
                airplane.Vdown = 4;
                specialOn.fastFlight = false;
            }, 4000);
            break;

        case "very big score":
            score += 7;
            break;
    }

    clearSpecialTitle();
}

function chooseSpeciel() {
    let type = new Random(8).random();
    clearTimeout(timeOut.specialTitle);
    switch (type) {
        case 0:
            type = "score";
            specialTitle = "+3";
            break;

        case 1:
            if (specialOn.strong === false) {
                type = "strong";
                specialTitle = "strong shots";
                break;
            }

        case 2:
            type = "distroy airplane";
            specialTitle = "extermination";
            break;

        case 3:
            if (specialOn.slowWorm === false) {
                type = "warm slow";
                specialTitle = "slow warming";
                break;
            }

        case 4:
            if (specialOn.lotsOfAirplanes === false) {
                type = "lots of airplanes";
                specialTitle = "Spaceships";
                break;
            }

        case 5:
            type = "big spaceship";
            specialTitle = "big spaceship";
            break;

        case 6:
            type = "+5 score";
            specialTitle = "+5";
            break;

        case 7:
            if (specialOn.fastFlight === false) {
                type = "fly fast";
                specialTitle = "fast flight";
                break;
            }

        default:
            type = "very big score";
            specialTitle = "+7";
            break;
    }
    return type;
}

function clearSpecialTitle() {
    timeOut.specialTitle = setTimeout(() => {
        specialTitle = "";
    }, 2000);
}

function updateAirplane() {
    airplane.updateLocation();
}

function updateEnemyAirplane() {
    allEnemyAirplane.forEach((oneAirplane) => {
        oneAirplane.updateLocation();
    });
}

function updateShot() {
    allShots.forEach((oneShot) => {
        oneShot.updateLocation();
    });
}

function updateAlien() {
    allAlien.forEach((oneAlien) => {
        oneAlien.updateLocation();
    });
}

function updateAsteroid() {
    allAsteroid.forEach((oneAsteroid) => {
        oneAsteroid.updateLocation();
    });
}

function level() {
    if (time - lastTime >= 10000) {
        numberOfAirplanes++;
        lastTime = time;
    }
}

function changeBackground() {
    if (backgroundImg === backgroundImgGround && airplane.y < 0) {
        airplane.y = screen.h - airplane.w;
        backgroundImg = backgroundImgSpace;
    } else if (
        backgroundImg === backgroundImgSpace &&
        airplane.y + airplane.w > screen.h
    ) {
        airplane.y = airplane.w;
        backgroundImg = backgroundImgGround;
    }
}

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, screen.w, screen.h);

    ctx.drawImage(backgroundImg, 0, 0, screen.w, screen.h);

    airplane.draw();

    ctx.fillStyle = "red";
    allShots.forEach((oneShot) => {
        oneShot.draw();
    });

    allEnemyAirplane.forEach((oneAirplane) => {
        oneAirplane.draw();
    });

    allAlien.forEach((oneAlien) => {
        oneAlien.draw();
    });

    if (backgroundImg === backgroundImgSpace) {
        allAsteroid.forEach((oneAsteroid) => {
            oneAsteroid.draw();
        });
    }

    //#region $text
    if (backgroundImg === backgroundImgGround) {
        ctx.fillStyle = "black";
    } else if (backgroundImg === backgroundImgSpace) {
        ctx.fillStyle = "white";
    }
    ctx.font = "40px Comic Sans MS";
    ctx.fillText(`score: ${score} | best score: ${myBestScore}`, 265, 50);

    ctx.fillStyle = "white";
    ctx.font = "20px Comic Sans MS";
    ctx.fillText("© Noam daniel lewin", 100, screen.h - 10);

    ctx.fillStyle = "rgb(0, 177, 24)";
    ctx.font = "70px Comic Sans MS";
    ctx.fillText(specialTitle, screen.w / 2, screen.h / 2 - 150);

    ctx.fillStyle = "goldenrod";
    ctx.textAlign = "center";
    ctx.font = "100px Comic Sans MS";
    ctx.fillText(startGameText, screen.w / 2, screen.h / 2);
    timeOut.startGameText = setTimeout(() => {
        startGameText = "";
    }, 3000);
    if (startGameText === "") {
        clearTimeout(timeOut.startGameText);
    }
    //#endregion

    ctx.fillStyle = "red";
    ctx.fillRect(screen.w / 2 - airplane.maxWarm / 2, 10, airplane.warm, 15);
    ctx.beginPath();
    ctx.moveTo(screen.w / 2 - airplane.maxWarm / 2, 30);
    ctx.lineTo(airplane.maxWarm + screen.w / 2 - airplane.maxWarm / 2, 30);
    ctx.stroke();
}

function chackLose() {
    for (oneAirplane of allEnemyAirplane) {
        if (
            oneAirplane.x <= 0 ||
            (oneAirplane.x < airplane.x + airplane.w &&
                oneAirplane.x + oneAirplane.w > airplane.x &&
                oneAirplane.y < airplane.y + airplane.h &&
                oneAirplane.y + oneAirplane.h > airplane.y)
        ) {
            return true;
        }
    }

    for (oneAsteroid of allAsteroid) {
        if (
            oneAsteroid.x < airplane.x + airplane.w &&
            oneAsteroid.x + oneAsteroid.w > airplane.x &&
            oneAsteroid.y + oneAsteroid.h > airplane.y &&
            oneAsteroid.y < airplane.y + airplane.h &&
            backgroundImg === backgroundImgSpace
        ) {
            return true;
        }
    }

    if (
        airplane.y + airplane.h > screen.h - ground &&
        backgroundImg === backgroundImgGround
    ) {
        return true;
    }
    return false;
}

function endGame() {
    bestScore();
    endGameAudio.play();

    //#region $end game text
    ctx.fillStyle = "goldenrod";
    ctx.textAlign = "center";
    ctx.font = "100px Comic Sans MS";
    ctx.fillText(
        `game over | score: ${score}`,
        screen.w / 2,
        screen.h / 2 - 50
    );
    ctx.textAlign = "center";
    ctx.font = "75px Comic Sans MS";
    ctx.fillText(`press enter to start`, screen.w / 2, screen.h / 2 + 50);
    //#endregion

    document.addEventListener("keydown", (event) => {
        if (event.keyCode === 13 && gameOn === false) {
            setUpGame();
        }
    });
}

function bestScore() {
    myBestScore = parseInt(myBestScore);
    if (!myBestScore) {
        localStorage.setItem("bestScoreToJangGame", score);
    } else if (score > myBestScore) {
        myBestScore = score;
        localStorage.setItem("bestScoreToJangGame", score);
    }
}
