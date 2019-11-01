const forestSound = new Audio("./sound/sound-forest.mp3");
forestSound.play();
forestSound.loop = true;
const rulesBtn = document.querySelector("#rules");
const goBackBtn = document.querySelector("#goback");
class Thought {
  constructor(name, points, selector) {
    this.name = name;
    this.vx = 1;
    this.points = points;
    this.selector = document.querySelector(`.${selector}`);
    this.position = this.selector.getBoundingClientRect();
  }
} 

const goodThought = new Thought("Good Thought", +2, "good-thought-1");
goodThought.position.x = 900;
const goodThought2 = new Thought("Good Thought", +2, "good-thought-2");
goodThought2.position.x = 1400;

const draw = timestamp => {
  moveGoodThought(goodThought);
  updateGoodThought();
  moveGoodThought2(goodThought2);
  updateGoodThought2();
  requestAnimationFrame(draw);
};
requestAnimationFrame(draw);

function updateGoodThought() {
  moveGoodThought(goodThought);
}
function moveGoodThought(goodthought) {
  if (goodthought.position.x < -900) {
    goodthought.position.x = 900;
  }
  goodthought.position.x -= goodThought.vx;
  goodthought.selector.style.transform = `translateX(${goodthought.position.x}px`;
}
function updateGoodThought2() {
  moveGoodThought(goodThought2);
}
function moveGoodThought2(goodthought) {
  if (goodthought.position.x < -900) {
    goodthought.position.x = 900;
  }
  goodthought.position.x -= 0.5;
  goodthought.selector.style.transform = `translateX(${goodthought.position.x}px`;
}

function displayPopUp() {
  document.querySelector(".instructions").style.display = "block";
}
function closePopUp() {
  document.querySelector(".instructions").style.display = "none";
}
rulesBtn.onclick = displayPopUp;
goBackBtn.onclick = closePopUp;
