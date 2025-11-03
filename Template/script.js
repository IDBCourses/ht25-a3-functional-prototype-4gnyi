/*
* Code Playground – Keyboard Controlled Player (A–Z)
* Agnes Nilsson
*/

// State variables are the parts of your program that change over time.
let playerX = 100; // starting position
let playerY = 80;
let speed = 4;
let hasEscaped = false;

let player, blackhole, message, stars = [];

// Settings variables should contain all of the "fixed" parts of your programs
// Track which key is pressed
const keysPressed = {};

// Keyboard layout rows
const topRow = ["q","w","e","r","t","y","u","i","o","p"];
const middleLeft = ["a","s","d","f","g"];
const middleRight = ["h","j","k","l"];
const bottomRow = ["z","x","c","v","b","n","m"];

// Code that runs over and over again
// MAIN LOOP
function loop() {
  if (!player || !blackhole || !message) {
    // keep loop running even if elements are not ready yet
    window.requestAnimationFrame(loop);
    return;
  }

  // Determine potential next position
  let nextX = playerX;
  let nextY = playerY;

  // Determine direction based on pressed keys
  for (const key in keysPressed) {
    if (!keysPressed[key]) continue; // skip released keys
    const k = key.toLowerCase();

    if (topRow.includes(k)) nextY -= speed;          // forward (up)
    else if (bottomRow.includes(k)) nextY += speed;  // backward (down)
    else if (middleLeft.includes(k)) nextX -= speed; // left
    else if (middleRight.includes(k)) nextX += speed; // right
  }

  // Stay inside the .space area
  const spaceRect = document.querySelector(".space").getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();

  if (nextX < 0) nextX = 0;
  if (nextY < 0) nextY = 0;
  if (nextX + playerRect.width > spaceRect.width)
    nextX = spaceRect.width - playerRect.width;
  if (nextY + playerRect.height > spaceRect.height)
    nextY = spaceRect.height - playerRect.height;

  // Checks for star-collision
  const collides = checkStarCollision(nextX, nextY);
  if (!collides) {
    // Only move if not colliding
    playerX = nextX;
    playerY = nextY;
  }

  // Apply new position
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";

  // Check collision with black hole
  checkEscape(player, blackhole, message);

  // Loop again
  window.requestAnimationFrame(loop);
}

// CHECK STAR COLLISIONS
function checkStarCollision(nextX, nextY) {
  const playerRect = player.getBoundingClientRect();
  const newRect = {
    left: nextX,
    right: nextX + playerRect.width,
    top: nextY,
    bottom: nextY + playerRect.height
  };

  for (const star of stars) {
    const starRect = star.getBoundingClientRect();

    const overlaps =
      newRect.right > starRect.left &&
      newRect.left < starRect.right &&
      newRect.bottom > starRect.top &&
      newRect.top < starRect.bottom;

    if (overlaps) {
      return true; // stop movement on collision
    }
  }

  return false; // no collision
}

// COLLISION CHECK
function checkEscape(player, blackhole, message) {
  if (hasEscaped) return;

  const playerRect = player.getBoundingClientRect();
  const holeRect = blackhole.getBoundingClientRect();

  const isInside =
    playerRect.left >= holeRect.left &&
    playerRect.right <= holeRect.right &&
    playerRect.top >= holeRect.top &&
    playerRect.bottom <= holeRect.bottom;

  if (isInside) {
    hasEscaped = true;
    message.style.display = "block";
    message.textContent = "YOU MADE IT!";
    player.style.backgroundColor = "limegreen";
  }
}

// SETUP
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  player = document.querySelector("#player0");
  blackhole = document.querySelector("#blackhole0");
  message = document.querySelector("#message0");
  stars = document.querySelectorAll('[id^="star"]'); // selects star0 to star8

  message.style.display = "none";

  // Keyboard listeners
  document.addEventListener("keydown", (e) => {
    if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
      keysPressed[e.key.toLowerCase()] = true;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
      keysPressed[e.key.toLowerCase()] = false;
    }
  });

  // Start animation loop
  window.requestAnimationFrame(loop);
}

// START PROGRAM
setup();