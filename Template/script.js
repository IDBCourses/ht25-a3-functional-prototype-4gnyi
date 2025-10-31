/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";

// State variables are the parts of your program that change over time.
var treeText;
var ironText;
var goldText;

var treeAmount = 0;
var ironAmount = 0;
var goldAmount = 0; 
// Settings variables should contain all of the "fixed" parts of your programs
const treeClick = 1;
const ironClick = 1/10;
const goldClick = 1/20;

function render() {
  treeText.innerText = "wood: " + Math.round(100*treeAmount)/100;
  ironText.innerText = "iron: " + Math.round(100*ironAmount)/100;
  goldText.innerText = "gold: " + Math.round(100*goldAmount)/100;
}
// Code that runs over and over again
function loop() {
  render();
  window.requestAnimationFrame(loop);
}

// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  treeText = document.getElementById("treeText");
  ironText = document.getElementById("ironText");
  goldText = document.getElementById("goldText");
  
  document.addEventListener("keydown", e => {
    if (e.repeat) return;
    if (e.code == "KeyT") treeAmount += treeClick;
    if (e.code == "KeyI") ironAmount += ironClick;
    if (e.code == "KeyG") goldAmount += goldClick;
  });

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!
