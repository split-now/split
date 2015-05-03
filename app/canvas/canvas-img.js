/* Yolo */

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

$(function() {
  drawRect();
});

function drawRect() {
  var canvas = document.getElementById('receipt');
  var ctx = canvas.getContext('2d');
  var rect = { };
  var drag = false;
  var touch;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  function init() {
    canvas.addEventListener("touchstart", handleTouch, false);
    canvas.addEventListener("touchmove", handleTouch, false);
    canvas.addEventListener("touchleave", handleEnd, false);
    canvas.addEventListener("touchend", handleEnd, false);
  }

  function handleTouch(event) {
    if (event.targetTouches.length === 1) {
      touch = event.targetTouches[0];

      if (event.type == "touchmove") {
        if (drag) {
          rect.w = touch.pageX - rect.startX;
          rect.h = touch.pageY - rect.startY ;
          draw();
        }
      } else {
        rect.startX = touch.pageX;
        rect.startY = touch.pageY;
        drag = true;
      }
    }
  }

  function handleEnd(event) {
    drag = false;
  }

  function draw() {
    drawImageOnCanvas();
    ctx.fillStyle = "rgba(0, 100, 255, 0.2)";
    ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
  }

  function drawImageOnCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //canvas.drawImage(imgPhoto,0,0,imgClientWidth,imgClientHeight);
  }

  init();
}
