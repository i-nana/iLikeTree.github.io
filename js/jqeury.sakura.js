/*
SAKURA

http://jsdo.it/event/q/vol2

※Google Chrome の最新版で動作する事が条件になります。
*/
var SAKURA_COUNT = 400;
var IMAGE_URL = 'images/sakura.png';
var canvas = document.getElementById('world');
var _ctx = canvas.getContext('2d');
var _cnt = 0;
var CANVAS_WIDTH = 3000;
var CANVAS_HEIGHT =  2000;
var CANVAS_HALF_WIDTH = CANVAS_WIDTH / 2;
var IMG_SIZE = 8;
var _img = new Image();
_img.src = IMAGE_URL;
_img.onload = play;
var _sakuras = [];
var windRoots = [];

function setup() {
  addSakura();
  canvas.addEventListener('mousemove', function(e) {
    windRoots.push({x: e.clientX, y:e.clientY, rest:0});
  });
}

setup();

function draw(data){
  ++_cnt;
  //if (_cnt > 10)
  //  return;

  _ctx.clearRect(0,0, CANVAS_WIDTH+1,CANVAS_HEIGHT+1);

  var len = _sakuras.length;
  for (var i=0; i < len; ++i) {
    fall(_sakuras[i]);
  }
  drawSakuras();
  //drawWind();
 // changeWind();
}

/*function drawWind() {
  var len = windRoots.length;
  for (var i=0; i < len; ++i) {
    var w = this;
    _ctx.beginPath();
    _ctx.strokeStyle = "rgb(0, 0, 0)";
    _ctx.moveTo(w.x, w.y);
    _ctx.lineTo(w.x + 1, w.y);
    _ctx.closePath();
    _ctx.stroke();
  };
}*/

function getKyori(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getNearWindRoot(sakura) {
  var len = windRoots.length;
  var wind = null;
  var kyoriMin = 100;
  for (var i=0; i < len; ++i) {
    var w = windRoots[i];
    var kyori = getKyori(w.x, w.y, sakura.x, sakura.y);
    if (kyori < kyoriMin) {
      wind = w;
      kyoriMin = kyori;
    }
  }
  return wind;
}

/*function changeWind() {
  for (var i=0; i < windRoots.length; ++i) {
    windRoots[i].rest -= 1;
    if (windRoots[i].rest < 0) {
      windRoots.splice(i, 1);
      i -= 1
    }
  }
}*/

function fall(sakura) {
  sakura.rotationX += sakura.rotationVx + Math.random() * 5; 
  sakura.rotationY += sakura.rotationVy + Math.random() * 5;
  sakura.rotationZ += sakura.rotationVz + Math.random() * 5;
  var vx = sakura.vx + 1 * Math.abs(Math.sin(sakura.rotationZ * Math.PI / 180));
  var vy = sakura.vy + 1 * Math.abs(Math.cos(sakura.rotationX * Math.PI / 180));
  var vz = sakura.vz + 1 * Math.abs(Math.sin(sakura.rotationY * Math.PI / 180));

  var w = getNearWindRoot(sakura);
  if (w) {
    var kyori = getKyori(w.x, w.y, sakura.x, sakura.y);
    if (kyori <= 0) {
      vx += 3;
    } else {
      vx += (sakura.x - w.x) / kyori * (500 - sakura.z + 200) * 0.005 * Math.min(w.rest / 10, 1);
      vy += (sakura.y - w.y) / kyori * (500 - sakura.z + 200) * 0.005 * Math.min(w.rest / 10, 1);
    }
  }

  sakura.x += vx;
  sakura.y += vy;
  sakura.z -= vz;
  if(sakura.x > 500) {
    sakura.x = 0;
  }
  if(sakura.y > 500) {
    sakura.y = -100;
  }
  if(sakura.z < 0) {
    sakura.z = 500;
  }

  var scale = 1 / Math.max(sakura.z / 200, 0.001);
  sakura.scaleX = sakura.scaleY = scale;
}

function drawLight(s, alpha, dispX, dispY) {
  _ctx.translate(dispX, dispY);
  _ctx.scale(s.scaleX, s.scaleY);
  _ctx.rotate(s.rotationZ * Math.PI / 180);
  _ctx.transform(1, 0, 0, Math.sin(s.rotationX * Math.PI / 180), 0, 0);
  _ctx.translate(-dispX, -dispY);
  _ctx.globalAlpha = alpha * 0.2;
  _ctx.fillStyle = "rgb(255, 255, 255)";
  _ctx.beginPath();
  _ctx.arc(dispX, dispY, 7, 0, Math.PI * 2, true);
  _ctx.arc(dispX, dispY, 6, 0, Math.PI * 2, true);
  _ctx.arc(dispX, dispY, 5, 0, Math.PI * 2, true);
  _ctx.fill();
  _ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawSakuras() {
  var len = _sakuras.length;
  for (var i=0; i < len; ++i) {
    var s = _sakuras[i];
    var dispX = (s.x - 250) / Math.max(s.z / 200, 0.001) * 500 / 200 + 1000;
    var dispY = (s.y - 250) / Math.max(s.z / 200, 0.001) * 500 / 200 + 250;

    _ctx.translate(dispX, dispY);
    _ctx.scale(s.scaleX, s.scaleY);
    _ctx.rotate(s.rotationZ * Math.PI / 180);
    _ctx.transform(1, 0, 0, Math.sin(s.rotationX * Math.PI / 180), 0, 0);
    _ctx.translate(-dispX, -dispY);

    _ctx.globalAlpha = Math.min(1, (500 - s.z) / 50);
    _ctx.drawImage(_img, dispX - IMG_SIZE / 2, dispY - IMG_SIZE / 2, IMG_SIZE, IMG_SIZE);
    _ctx.globalAlpha = 1;

    _ctx.setTransform(1, 0, 0, 1, 0, 0);

  }
}

function addSakura() {
  for (var i=0; i < SAKURA_COUNT; ++i) {
    var sakura = {};
    sakura.scaleX = sakura.scaleY = Math.random() * 1.2 + 0.3;
    sakura.rotationX = Math.random() * 360;
    sakura.rotationY = Math.random() * 360;
    sakura.rotationZ = Math.random() * 360;
    sakura.x = Math.random() * 500;
    sakura.y = Math.random() * 500 - 500;
    sakura.z = Math.random() * 500;

    sakura.vx = 0.3 + 0.2 * Math.random();
    sakura.vy = 0.0 + 0.5 * Math.random();
    sakura.vz = 0.3 + 0.2 * Math.random();

    sakura.rotationVx = 7 - 10 * Math.random();
    sakura.rotationVy = 7 - 10 * Math.random();
    sakura.rotationVz = 7 - 10 * Math.random();

    sakura.getAlpha = function() {
      return 1;
    }
    _sakuras.push(sakura);
  }
}


function play(){

  setInterval(function(){
    draw();
  }, 1000 / 60);
}
