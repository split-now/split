/* Yolo */

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

$(function() {
  drawRect();
});

function drawRect() {
  var canvas = document.getElementById('receipt');
  var ctx = canvas.getContext('2d');
  var drag = false;
  var imageObj;
  var rect = { };
  var touch;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  function init() {
    imageObj = new Image();

    imageObj.src = 'img.jpg';
    imageObj.onload = function() {
      ctx.drawImage(imageObj, 0, 0);
    };

    canvas.addEventListener('touchstart', handleTouch, false);
    canvas.addEventListener('touchmove', handleTouch, false);
    canvas.addEventListener('touchleave', handleEnd, false);
    canvas.addEventListener('touchend', handleEnd, false);
  }

  function handleTouch(event) {
    if (event.targetTouches.length === 1) {
      touch = event.targetTouches[0];

      if (event.type == 'touchmove') {
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
    ctx.fillStyle = 'rgba(0, 100, 255, 0.2)';
    ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
  } // We can stick a callback here for image processing

  function drawImageOnCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageObj, 0, 0);
  }

  init();
}
