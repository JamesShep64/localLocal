const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
import {Block} from "./block";
import Vector from "./2Dvector";
import {blockCollision} from "./blockCollision";
import { PirateShip } from "./pirateShip";
import {PlayerObject} from "./playerObject";
import { blockBlockCollision} from "./blockBlockCollision";
import { blockShipCollision } from "./blockShipCollision";
import { Planet } from "./planet";
import { Cannon } from "./cannon";
import { CannonBall } from "./cannonBall";
import { CONSTANTS } from "./constants";
import { trapDoorCollision } from "./trapDoorCollision";
import {playerLadderCollision} from "./playerLadderCollision"

var color;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.save();
var rDown = false;
var player = new PlayerObject(0,'1',window.innerWidth/2-300,window.innerHeight/2-250,25,25);
var ship = new PirateShip(window.innerWidth/2-100,window.innerHeight/2-100,'gallion');
var blocks = {};
var blockID = 'a';
var lineWidth = 3;
var planets = [];
var mouseX;
var mouseY;
window.addEventListener('resize', setCanvasDimensions);
window.addEventListener('keydown',keysDown);
window.addEventListener('keyup',keysUp);
window.addEventListener('click',click);
window.addEventListener('mousemove',mousemove);
context.save();

function keysDown(e){
    if(e.key == 'q'){
      player.handlePress('q');        
    }

    if(e.key == 'w'){
      player.handlePress('w');        
    }

    if(e.key == 's'){
      player.handlePress('s');        
    }

    if(e.key == 'r'){
      rDown = rDown ? false : true;
    }
    if(e.key == 'e'){
      player.handlePress('e');
    }

    if(e.key == 'a'){
      player.handlePress('a');
    }

    if(e.key == 'p'){
      planets.push(new Planet(-canvas.width / 2 + mouseX + player.pos.x, -canvas.height / 2 + mouseY + player.pos.y));
    }

    if(e.key == 'd'){
      player.handlePress('d');

    }

    if(e.key == ' '){
      player.handlePress(' ');
    }

    if(e.key == 'i'){
      ship.rotate(.01);
    }

    if(e.key == 'u'){
      ship.rotate(-.01);
    }

    if(e.key == 'k'){
      player.handlePress('k');
    }

    if(e.key == 'z'){
      if(!ship.trapDoor.closing){
        ship.trapDoor.opening = true;
      }
    }

    if(e.key == 'x'){
      if(!ship.trapDoor.opening){
        ship.trapDoor.closing = true;
      }
    }
}

function keysUp(e){
  if(e.key == 'q'){
    player.isGrabing = false;
  }

    if(e.key == 'w'){
      player.handleRelease('w');

    } 

    if(e.key == 's'){
      player.handleRelease('s');

  }

    if(e.key == 'a'){
        player.handleRelease('a');

    }

    if(e.key == 'd'){
        player.handleRelease('d');
    }

    if(e.key == 'e'){
      player.handleRelease('e');
    }
}

function click(c){
  blocks[blockID] = new Block(blockID, -canvas.width / 2 + c.clientX + player.pos.x, -canvas.height / 2 + c.clientY + player.pos.y,15,15);
  blockID += 'a';
}

function mousemove(m){
  mouseX = m.clientX;
  mouseY = m.clientY;
}

function drawPoly(block, me,x,y){
  if(!x){
    var canvasX = canvas.width / 2 + block.pos.x - me.eyes.x;
    var canvasY = canvas.height / 2 + block.pos.y - me.eyes.y;
  }
  else{
    var canvasX = canvas.width / 2 + x - me.eyes.x;
    var canvasY = canvas.height / 2 + y - me.eyes.y;
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
    var canvasX = canvas.width / 2 + block.pos.x - me.eyes.x;
    var canvasY = canvas.height / 2 + block.pos.y - me.eyes.y;
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


function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

setInterval(draw,1000/60);
setCanvasDimensions();
function draw(){
//clear rect 
  context.clearRect(0,0,window.innerWidth,window.innerHeight);
  player.update(60/1000);    
  ship.update(60/1000);
  
  
  for(var i = 0; i < ship.cannonBalls.length; i++){
    ship.cannonBalls[i].update(60/1000);
  }

  Object.keys(blocks).forEach(id =>{
    blocks[id].update(60/1000);
  });

  //player block Collision
  Object.keys(blocks).forEach(id =>{
  if(blocks[id].holder != player){
    var happened = blockCollision(player,blocks[id]);
    if(happened){  
      color = 'red';
      var {push, vec2} = happened;
      if(vec2){
        player.setMove(vec2);
        player.applyFriction(blocks[id].netVelocity);
        player.rotateTo(blocks[id].direction);
        player.turnGravity(false);
        player.onTop = true;
        blocks[id].hasTop[player.id] = player;
      }
      else{
        delete blocks[id].hasTop[player.id];
        if(player.isGrabing && !player.isHolding){
          player.grab(blocks[id]);
        }
      }
      if(blocks[id].wasJustHeld){
        push.x *= -1;
        push.y *= -1;
        blocks[id].displace.add(push);
      }
      else{player.displace.add(push)};
    }
    else{
      blocks[id].wasJustHeld = false;
      color = 'black';
      delete blocks[id].hasTop[player.id];
    }
  }
});
  

  //player ship Collision
  var {push,vec2, i,happened} = blockShipCollision(player,ship);
  if(happened){  
    color = 'red';
    if(vec2){
      player.rotateTo(ship.direction);
      player.setMove(vec2);
      player.applyFriction(ship.netVelocity);
      player.turnGravity(false);
      ship.hasPlayers[player.id] = player; 
      player.isCol = true;
      }
      player.displace.add(push);

    }
      //push after collision
  else{
    player.turnGravity(true);
    player.isCol = false;
    color = 'black';
    delete ship.hasPlayers[player.id];
   }

  //player trap door Collision
  var happened = trapDoorCollision(player,ship.trapDoor);
  if(happened){
    var {push,vec2} = happened;
    if(vec2){
      player.rotateTo(ship.direction);
      player.setMove(vec2);
      player.applyFriction(ship.netVelocity);
      player.turnGravity(false);
      ship.hasPlayers[player.id] = player; 
      player.isCol = true;
      }
    player.displace.add(push);
  }

  //player platform Collision
  if(!player.movedOnLadder){
    var happened = trapDoorCollision(player,ship.platform);
    if(happened){  
      color = 'red';
      var {push, vec2} = happened;
      if(vec2){
        player.setMove(new Vector(ship.points[1].x - ship.points[0].x, ship.points[1].y - ship.points[0].y).unit());
        player.applyFriction(ship.netVelocity);
        player.rotateTo(ship.direction);
        player.turnGravity(false);
        ship.hasPlayers[player.id] = player;
        player.isCol = true;
      }
        player.displace.add(push);
    }
  }
   

   //player Cannon interaction
   if(player.isGrabing && (!ship.cannon1.holder != player && (player.holding == ship.cannon1 || !player.holding)))
      ship.cannon1.move(player);

    if(player.isTrying && (!ship.cannon1.user != player && (player.using == ship.cannon1 || !player.using)))
      ship.cannon1.use(player);

    if(player.isTrying && (!ship.cannonLower1.user != player && (player.using == ship.cannonLower1 || !player.using)))
    ship.cannonLower1.use(player);

    if(player.isTrying && (!ship.cannonLower2.user != player && (player.using == ship.cannonLower2 || !player.using)))
    ship.cannonLower2.use(player);

    if(player.isTrying && (!ship.telescope.user != player && (player.using == ship.cannonLower2 || !player.using)))
    ship.telescope.use(player);

   //player ladder interaction
   var happened = playerLadderCollision(player,ship.ladder);
   if(happened){  
      player.setMove(new Vector(ship.points[1].x - ship.points[0].x, ship.points[1].y - ship.points[0].y).unit());
      player.applyFriction(ship.ladder.ship.netVelocity,true);
      player.rotateTo(ship.ladder.ship.direction);
      player.onLadder = true;
      ship.hasPlayers[player.id] = player; 
    }
    else{
      player.onLadder = false;
      var happened = playerLadderCollision(player,ship.mast);
      if(happened){  
          player.setMove(new Vector(ship.points[1].x - ship.points[0].x, ship.points[1].y - ship.points[0].y).unit());
          player.applyFriction(ship.ladder.ship.netVelocity,true);
          player.rotateTo(ship.ladder.ship.direction);
          player.onLadder = true;
          ship.hasPlayers[player.id] = player; 
        }
        else{
          player.onLadder = false;
        }
    }

  //block Ship Collision
  Object.keys(blocks).forEach(id =>{
    var {push,vec2,happened} = blockShipCollision(blocks[id],ship);
    if(happened){  
      if(vec2){
        blocks[id].rotateTo(ship.direction);
        blocks[id].applyFriction(ship.netVelocity);
        blocks[id].turnGravity(false);
        ship.hasBlocks[id] = blocks[id]; 
        blocks[id].isCol = true;
        //push after collision
      }
      blocks[id].displace.add(push);
    }
    else{
      blocks[id].turnGravity(true);
      blocks[id].isCol = false;
      delete ship.hasBlocks[id];
     }
  });

  //block trap door collision
  Object.keys(blocks).forEach(id =>{
    var happened = trapDoorCollision(blocks[id],ship.trapDoor);
    if(happened){
      var {push,vec2} = happened;
      if(vec2){
        blocks[id].rotateTo(ship.direction);
        blocks[id].applyFriction(ship.netVelocity);
        blocks[id].turnGravity(false);
        ship.hasBlocks[id] = blocks[id]; 
        blocks[id].isCol = true;
        }
        blocks[id].displace.add(push);
    }
  });

  //block block Collision
  var comboCol = {};
  Object.keys(blocks).forEach(id => {
    comboCol[id] = [];
    blocks[id].gotPushed = false;
  });

    Object.keys(blocks).forEach(id =>{
    Object.keys(blocks).forEach(id2 =>{
      var v = false;
      if(blocks[id] != blocks[id2] && comboCol[id2].indexOf(id) == -1){
          var swaped = false;
        
        if(blocks[id].beingHeld){
          [id, id2] = [id2, id]; swaped = true;
        }
        else{
          if(blocks[id].gotPushed){
            [id, id2] = [id2, id]; swaped = true;
          }
          var happened = blockBlockCollision(blocks[id2],blocks[id]);
          if(happened)
            var {push, vec2} = happened;
          if(vec2){
            v = true;
            [id, id2] = [id2, id]; swaped = true;
          }
        }
        if(!v){
          var happened = blockBlockCollision(blocks[id],blocks[id2]);
        }
        if(happened){  
          var {push,vec2} = happened;
          if(vec2 && blocks[id2].isCol){
            blocks[id].applyFriction(blocks[id2].netVelocity);
            blocks[id].rotateTo(blocks[id2].direction);
            blocks[id].turnGravity(false);
            blocks[id].onTop = true;
            blocks[id].isCol = true;
            blocks[id2].hasTop[id] = blocks[id];
          }
          else{delete blocks[id2].hasTop[id];}
          blocks[id].displace.add(push);
          blocks[id].gotPushed = true;
        }
        else{
          delete blocks[id2].hasTop[id];
        }

        if(swaped){[id, id2] = [id2, id];}
        comboCol[id].push(id2);
      }
    });
  });
  
  //graple planet collision
  if(ship.grapple && !ship.grapple.gotHooked){
    for(var i = 0; i<planets.length; i++){
      if(ship.grapple.distanceTo(planets[i]) < 100){
        ship.grapple.hook(planets[i]);
        ship.orbit();
      }
    }
  }

  //update displacements
  player.updateDisplace();
  ship.updateDisplace();
  Object.keys(blocks).forEach(id =>{
    blocks[id].updateDisplace();
  });
  
  //draw cannonBalls
  for(var i = 0; i < ship.cannonBalls.length; i++){
      var canvasX = canvas.width / 2 + ship.cannonBalls[i].pos.x - player.pos.x;
      var canvasY = canvas.height / 2 + ship.cannonBalls[i].pos.y - player.pos.y;
      context.beginPath();
      context.arc(canvasX, canvasY, ship.cannon1.radius, 0, 2*CONSTANTS.PI);
      context.fill();
  }
  
    //draw graple
  if(ship.grapple){
      const endX = canvas.width / 2 + ship.grapple.pos.x - player.pos.x;
      const endY = canvas.height / 2 + ship.grapple.pos.y - player.pos.y;
      const startX = canvas.width / 2 + ship.grapple.cannon.pos.x - player.pos.x;
      const startY = canvas.height / 2 + ship.grapple.cannon.pos.y - player.pos.y;
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(endX,endY);
      context.stroke();
      context.beginPath();
      context.moveTo(canvas.width / 2 + ship.pos.x - player.pos.x, canvas.height / 2 + ship.pos.y - player.pos.y);
      context.lineTo(canvas.width / 2 + ship.pos.x + ship.tangent.x * 100 - player.pos.x, canvas.height / 2 + ship.pos.y + ship.tangent.y * 100 - player.pos.y);
      context.stroke();
  }

  //draw planets
  for(var i = 0; i < planets.length; i++){
    var canvasX = canvas.width / 2 + planets[i].pos.x - player.pos.x;
    var canvasY = canvas.height / 2 + planets[i].pos.y - player.pos.y;
    context.beginPath();
    context.arc(canvasX, canvasY, planets[i].radius, 0, 2*CONSTANTS.PI);
    context.stroke();
  }
  
  lineWidth = 1;
  context.strokeStyle = 'black';
  drawPoly(ship.cannonWire1, player, ship.pos.x, ship.pos.y);
  context.restore();
  lineWidth = 3;
  drawPoly(player,player);
  drawPoly(ship,player);
  color = 'green';
  Object.keys(blocks).forEach(id =>{
    drawPoly(blocks[id],player);
  });
  //draw Cannon
  context.strokeStyle = 'black';
  color = 'black';
  context.lineWidth = .5;
  lineWidth = 1;
  //draw cannon1
  var canvasX = canvas.width / 2 + ship.cannon1.pos.x - player.eyes.x;
  var canvasY = canvas.height / 2 + ship.cannon1.pos.y - player.eyes.y;
  context.beginPath();
  context.arc(canvasX, canvasY, ship.cannon1.radius, 0, 2*CONSTANTS.PI);
  context.fill();
  drawPoly(ship.cannon1,player);
  
  //drawLowerCannon1
  var canvasX = canvas.width / 2 + ship.cannonLower1.pos.x - player.eyes.x;
  var canvasY = canvas.height / 2 + ship.cannonLower1.pos.y - player.eyes.y;
  context.beginPath();
  context.arc(canvasX, canvasY, ship.cannon1.radius, 0, 2*CONSTANTS.PI);
  context.fill();
  drawPoly(ship.cannonLower1,player);

  //drawLowerCannon2
  var canvasX = canvas.width / 2 + ship.cannonLower2.pos.x - player.eyes.x;
  var canvasY = canvas.height / 2 + ship.cannonLower2.pos.y - player.eyes.y;
  context.beginPath();
  context.arc(canvasX, canvasY, ship.cannon1.radius, 0, 2*CONSTANTS.PI);
  context.fill();
  drawPoly(ship.cannonLower2,player);
  drawTrapDoor(ship.trapDoor,player);
  drawPoly(ship.ladder,player);
  drawPoly(ship.mast,player);
  drawPoly(ship.platform,player);

  //draw Telescope
  var canvasX = canvas.width / 2 + ship.telescope.pos.x - player.eyes.x;
  var canvasY = canvas.height / 2 + ship.telescope.pos.y - player.eyes.y;
  context.beginPath();
  context.arc(canvasX, canvasY, ship.telescope.radius, 0, 2*CONSTANTS.PI);
  context.fill();
  drawPoly(ship.telescope,player);

}