const keyState = {};
const musicBtn = document.querySelector("#music-button");
const soundIcon = document.querySelector(".sound-music");
const audioBackground = document.querySelector(".background-music");
const updateScore = document.querySelector("#update");
const messagePopUp = document.querySelector("#message-box");
const bodyElement = document.querySelector("body");
const titleElement = document.querySelector("#title");
const restartGameBtn = document.querySelector(".playagain");

const audioObject = new Audio("./Game/sound/collect-good.wav");
const audioObjectGrunt = new Audio("./Game/sound/grunt-sound.wav");
const gongStart = new Audio("./Game/sound/chinese-gong.mp3");
const audioObjectSuperCollect = new Audio(
  "./Game/sound/collect-super-good.ogg"
);
const forestAmbiant = new Audio("./Game/sound/sound-forest.mp3");

gongStart.play();
forestAmbiant.play();
audioBackground.play();
forestAmbiant.loop = true;

//Function activateMusic
function activateMusic() {
  soundIcon.classList.toggle("on");
  soundIcon.classList.toggle("off");
  if (soundIcon.classList.contains("on")) {
    audioBackground.play();
  } else {
    audioBackground.autoplay = false;
    audioBackground.pause();
  }
}
// CLASS CREATION FOR MY CHARACTER & DIFFERENT OBJECTS
class Thought {
  constructor(name, points, selector) {
    this.name = name;
    this.vx = 2;
    this.points = points;
    this.selector = document.querySelector(`.${selector}`);
    this.position = this.selector.getBoundingClientRect();
    this.crash = 0;
  }
}

class Character {
  constructor() {
    this.points = 10;
    this.mood = ["terrible", "sad", "fine", "super happy"];
    this.isMoving = false;
    this.x = 0;
    this.y = 0;
    this.element = document.getElementById("character");
    this.position = this.element.getBoundingClientRect();
    this.isAirbourne = false;
  }
  collectThought(thought) {
    this.points += thought.points;
    scoreUpdate();
    if (thought.points > 0) {
      messagePopUp.innerHTML = `<div id="message-box" class ="bounce-top">A ${thought.name}! +${thought.points} points !</div><br>`;
      setTimeout(function() {
        messagePopUp.textContent = "";
      }, 2500);
    } else if (thought.points < 0) {
      messagePopUp.innerHTML = `<div id="message-box" class ="bounce-top">Oh.. a ${thought.name}.. ${thought.points} points !</div><br>`;
      setTimeout(function() {
        messagePopUp.textContent = "";
      }, 2500);
    }
  }
  stopMoving() {
    this.element.style.animation = "none";
  }

  movePlayer(direction) {
    this.element.style.animation = `animate 0.8s steps(7) infinite`;
    if (direction === "right" && this.x < 1230) {
      this.x += 5;
      this.element.className = `character-right`;
      this.element.style.transform = `translate(${this.x}px, ${this.y})`;
      return;
    } else if (direction === "left" && this.x > -1) {
      this.x -= 5;
      this.element.className = `character-left`;
      this.element.style.transform = `translate(${this.x}px, ${-this.y})`;
    }
  }
  jump() {
    let limit = 0;
    if (!this.isAirbourne) {
      this.isAirbourne = true;
      let intervalId = setInterval(() => {
        if (limit > 30) {
          this.fall();
          clearInterval(intervalId);
        }
        this.y += 10;
        this.element.style.transform = `translate(${this.x}px, ${-this.y}px `;
        limit++;
      }, 10);
    }
  }
  fall() {
    let intervalId = setInterval(() => {
      if (this.y === 0) {
        this.isAirbourne = false;
        clearInterval(intervalId);
        return;
      }
      this.y -= 20;
      this.element.style.transform = `translate(${this.x}px, ${-this.y}px)`;
    }, 20);
  }
}
// FUNCTION END GAME TO VERIFY THE GAME STATUS
function checkEndGame() {
  console.log(sickCharacter.points);
  if (sickCharacter.points <= 0) {
    document.querySelector(".lost").style.display = "block";
    return true;
  } else if (sickCharacter.points >= 100) {
    console.log("iamhere in the");
    document.querySelector(".win").style.display = "block";
    return true;
  } else return false;
}

// Object SETUP
var sickCharacter = new Character();
const badThought = new Thought("Bad Thought", -5, "bad-thought");
badThought.position.x = 1500;
const goodThought = new Thought("Good Thought", +4, "good-thought");
goodThought.position.x = 2100;
const superGoodThought = new Thought(
  "Super Good Thought",
  +8,
  "super-good-thought"
);
superGoodThought.position.x = 5000;

// KEYBOARD SETUP
window.onkeydown = function(e) {
  sickCharacter.isMoving = true;
  keyState[e.code] = true;
};
window.onkeyup = function(e) {
  sickCharacter.isMoving = false;
  keyState[e.code] = false;
};

// DRAW FUNCTION TO UPDATE MY CHARACTERS & OBJECTS
const draw = timestamp => {
  sickCharacter.position = sickCharacter.element.getBoundingClientRect();
  //update badThought Object
  moveBadThought(badThought);
  updateBadThought();

  moveGoodThought(goodThought);
  updateGoodThought();

  moveSuperGoodThought(superGoodThought);
  updateSuperGoodThought();

  //Detect a collision and end game status
  if (
    detectCollision(badThought, sickCharacter) &&
    badThought.crash === 0 &&
    sickCharacter.points > 0 &&
    sickCharacter.points < 100
  ) {
    soundCollectGrunt();
    sickCharacter.collectThought(badThought);
    badThought.crash += 1;
    sickCharacter.element.animate(
      [
        {
          opacity: 1
        },
        {
          opacity: 0
        },
        {
          opacity: 1
        }
      ],
      { duration: 300, easing: "ease-in", iterations: 5 }
    );
    checkEndGame();
  }
  if (
    detectCollision(goodThought, sickCharacter) &&
    goodThought.crash === 0 &&
    sickCharacter.points < 100 &&
    sickCharacter.points > 0
  ) {
    console.log("hehe");
    sickCharacter.collectThought(goodThought);
    goodThought.selector.style.display = "none";
    soundCollect();
    goodThought.crash += 1;
    checkEndGame();
  }
  if (
    detectCollision(superGoodThought, sickCharacter) &&
    superGoodThought.crash === 0 &&
    sickCharacter.points < 100 &&
    sickCharacter.points > 0
  ) {
    sickCharacter.collectThought(superGoodThought);
    superGoodThought.selector.style.display = "none";
    soundSuperCollect();
    superGoodThought.crash += 1;
    checkEndGame();
  }
  //Keyboard movement
  if (keyState["Space"]) sickCharacter.jump();
  if (keyState["ArrowRight"]) sickCharacter.movePlayer("right");
  if (keyState["ArrowLeft"]) sickCharacter.movePlayer("left");
  if (!sickCharacter.isMoving) sickCharacter.stopMoving();
  requestAnimationFrame(draw);
};

function startGame() {
  requestAnimationFrame(draw);
}

// PAUSE CANCEL ANIMATION FRAME

startGame();

// Function to detect collision
function detectCollision(a, b) {
  const posA = a.selector.getBoundingClientRect();
  const posB = b.element.getBoundingClientRect();
  var result = false;
  if (
    posA.x < posB.x + posB.width &&
    posA.x + posA.width > posB.x &&
    posA.y < posB.y + posB.height &&
    posA.y + posA.height > posB.y
  ) {
    result = true;
    return result;
  }
}

//Update my object movement
function updateBadThought() {
  moveBadThought(badThought);
}
function moveBadThought(badthought) {
  if (badthought.position.x < -600) {
    badthought.position.x = 1500;
    badthought.crash = 0;
  }
  badthought.position.x -= badThought.vx;
  badthought.selector.style.transform = `translateX(${badthought.position.x}px`;
}

function updateGoodThought() {
  moveGoodThought(goodThought);
}
function moveGoodThought(goodthought) {
  if (goodthought.position.x < -600) {
    goodthought.position.x = 1500;
    goodThought.selector.style.display = "block";
    goodthought.crash = 0;
  }
  goodthought.position.x -= goodThought.vx;
  goodthought.selector.style.transform = `translateX(${goodthought.position.x}px`;
}

function updateSuperGoodThought() {
  moveSuperGoodThought(superGoodThought);
}
function moveSuperGoodThought(supergoodthought) {
  if (supergoodthought.position.x < -600) {
    supergoodthought.position.x = 1500;
    superGoodThought.selector.style.display = "block";
    supergoodthought.crash = 0;
  }
  supergoodthought.position.x -= superGoodThought.vx;
  supergoodthought.selector.style.transform = `translateX(${supergoodthought.position.x}px`;
}

// Score update function
function scoreUpdate() {
  updateScore.style.width = `${sickCharacter.points}%`;
  titleElement.textContent = `Happiness status (${sickCharacter.points}%)`;
  if (sickCharacter.points <= 0) {
    titleElement.textContent = `Happiness status (0%)`;
    updateScore.style.width = `0%`;
  } else if (sickCharacter.points >= 100) {
    titleElement.textContent = `Happiness status (100%)`;
    updateScore.style.width = `100%`;
  }
  if (sickCharacter.points < 20) {
    bodyElement.className = `background-body-1`;
  } else if (sickCharacter.points < 30) {
    bodyElement.className = `background-body-2`;
  } else if (sickCharacter.points < 40) {
    bodyElement.className = `background-body-3`;
  } else if (sickCharacter.points < 50) {
    bodyElement.className = `background-body-4`;
  } else if (sickCharacter.points < 60) {
    bodyElement.className = `background-body-5`;
  } else if (sickCharacter.points < 70) {
    bodyElement.className = `background-body-6`;
  } else if (sickCharacter.points < 80) {
    bodyElement.className = `background-body-7`;
  } else if (sickCharacter.points < 90) {
    bodyElement.className = `background-body-8`;
  }
}
// Function sound collect
function soundCollect() {
  audioObject.play();
}
function soundCollectGrunt() {
  audioObjectGrunt.play();
}
function soundSuperCollect() {
  audioObjectSuperCollect.play();
}
// Button Music
musicBtn.onclick = activateMusic;

//restart-game-button

function restartTheGame() {
  document.location.reload();
}
restartGameBtn.onclick = restartTheGame;
