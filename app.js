// Define Variables
const gridHeight = 500;
const gridWidth = 600;
const blockWidth = 75;
const blockHeight = 20;
const racketWidth = 100;
const racketHeight = 20;
const racketInitialX = gridWidth / 2 - racketWidth / 2;
const racketInitialY = gridHeight - racketHeight;
const racketMove = 25;
const ballDiameter = 20;
let numBlockRow = 5;
const ballInitialX = gridWidth / 2 - ballDiameter / 2;
const ballInitialY = gridHeight - racketHeight - ballDiameter;
const racketInitialPosition = [racketInitialX, racketInitialY];
let racketPosition = racketInitialPosition;
const ballInitialPosition = [ballInitialX, ballInitialY];
let ballPosition = ballInitialPosition;
let initialScore = 0;
let xMovement = 2;
let yMovement = 2;
let coveredArea;
let blocks;
// // Dynamic variables
let grid = document.querySelector(".grid");
let startButton = document.getElementById("start-button");
let againButton = document.getElementById("play-again");
let msg = document.getElementById("msg");
let score = document.getElementById("score");
const racket = document.createElement("div");
const ball = document.createElement("div");

againButton.style.display = "none";

function drawRacket() {
  racket.classList.add("racket");
  racketPosition = [...racketInitialPosition];
  racket.style.left = racketPosition[0] + "px";
  racket.style.top = racketPosition[1] + "px";
  grid.appendChild(racket);
}
drawRacket();

function moveRacket(e) {
  if (e.key === "ArrowLeft" && racketPosition[0] > 0) {
    racket.style.left = racketPosition[0] - racketMove + "px";
    racketPosition[0] = racketPosition[0] - racketMove;
  }
  if (e.key === "ArrowRight" && racketPosition[0] < 500) {
    racket.style.left = racketPosition[0] + racketMove + "px";
    racketPosition[0] = racketPosition[0] + racketMove;
  }
}

class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const block = document.createElement("div");
    block.classList.add("block");
    grid.appendChild(block);
    block.style.left = x + "px";
    block.style.top = y + "px";
    this.element = block;
  }
}

function drawBlock() {
  coveredArea = 0;
  blocks = [];

  //Draw blocks
  for (i = 0; i < numBlockRow; i++) {
    while (coveredArea < gridWidth) {
      blocks.push(new Block(coveredArea, blockHeight * i + 5 * i));
      coveredArea = coveredArea + blockWidth;
    }
    coveredArea = 0;
  }
}
drawBlock();

function drawBall() {
  ball.classList.add("ball");
  ballPosition = [...ballInitialPosition];
  ball.style.left = ballPosition[0] + "px";
  ball.style.top = ballPosition[1] + "px";
  ball.style.display = "";
  grid.appendChild(ball);
}
drawBall();

function moveBall() {
  manageGridCollision();
  manageRacketCollision();
  manageBlockCollision();

  ballPosition[0] += xMovement;
  ball.style.left = ballPosition[0] + "px";
  ballPosition[1] += yMovement;
  ball.style.top = ballPosition[1] + "px";
}
function manageGridCollision() {
  // Check for collision with right wall
  if (ballPosition[0] >= gridWidth - ballDiameter) {
    xMovement = -2;
  }
  // Check for collision with left wall
  if (ballPosition[0] <= 0) {
    xMovement = 2;
  }

  // Check for collision with ceiling
  if (ballPosition[1] <= 0) {
    yMovement = 2; // Bounce down
  }

  // Check for collision with floor (racket collision or game over)
  if (ballPosition[1] >= gridHeight - ballDiameter) {
    clearInterval(gameInterval); // Stop the game
    msg.style.color = "darkblue";
    msg.innerHTML = "You lost, game over &#128542";
    ball.style.display = "none";
    againButton.style.display = "";
    return;
  }
}
function manageRacketCollision() {
  if (
    ballPosition[0] + ballDiameter >= racketPosition[0] &&
    ballPosition[0] <= racketPosition[0] + racketWidth &&
    ballPosition[1] <= racketPosition[1] + racketHeight &&
    ballPosition[1] + ballDiameter >= racketPosition[1]
  ) {
    yMovement = -2;
  }
}

function manageBlockCollision() {
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i];
    if (
      ballPosition[0] >= block.x &&
      ballPosition[0] <= block.x + blockWidth &&
      ballPosition[1] >= block.y &&
      ballPosition[1] <= block.y + blockHeight
    ) {
      yMovement = -yMovement;
      initialScore++;
      score.textContent = initialScore;
      block.element.remove();

      blocks.splice(i, 1);

      if (blocks.length === 0) {
        clearInterval(gameInterval); // Stop the game
        msg.style.color = "goldenrod";
        msg.innerHTML = "You won, well done! &#128513";
        ball.style.display = "none";
        againButton.style.display = "";
      }
      break;
    }
  }
}

function gameStartReset() {
  // Reset ball position
  drawBall();
  // Reset racket position
  drawRacket();

  // Clear the grid first
  grid.innerHTML = "";
  grid.appendChild(racket);
  grid.appendChild(ball);

  drawBlock();

  // Reset score
  initialScore = 0;
  score.textContent = initialScore;

  // Reset message
  msg.style.color = "red";
  msg.innerHTML = "Let's gooo! &#128170";

  // Hide buttons
  startButton.style.display = "none";
  againButton.style.display = "none";

  // Restart the game loop
  gameInterval = setInterval(moveBall, 10);
}

// Event listeners
document.addEventListener("keydown", moveRacket);
startButton.addEventListener("click", gameStartReset);
againButton.addEventListener("click", gameStartReset);
