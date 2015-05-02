/* Yolo */

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var canvas;
var con;
var cx;
var cy;
var tap = false; // on tap, initially false

$(function() {
      canvassetup();
});

function canvassetup() {
    canvas = document.getElementById('receipt');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchleave", handleEnd, false);
    el.addEventListener("touchmove", handleMove, false);
    con = canvas.getContext('2d');
}

function handleStart(e) {
    cx = e.pageX;
    cy = e.pageY;
    tap = true;
}

function handleMove(e) {

}

function handleEnd(e) {
    tap = false;
}
