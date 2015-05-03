/* Yolo */

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var imgArr = [];

$(function() {
  var canvas = document.getElementById('receipt');
  var ctx = canvas.getContext('2d');
  var drag = false;
  var imgObj;
  var rect = { };
  var touch;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  function init() {
    imgObj = new Image();
    imgObj.src = 'img.jpg';
    imgObj.onload = function() {
      ctx.drawImage(imgObj, 0, 0);
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
    saveRegion(imgObj);
  }

  function draw() {
    drawImageOnCanvas();
    ctx.strokeStyle = 'green';
    ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
    ctx.fillStyle = 'rgba(0, 100, 255, 0.1)';
    ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
  }

  function drawImageOnCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgObj, 0, 0);
  }

  function saveRegion(img) {
    var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");

    canvas.width = rect.w;
    canvas.height = rect.h;
    ctx.drawImage(img, rect.startX, rect.startY, rect.w, rect.h, 0, 0, rect.w, rect.h);

    imgArr.push(canvas.toDataURL());
    console.log(imgArr);
  }

  init();
});
