const main = document.getElementById("main");
const game1 = document.getElementById("game1");
const shooter = document.getElementById("Shooter");
const back = document.getElementById("back");
const portal1 = document.getElementById("portal1");
const rick = new Image();
rick.src = "./res/img/Rick2.png";
const bomb = new Image();
bomb.src = "./res/img/RickBomb2.png";
let score2 = 0;
const plac = new Image();
plac.src = "./res/img/plac.png";

const dodge = document.getElementById("dodge");
const portal2 = document.getElementById("portal2");
const game2 = document.getElementById("game2");
const back2 = document.getElementById("back2");

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.height = window.innerHeight;
collisionCanvas.width = window.innerWidth;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let score = 0;
ctx.font = "50px Impact";

let ravens = [];
class Raven {
  constructor() {
    this.spriteWidth = 250;
    this.spriteHeight = 314;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * canvas.height - this.height;
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = "./res/img/strileni1.png";
    this.frame = 0;
    this.maxFrame = 2;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 10 + 10;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColors[0] +
      "," +
      this.randomColors[1] +
      "," +
      this.randomColors[2] +
      ")";
  }

  uptade(deltatime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    this.x -= this.directionX;
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    this.timeSinceFlap += deltatime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
    }
  }

  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

function drawScore() {
  ctx.fillStyle = "Black";
  ctx.fillText("Score: " + score, 50, 75);
  ctx.fillStyle = "White";
  ctx.fillText("Score: " + score, 55, 80);
}

window.addEventListener("click", function (e) {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  console.log(detectPixelColor);
  const pc = detectPixelColor.data;
  ravens.forEach((object) => {
    if (
      object.randomColors[0] === pc[0] &&
      object.randomColors[1] === pc[1] &&
      object.randomColors[2] === pc[2]
    ) {
      object.markedForDeletion = true;
      score++;
    }
  });
});

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltatime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort(function (a, b) {
      return a.width - b.width;
    });
  }
  drawScore();
  [...ravens].forEach((object) => object.uptade());
  [...ravens].forEach((object) => object.draw());
  ravens = ravens.filter((object) => !object.markedForDeletion);

  requestAnimationFrame(animate);
}

animate(0);

game1.onclick = () => {
  document.body.style.backgroundImage = "url(./res/img/galacticfederation.png)";
  main.style.display = "none";
  shooter.style.display = "block";
};

portal1.onclick = () => {
  document.body.style.backgroundImage = "url(./res/img/galacticfederation.png)";
  main.style.display = "none";
  shooter.style.display = "block";
};

back.onclick = () => {
  document.body.style.backgroundImage = "none"
  document.body.style.backgroundColor = "burlywood";
  main.style.display = "block";
  shooter.style.display = "none";
};

game2.onclick = () => {
  document.body.style.backgroundColor =  "rgb(160, 187, 25)";
  main.style.display = "none";
  dodge.style.display = "block";
};

portal2.onclick = () => {
  document.body.style.backgroundColor = "rgb(160, 187, 25)";
  main.style.display = "none";
  dodge.style.display = "block";
};

back2.onclick = () => {
  document.body.style.backgroundColor = "burlywood";
  main.style.display = "block";
  dodge.style.display = "none";
};

const canvas2 = document.getElementById("canvas2");
const ctx1 = canvas2.getContext("2d");

let mouseX = canvas2.width / 1.5;

document.addEventListener(
  "mousemove",
  (event) => {
    mouseX = event.clientX;
  },
  false
);

const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

const resize = () => {
  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;
};

window.onload = () => {
  init();
  window.addEventListener("resize", resize, false);
};

const gameLoop = () => {
  ctx1.fillStyle = "rgb(160, 187, 25)";
  ctx1.fillRect(0, 0, canvas2.width, canvas2.height);
  collision();
  draw();

  window.requestAnimationFrame(gameLoop);
};

const init = () => {
  resize();
  spawnObjects(40);
  window.requestAnimationFrame(gameLoop);
};

const draw = () => {
  drawFace();
  player.draw();
  uptadeObjects();
};

const drawFace = () => {
  ctx1.fillStyle = "rgb(204, 138, 58)";
  ctx1.fillRect(0, canvas2.height - 150, canvas2.width, 150);
  ctx1.fillStyle = "rgb(0, 0, 0)";
  ctx1.font = "25px Apiral";
  ctx1.fillText(score2, canvas2.width / 2, canvas2.height - 75);
};

class Player {
  width = 70;
  height = 100;

  draw() {
    this.x = mouseX - this.width / 2;
    this.y = canvas2.height - 220;
    ctx1.drawImage(rick, this.x, this.y, this.width, this.height);
  }
}

let player = new Player();

class Object {
  width = 70;
  height = 80;
  constructor(x, y) {
    this.x = random(10, canvas2.width - this.width);
    this.y = 0;
    this.speedY = random(3, 6);
    let rN = random(0, 9);
    if (rN < 3) {
      this.isbomb = 1;
    } else {
      this.isbomb = 0;
    }
  }

  uptade() {
    if (this.isbomb) {
      ctx1.drawImage(bomb, this.x, this.y, this.width, this.height);
    } else {
      ctx1.drawImage(plac, this.x, this.y, this.width, this.height);
    }
    if (this.y > canvas2.height) {
      score2 -= 10;
      if (score2 < 0) {
        score2 = 0;
      }
      this.reset();
      return;
    }
    this.y += this.speedY;
  }

  reset() {
    this.x = random(10, canvas2.width - this.width);
    this.y = 0;
    this.speedY = random(3, 6);
    let rN = random(0, 9);
    if (rN < 3) {
      this.isbomb = 1;
    } else {
      this.isbomb = 0;
    }
  }
}

let objects = [];

const spawnObjects = (number) => {
  let i = 0;
  for (i; i < number; i++) {
    objects.push(new Object());
  }
};

const uptadeObjects = () => {
  objects.forEach((object) => {
    object.uptade();
  });
};

const collision = () => {
  objects.forEach((object) => {
    if (
      player.x < object.x + object.width &&
      player.x + player.width > object.x &&
      player.y < object.y + object.height &&
      player.y + player.height > object.y
    ) {
      if (object.isbomb) {
        score2 = 0;
      } else {
        score2 += 50;
      }
      object.reset();
    };
  });
};
