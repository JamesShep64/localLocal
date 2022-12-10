
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
import {Block} from "./block";
import Vector from "./2Dvector";
import {blockCollision} from "./blockCollision";
import {PlayerObject} from "./playerObject";
import {PirateShip} from "./pirateShip";
import {blockShipCollision} from "./blockShipCollision";
import {trapDoorCollision} from "./trapDoorCollision";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.save();
var rDown = false;
var colliding = false;
var color;
var lineWidth;

var player = new PlayerObject(0,'1',window.innerWidth/2-300,window.innerHeight/2-250,25,25);
var ship = new PirateShip(window.innerWidth/2,window.innerHeight/2,'gallion');
var block = new Block(0,window.innerWidth/2,window.innerHeight/2 -200,100,100);
player.turnGravity(false);

window.addEventListener('keydown',keysDown);
window.addEventListener('keyup',keysUp);
context.save();
function keysDown(e){
    if(e.key == 'q'){
      player.rotate(.1);
    }
    if(e.key == 'z'){
      ship.trapDoor.opening = true;
    }

    if(e.key == 'x'){
      ship.trapDoor.closing = true;
    }

    if(e.key == 'r'){
      player.netVelocity.x = 0; player.netVelocity.y = 0;
    }

    if(e.key == 'w'){
      player.handlePress('w');
    }

    if(e.key == 'a'){
      player.handlePress('a');

    }

    if(e.key == 's'){
      player.handlePress('s');

    }

    if(e.key == 'd'){
      player.handlePress('d');
    }

    if(e.key == 'u'){
      ship.rotate(-.01);
    }

    if(e.key == 'i'){
      ship.rotate(.01);
    }
}

function keysUp(e){
  if(e.key == 'r'){
    rDown = false;
  }
  if(e.key == 'w'){
    player.handleRelease('w');
  }

  if(e.key == 'a'){
    player.handleRelease('a');

  }

  if(e.key == 's'){
    player.handleRelease('s');

  }

  if(e.key == 'd'){
    player.handleRelease('d');

  }
}

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

//draw polu
function drawPoly(block, me,x,y){
  if(!x){
    var canvasX = canvas.width / 2 + block.pos.x - me.pos.x;
    var canvasY = canvas.height / 2 + block.pos.y - me.pos.y;
  }
  else{
    var canvasX = canvas.width / 2 + x - me.pos.x;
    var canvasY = canvas.height / 2 + y - me.pos.y;
  }
    context.restore();
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    var o;
    context.beginPath();
    for(var i = 0; i<block.points.length; i++){
      o = i + 1;
      if(o == block.points.length){
        o = 0;
      }
      context.moveTo(canvasX + block.points[i].x, canvasY + block.points[i].y);
      context.lineTo(canvasX + block.points[o].x, canvasY + block.points[o].y);
    }
    context.stroke();
  }
  function drawTrapDoor(block, me){
      var canvasX = canvas.width / 2 + block.pos.x - me.pos.x;
      var canvasY = canvas.height / 2 + block.pos.y - me.pos.y;
      context.restore();
      context.lineWidth = lineWidth;
      context.strokeStyle = color;
      var o;
      context.beginPath();
      for(var i = 0; i<block.points.length; i++){
        o = i + 1;
        if(o == block.points.length){
          o = 0;
        }
        if(i != 3){
          if(!(i == 1 && (block.isClosed || block.isOpen))){
            context.moveTo(canvasX + block.points[i].x, canvasY + block.points[i].y);
            context.lineTo(canvasX + block.points[o].x, canvasY + block.points[o].y);
          }
        }
      }
      context.stroke();
    }
//60 ticks per second
setInterval(draw,1000/60);

function draw(){
  setCanvasDimensions();
  context.clearRect(0,0,window.innerWidth,window.innerHeight);
  player.update(60/1000);
  ship.trapDoor.update(60/1000);
  var {push,vec2, i,happened} = blockShipCollision(player,ship);
  if(happened){
    color = 'red';
    player.displace.add(push);
  }

  var happened = trapDoorCollision(player,ship.platform);
    if(happened){  
      var {push, vec2} = happened;
      player.displace.add(push);
    }

  var happened = trapDoorCollision(player,ship.trapDoor);
  if(happened){
    var {push} = happened;
    player.displace.add(push);
  }
  player.updateDisplace();
  drawPoly(player,player);
  drawPoly(ship,player);
  drawPoly(ship.ladder,player);
  drawPoly(ship.mast,player);
  drawPoly(ship.platform,player);

  drawTrapDoor(ship.trapDoor,player);
  for(var i = 0; i<ship.points.length; i++){
    var zero1 = new Vector(ship.collisionZeros[i].x + ship.pos.x,ship.collisionZeros[i].y + ship.pos.y);
    var vec1 = new Vector(ship.points[i].x - ship.collisionZeros[i].x, ship.points[i].y -ship.collisionZeros[i].y);
    const endX = canvas.width / 2 + zero1.x + vec1.x - player.pos.x;
    const endY = canvas.height / 2 + zero1.y + vec1.y - player.pos.y;
    const startX = canvas.width / 2 + zero1.x - player.pos.x;
    const startY = canvas.height / 2 + zero1.y - player.pos.y;
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX,endY);
    context.stroke();
  }

  for(var i = 0; i<ship.platform.points.length; i++){
    if(ship.platform.collisionZeros[i] != 'a'){  
      var zero1 = new Vector(ship.platform.collisionZeros[i].x + ship.pos.x,ship.platform.collisionZeros[i].y + ship.pos.y);
      var vec1 = new Vector(ship.platform.points[i].x - ship.platform.collisionZeros[i].x, ship.platform.points[i].y -ship.platform.collisionZeros[i].y);
      const endX = canvas.width / 2 + zero1.x + vec1.x - player.pos.x;
      const endY = canvas.height / 2 + zero1.y + vec1.y - player.pos.y;
      const startX = canvas.width / 2 + zero1.x - player.pos.x;
      const startY = canvas.height / 2 + zero1.y - player.pos.y;
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(endX,endY);
      context.stroke();
    }
  }

  for(var i = 0; i<ship.trapDoor.points.length; i++){
    if(ship.trapDoor[i] != 'a'){  
      var zero1 = new Vector(ship.trapDoor.collisionZeros[i].x + ship.trapDoor.pos.x,ship.trapDoor.collisionZeros[i].y + ship.trapDoor.pos.y);
      var vec1 = new Vector(ship.trapDoor.points[i].x - ship.trapDoor.collisionZeros[i].x, ship.trapDoor.points[i].y -ship.trapDoor.collisionZeros[i].y);
      const endX = canvas.width / 2 + zero1.x + vec1.x - player.pos.x;
      const endY = canvas.height / 2 + zero1.y + vec1.y - player.pos.y;
      const startX = canvas.width / 2 + zero1.x - player.pos.x;
      const startY = canvas.height / 2 + zero1.y - player.pos.y;
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(endX,endY);
      context.stroke();
    }
  }

}
