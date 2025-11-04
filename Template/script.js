/*
* Code Playground – StarMaze
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
const topRow = ["q","w","e","r","t","y","u","i","o","p"]; // Keys moving up
const middleLeft = ["a","s","d","f","g"]; // Keys moving left
const middleRight = ["h","j","k","l"]; // Keys moving right
const bottomRow = ["z","x","c","v","b","n","m"]; // Keys moving down

// Code that runs over and over again
// MAIN LOOP
function loop() {
  if (!player || !blackhole || !message) { // checks if elements exists
    window.requestAnimationFrame(loop); // keep loop running even if elements are not ready yet
    return;
  } 

  // Determine potential next position and sets a local/temporary variable to hold it
  // Not changing players position before we know if it collides with something
  let nextX = playerX; // creates a new variables called nextX and gives it the current value of playerX
  let nextY = playerY; // creates a new variables called nextY and gives it the current value of playerY

  // Determines direction based on pressed keys
  // c.
  for (const key in keysPressed) {
    if (!keysPressed[key]) continue; // skip released keys
    const k = key.toLowerCase();

    if (topRow.includes(k)) nextY -= speed; // forward (up)
    else if (bottomRow.includes(k)) nextY += speed;   // backward (down)
    else if (middleLeft.includes(k)) nextX -= speed;  // left
    else if (middleRight.includes(k)) nextX += speed; // right
  }

  // Make sure we stay inside the .space area
  const spaceRect = document.querySelector(".space").getBoundingClientRect(); // gets the size and position of the game area (.space) where the player can move
  const playerRect = player.getBoundingClientRect(); // gets size and location of player. Checks collision with walls of .space and adjust position to not go past the walls
  if (nextX < 0) nextX = 0; // Check if the next X position goes past the left edge
  if (nextY < 0) nextY = 0; // Check if the next Y position goes past the top edge
  if (nextX + playerRect.width > spaceRect.width)
    nextX = spaceRect.width - playerRect.width; // Check if the next X position goes past the right edge
  if (nextY + playerRect.height > spaceRect.height)
    nextY = spaceRect.height - playerRect.height; // Check if the next Y position goes past the bottom edge

  // Calling for CheckShrink function. Checks and updates shrink status
  checkShrink(); 

  // Calling for the star collision. Checks and updates star collision
  const collides = checkStarCollision(nextX, nextY); // Checks if the player collides with stars at next position
  if (!collides) { 
    playerX = nextX;
    playerY = nextY;
  } // Moves the player if there is no collision

  // Apply new position
  player.style.left = playerX + "px"; // Moves the player horizontally on the screen (left or right)
  player.style.top = playerY + "px"; // Moves the player vertically on the screen (up or down)

  // Calling for the blackhole-collision 
  checkEscape(player, blackhole, message);

  // Loop again
  window.requestAnimationFrame(loop); // Calling the loop function again to update the game on the next frame (keeps the game smooth)
}

//* FUNCTION FOR CHECKING AND UPDATING SHRINK STATUS *//
function checkShrink() {
  let pressedCount = 0; //* Create a variable to count how many keys are currently pressed *//

  // Count how many keys are currently pressed
  for (const key in keysPressed) {
    if (keysPressed[key]) { // Checks if the current key is being pressed
      pressedCount++; // If it is then add 1 to pressedCount
    }
  }

  // Shrink if at least 2 keys are pressed simultaneously
  if (pressedCount >= 2) { // If 2 or more keys are pressed at the same time
    playerSize = 20; // Shrink the player (20px)
  } else { // If fewer than 2 keys are pressed
    playerSize = 40; // keep player as normal size (40px)
  }

  // Apply the size
  player.style.width = playerSize + "px"; // Set the width of the player (in px)
  player.style.height = playerSize + "px"; // Set the height of the player (in px)
}

//* FUNCTION FOR CHECKING STAR COLLISION *//
function checkStarCollision(nextX, nextY) { 
  const playerRect = player.getBoundingClientRect(); // Get the current size and position of the player element on the screen
  const newRect = { // Make a box around where the player would be if it moves
    left: nextX, // Left side of the player
    right: nextX + playerRect.width, // Right side of the player
    top: nextY, // Top side of the player
    bottom: nextY + playerRect.height // Bottom side of the player
  };

  for (const star of stars) { // Check each star in the game
    const starRect = star.getBoundingClientRect(); // Get the size and position of this star

    const overlaps = // Check if the players box touches the box of the star
      newRect.right > starRect.left && // Players right is past stars left
      newRect.left < starRect.right && // Players left is before stars right
      newRect.bottom > starRect.top && // Players bottom is below stars top
      newRect.top < starRect.bottom; // Players top is above stars bottom

    if (overlaps) { // If the boxes touch there is a collision
      return true; // Stop player from moving
    }
  }

  return false; // If no collision then keep moving
}

//* FUNCTION FOR BLACKHOLE COLLISION CHECK *//
function checkEscape(player, blackhole, message) {
  if (hasEscaped) return; // If the player has already escaped, stop checking

  const playerRect = player.getBoundingClientRect(); // Get position and size of player
  const holeRect = blackhole.getBoundingClientRect(); // Get position and size of blackhoel

  const isInside = // Checks if the player is inside of the blackhole
    playerRect.left >= holeRect.left && // Players left side is past black holes left
    playerRect.right <= holeRect.right && // Players right side is past black holes right
    playerRect.top >= holeRect.top && // Players top is below black holes top
    playerRect.bottom <= holeRect.bottom; // Players bottom is above black holes bottom

  if (isInside) { // If the player is inside the black hole
    hasEscaped = true; // Mark that the player has escaped
    message.style.display = "block";  // Show the message element
    message.textContent = "YOU MADE IT!"; // Show the message text "YOU MADE IT!"
    player.style.backgroundColor = "black"; // Change the players color to black
  }
}

//* SETUP FUNCTION *//
// Setup is run once, at the start of the program
function setup() {
  player = document.querySelector("#player0"); // Get the player element from the HTML and put it in the 'player' variable
  blackhole = document.querySelector("#blackhole0"); // Get the black hole element from the HTML and put it in 'blackhole' variable
  message = document.querySelector("#message0"); // Get the message element from the HTML and put it in 'message' variable
  stars = document.querySelectorAll('[id^="star"]'); // Get all the stars (star0, star1, etc.) and put them in the 'stars' variable

  message.style.display = "none"; // Hide the message at the start of the game 

  // Keyboard listeners
  document.addEventListener("keydown", (e) => { // Add a listener for when a key is pressed down
    if (e.key.length === 1 && e.key.match(/[a-z]/i)) { // Check if the key is a letter (a-z)
      keysPressed[e.key.toLowerCase()] = true; // Mark this key as pressed in the keysPressed object
    }
  });

  document.addEventListener("keyup", (e) => { // Add a listener for when a key is released
    if (e.key.length === 1 && e.key.match(/[a-z]/i)) { // Check if the key is a letter (a-z) 
      keysPressed[e.key.toLowerCase()] = false; // Mark this key as released in the keysPressed object
    }
  });

  // Start animation loop
  window.requestAnimationFrame(loop); // Start the game loop (animations, collisions, player move)
}

// START PROGRAM
setup(); 