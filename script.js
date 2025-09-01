//inspired by : frank laboratory

/*add custom game font*/
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;

//variables
let userScore = 0;
let gameFrame = 0;
let gameSpeed = 1;
let gameOver = false;
ctx.font = "70px 'VT323'";

//gives the element position coordinates which can be used if user wants to
//keep the starting positon of coordinates to be , the elements starting
let canvasPos = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};

//mouse movements
canvas.addEventListener("mousedown", function (dets) {
  mouse.click = true;
  mouse.x = dets.x - canvasPos.left;
  mouse.y = dets.y - canvasPos.top;
});
canvas.addEventListener("mouseup", function () {
  mouse.click = false;
});

//fish in left & right direction
const player1 = new Image();
player1.src = "assets/cartoon_fish_06_purple_swim.png";
const player2 = new Image();
player2.src = "assets/cartoon_fish_06_purple_swim_02.png";
//fish movements
class Player {
  //objecting
  constructor() {
    (this.x = canvas.width), (this.y = canvas.height / 2);
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }
  //movement
  update() {
    const distX = this.x - mouse.x;
    const distY = this.y - mouse.y;
    let deg = Math.atan2(distY, distX);
    this.angle = deg;
    if (mouse.x != this.x) this.x -= distX / 20;
    if (mouse.y != this.y) this.y -= distY / 20;
  }
  //visual
  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillRect(this.x, this.y, this.radius, 10);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    if (this.x >= mouse.x) {
      ctx.drawImage(
        player1,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 62,
        0 - 62,
        this.spriteWidth / 4,
        this.spriteHeight / 3
      );
    } else {
      ctx.drawImage(
        player2,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 62,
        0 - 62,
        this.spriteWidth / 4,
        this.spriteHeight / 3
      );
    }
    ctx.restore();
  }
}
const player = new Player();

//bubbles
const bubblesArr = [];
const bubbleImg = new Image();
bubbleImg.src = "assets/bubble_pop_frame_01.png";

class Bubble {
  constructor(type) {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
    this.type = type;
  }
  update() {
    this.y -= this.speed;
    const distX = this.x - player.x;
    const distY = this.y - player.y;
    this.distance = Math.sqrt(distX * distX + distY * distY);
  }
  draw() {
    // ctx.fillStyle = "blue";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.stroke();

    ctx.drawImage(
      bubbleImg,
      this.x - 65,
      this.y - 65,
      this.radius * 2.5,
      this.radius * 2.5
    );
if (this.type !== null && this.type !== undefined) {
    ctx.fillStyle = "white";
    ctx.font = `${this.radius * 0.6}px VT323`; // scale text size with bubble
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; 
    ctx.fillText(this.type, this.x, this.y);
}
  }
}

//popping sound
const bubble1 = document.createElement("audio");
bubble1.src = "assets/bubble1.ogg";
const bubble2 = document.createElement("audio");
bubble2.src = "assets/bubble2.wav";
const openoverlaySound = document.createElement("audio");
openoverlaySound.src = "assets/PageTurning.wav";
const incomeoverlaySound = document.createElement("audio");
incomeoverlaySound.src = "assets/overlayDisplay.wav";
const closeoverlaySound = document.createElement("audio");
closeoverlaySound.src = "assets/paperClose.wav";

function handleBubbles() {
  if (gameFrame % 50 === 0) {
    let type = null; // default bubble

    if (Math.random() < 0.3) { 
      const types = ["About", "Skills", "Projects", "📞", "Resume"];
      type = types[Math.floor(Math.random() * types.length)];
    }

    bubblesArr.push(new Bubble(type));
  }
  for (let i = 0; i < bubblesArr.length; i++) {
    bubblesArr[i].update();
    bubblesArr[i].draw();
    if (bubblesArr[i].y < 0 - bubblesArr[i].radius * 2) {
      bubblesArr.splice(i, 1);
      i--;
    } else if (bubblesArr[i].distance < bubblesArr[i].radius + player.radius) {
      if (!bubblesArr[i].counted) {
        if(bubblesArr[i].type){
            openOverlay(bubblesArr[i].type);
            incomeoverlaySound.play();
            handleGameOver();
        }
        else{
            (bubblesArr[i].sound == "sound1" ? bubble1.play() : bubble2.play());
            userScore++;
        }
        bubblesArr[i].counted = true;
        bubblesArr.splice(i, 1);
        i--;
      }
    }
  }
}

const overLayContentMap = {
    "About" : `Hi! I’m Priyanka Kharwar! <br>
    Based in New Delhi, India <br>
    CSE undergrad @ DTU (Batch of ’26) <br><br>
    Fluent in: Googling, <br>
    Speedrunning Chatgpt & Scarcasm <br>
    When not coding, you’ll find me <br>
    strumming my electric guitar <br>
    and occasionally mastering<br>
    the art of doing absolutely nothing. 🛋️`
,

    "Skills": `I like to bring websites to life,<br> 
    hence honing my skills of frontend <br> 
    development , which include: <br>
     [HTML, CSS,JAVASCRIPT,REACT,NEXT.js, <br>
    Tad bit of VUE.js, GSAP, FRAMER MOTION] ,<br> 
    though i have explored backend as well :<br>
    [MONGO, MONGOOSE, NODEjs, EXPRESS]. <br>
    My core programming language is C++. <br>


    <a href="https://leetcode.com/u/Prieyyankaa/" target="_blank">Leetcode</a><br>
    <a href="https://www.codechef.com/users/sedge_sage_11" target="_blank">Codechef</a><br>`,

    "Projects" :`Some of the projects are : <br>
    menstural tracker & community : <a href="https://cyclewisee.vercel.app/" target="_blank"></a><br> <br>
    Gamified Portfolio : <a href="https://priyankakharwar.vercel.app/" target="_blank"></a> <br>
    Miniproject Gallery : live link <br>
    Vocabulary Bilder : live link <br>
    `, 
    "📞" : `Commit, push, pray <br>
      Or just say hey :p <br>
      Reach out at:<br>
      <a href="https://github.com/priiikrrrr" target="_blank"> GitHub</a><br>
      <a href="https://linkedin.com/in/yourusername" target="_blank"> LinkedIn</a><br>
      <a href="https://instagram.com/yourusername" target="_blank"> Instagram</a>`,
    "Resume": "Here’s my resume! <a href='resume.pdf' target='_blank'>Download</a>."

}

function openOverlay(type){
    const overlay = document.getElementById("overlay");
    const scrollImg = document.getElementById("scroll");
    const textBox = document.getElementById("scrollText");

    textBox.innerHTML = "";
    overlay.classList.remove("hidden");

    scrollImg.src = "assets/scroll_bottom.svg";
    
    setTimeout(()=>{
        scrollImg.src = "assets/paper_repeating_narrow.svg";
        openoverlaySound.play();
        const content = overLayContentMap[type] || "No content available.";
        typeWrite(textBox, content);
    },1600);
    
    overlay.onclick = () => {
        closeoverlaySound.play();
        overlay.classList.add("hidden");
        textBox.innerHTML = "";
    }
}

// typewritter effect
function typeWrite(el, text) {
  el.innerHTML = "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = text;
  const fullHTML = tempDiv.innerHTML;
   let i = 0;
  let interval = setInterval(() => {
    el.innerHTML = fullHTML.slice(0, i);
    i++;
    if (i > fullHTML.length) clearInterval(interval);
  }, 25);
}

//continual background
const bg = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

const bgm = new Image();
bgm.src = "assets/background1.png";

function handleBg() {
  bg.x1 -= gameSpeed;
  if (bg.x1 < -bg.width) bg.x1 = bg.width;
  bg.x2 -= gameSpeed;
  if (bg.x2 < -bg.width) bg.x2 = bg.width;
  ctx.drawImage(bgm, bg.x1, bg.y, bg.width, bg.height);
  ctx.drawImage(bgm, bg.x2, bg.y, bg.width, bg.height);
}

//edge case to stop the game
const enemyImage = new Image();
enemyImage.src = "assets/enemyfish01.png";

class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * (canvas.height - 150) + 90;
    this.radius = 60;
    this.speed = Math.random() * 2 + 2;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 418;
    this.spriteHeight = 397;
  }
  draw() {
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    ctx.drawImage(
      enemyImage,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 60,
      this.y - 60,
      this.spriteWidth / 3,
      this.spriteHeight / 3
    );
  }
  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
    }
    if (gameFrame % 5 == 0) {
      this.frame++;
      if (this.frame >= 12) this.frame = 0;
      if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }
    //collision
    const distX = this.x - player.x;
    const distY = this.y - player.y;
    const distance = Math.sqrt(distX * distX + distY * distY);
    if (distance < this.radius + player.radius) {
      handleGameOver();
    }
  }
}
const enemy1 = new Enemy();
function handlene() {
  enemy1.update();
  enemy1.draw();
}

//handing game over on enemy collision
function handleGameOver() {
  (ctx.fillStyle = "gold"), (ctx.font = "170px 'VT323'");
  ctx.fillText("GAME OVER : " + userScore, 480, 350);
  gameOver = true;
}

//final function to work on it all
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBg();
  handleBubbles();
  player.update();
  player.draw();
  handlene();
  const fontSize = canvas.width * 0.05;
  ctx.font = `${fontSize}px 'VT323'`;
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score : " + userScore, 20, 20);
  gameFrame++;
  // console.log(gameFrame)
  if (!gameOver) requestAnimationFrame(animate);
}
animate();

//resizing  for variac screens so, the mouse works fine
window.addEventListener("resize", function () {
  canvasPos = canvas.getBoundingClientRect();
});
