// 테트리스 블록 레이싱 게임 (JavaScript 버전)
const canvas = document.createElement("canvas");
canvas.width = 700; // 화면 너비
canvas.height = 600; // 화면 높이
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

const BLOCK_SIZE = 20; // 블록 크기
const FPS = 60; // 초당 프레임 수
const colors = ["red", "green", "blue"]; // 블록 색상
const yellow = "rgb(255, 255, 0)"; // 배경색
const tetrisShapes = [
  [ [0, 0], [1, 0], [2, 0], [3, 0] ], // I 블록
  [ [0, 0], [0, 1], [1, 0], [1, 1] ], // O 블록
  [ [1, 0], [0, 1], [1, 1], [2, 1] ], // T 블록
  [ [0, 0], [1, 0], [1, 1], [2, 1] ], // Z 블록
  [ [1, 0], [2, 0], [0, 1], [1, 1] ]  // S 블록
];

// 유틸리티 함수
function getRandomShape() {
  return tetrisShapes[Math.floor(Math.random() * tetrisShapes.length)];
}
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// 플레이어 클래스
class Player {
  constructor() {
    this.x = canvas.width / 2 - 40;
    this.y = canvas.height - 80;
    this.shape = getRandomShape();
    this.color = "blue";
    this.speed = 5;
    this.timer = 0;
  }
  draw() {
    this.shape.forEach(([dx, dy]) => {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x + dx * BLOCK_SIZE, this.y + dy * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    });
  }
  move(keys) {
    if (keys["ArrowLeft"] && this.x > 0) this.x -= this.speed;
    if (keys["ArrowRight"] && this.x < canvas.width - BLOCK_SIZE * 4) this.x += this.speed;
    this.timer++;
    if (this.timer >= FPS * 3) {
      this.shape = getRandomShape();
      this.timer = 0;
    }
  }
}

// 적 클래스
class Enemy {
  constructor() {
    this.x = Math.random() * (canvas.width - BLOCK_SIZE * 4);
    this.y = -80;
    this.shape = getRandomShape();
    this.color = getRandomColor();
    this.speed = Math.random() * 3 + 3;
  }
  draw() {
    this.shape.forEach(([dx, dy]) => {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x + dx * BLOCK_SIZE, this.y + dy * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    });
  }
  move() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = -80;
      this.x = Math.random() * (canvas.width - BLOCK_SIZE * 4);
      this.shape = getRandomShape();
      this.speed = Math.random() * 3 + 3;
    }
  }
}

// 게임 변수
let player = new Player();
let enemies = Array.from({ length: 8 }, () => new Enemy());
let score = 0;
let keys = {};

// 키 입력 감지
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// 충돌 검사 함수
function checkCollision() {
  for (let enemy of enemies) {
    for (let [px, py] of player.shape) {
      const playerX = player.x + px * BLOCK_SIZE;
      const playerY = player.y + py * BLOCK_SIZE;
      for (let [ex, ey] of enemy.shape) {
        const enemyX = enemy.x + ex * BLOCK_SIZE;
        const enemyY = enemy.y + ey * BLOCK_SIZE;
        if (Math.abs(playerX - enemyX) < BLOCK_SIZE && Math.abs(playerY - enemyY) < BLOCK_SIZE) {
          if (JSON.stringify(player.shape) === JSON.stringify(enemy.shape)) {
            enemies = enemies.filter((e) => e !== enemy);
            score += 10;
          } else {
            alert("Game Over");
            resetGame();
          }
        }
      }
    }
  }
}

// 게임 리셋 함수
function resetGame() {
  player = new Player();
  enemies = Array.from({ length: 8 }, () => new Enemy());
  score = 0;
}

// 메인 게임 루프
function gameLoop() {
  ctx.fillStyle = yellow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.move(keys);
  player.draw();

  enemies.forEach((enemy) => {
    enemy.move();
    enemy.draw();
  });

  checkCollision();

  // 점수 표시
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);

  // 적 블록이 모두 제거되면 게임 종료
  if (enemies.length === 0) {
    alert("Game Over");
    resetGame();
  }

  requestAnimationFrame(gameLoop);
}

// 게임 시작
gameLoop();
