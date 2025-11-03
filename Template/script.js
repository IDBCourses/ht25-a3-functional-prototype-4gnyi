/*
* Code Playground – Keyboard Controlled Player (A–Z)
* Agnes Nilsson
*/

// State variables are the parts of your program that change over time.
// CHANGING VARIABLES
let playerX = 100; // starting position on x-axis
let playerY = 80; // starting position on y-axis
let hasEscaped = false; // checks if player has reached the black hole
const keysPressed = {}; // Track which key is pressed. values inside of objects {} can still change. why const?
let player, blackhole, message, stars = []; // will hold references to html-elements
let playerSize = 40; // player's current size

// Settings variables should contain all of the "fixed" parts of your programs
// NOT CHANGING VARIABLES
const speed = 4; // how many pixels per frame the player is moved 
const topRow = ["q","w","e","r","t","y","u","i","o","p"]; // Keyboard layout rows
const middleLeft = ["a","s","d","f","g"]; // Keyboard layout rows
const middleRight = ["h","j","k","l"]; // Keyboard layout rows
const bottomRow = ["z","x","c","v","b","n","m"]; // Keyboard layout rows

// Code that runs over and over again
// MAIN LOOP
// a.
function loop() {
  if (!player || !blackhole || !message) { // checks if elements exists
    window.requestAnimationFrame(loop); // keep loop running even if elements are not ready yet. still a bit unclear?
    return;
  } 

  // Determine potential next position and sets a local/temporary variable to hold it
  // Not changing players position before we know if it collides with something
  // b.
  let nextX = playerX; // creates a new variables called nextX and gives it the current value of playerX
  let nextY = playerY; // creates a new variables called nextY and gives it the current value of playerY

  // Determines direction based on pressed keys
  // c.
  for (const key in keysPressed) {
    if (!keysPressed[key]) continue; // skip released keys
    const k = key.toLowerCase();

    if (topRow.includes(k)) nextY -= speed;          // forward (up)
    else if (bottomRow.includes(k)) nextY += speed;  // backward (down)
    else if (middleLeft.includes(k)) nextX -= speed; // left
    else if (middleRight.includes(k)) nextX += speed; // right
  }

  // Make sure we stay inside the .space area
  // d.
  const spaceRect = document.querySelector(".space").getBoundingClientRect(); // gives size and position of .space from html and css
  const playerRect = player.getBoundingClientRect(); // Checks collision with walls of .space and adjust position to not go past the walls
  if (nextX < 0) nextX = 0;
  if (nextY < 0) nextY = 0;
  if (nextX + playerRect.width > spaceRect.width)
    nextX = spaceRect.width - playerRect.width;
  if (nextY + playerRect.height > spaceRect.height)
    nextY = spaceRect.height - playerRect.height;

  // Check and update shrink status
  checkShrink();

  // Calling for the star collision
  const collides = checkStarCollision(nextX, nextY);
  if (!collides) { // move if not colliding
    playerX = nextX;
    playerY = nextY;
  }

  // Apply new position
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";

  // Calling for the blackhole-collision 
  checkEscape(player, blackhole, message);

  // Loop again
  window.requestAnimationFrame(loop);
}

//* FUNCTION FOR CHECKING AND UPDATING SHRINK STATUS *//
function checkShrink() {
  let pressedCount = 0;

  // Count how many keys are currently pressed
  for (const key in keysPressed) {
    if (keysPressed[key]) {
      pressedCount++;
    }
  }

  // Shrink if at least 2 keys are pressed simultaneously
  if (pressedCount >= 2) {
    playerSize = 20; // Small size
  } else {
    playerSize = 40; // Normal size
  }

  // Apply the size
  player.style.width = playerSize + "px";
  player.style.height = playerSize + "px";
}

//* FUNCTION FOR CHECKING STAR COLLISION *//
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
      return true; // stop players movement on collision
    }
  }

  return false; // no collision and keep moving
}

//* FUNCTION FOR BLACKHOLE COLLISION CHECK *//
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
    player.style.backgroundColor = "black";
  }
}

//* SETUP FUNCTION *//
// Setup is run once, at the start of the program
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