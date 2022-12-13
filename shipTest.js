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
import {playerLadderCollision} from "./playerLadderCollision";
import { shipPlanetCollision } from "./shipPlanetCollision";
import { cannonBallShipCollision } from "./cannonBallShipCollision";
import { cannonBallTrapDoorCollision } from "./cannonBallTrapDoorCollision";
import { cannonBallPlanetCollision } from "./cannonBallPlanetCollision";
import { shipShipCollision } from "./shipShipCollision";
var color;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.save();
var rDown = false;
var ships = [];
var userShip;
var player = new PlayerObject(0,'1',window.innerWidth/2-300,window.innerHeight/2-250,25,25);
ships.push(new PirateShip(window.innerWidth/2-100,window.innerHeight/2-100,'gallion'));
userShip = ships[0];
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
      userShip.stop = userShip.stop ? false : true;
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
      userShip.rotate(.01);
    }

    if(e.key == 'u'){
      userShip.rotate(-.01);
    }

    if(e.key == 'k'){
      player.handlePress('k');
    }

    if(e.key == 'z'){
      ships.push(new PirateShip(-canvas.width / 2 + mouseX + player.pos.x,-canvas.height / 2 + mouseY + player.pos.y,'gallion'));
    }

    if(e.key == 'x'){
      ships.forEach(ship=>{
        if(Math.sqrt((-canvas.width / 2 + mouseX + player.pos.x - ship.pos.x) * (-canvas.width / 2 + mouseX + player.pos.x - ship.pos.x) + (-canvas.height / 2 + mouseY + player.pos.y - ship.pos.y) * (-canvas.height / 2 + mouseY + player.pos.y - ship.pos.y)) < ship.radius){
          userShip = ship;
        }
      });
    }

    if(e.key == 'b'){
      blocks[blockID] = new Block(blockID, -canvas.width / 2 + mouseX + player.pos.x, -canvas.height / 2 + mouseY + player.pos.y,15,15);
      blockID += 'a';
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
    if(e.key == ' '){
      player.handleRelease(' ');
    }
}

function click(){
  player.pos.x = -canvas.width / 2 + mouseX + player.pos.x;
  player.pos.y =  -canvas.height / 2 + mouseY + player.pos.y;
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
      if(i == 0){
      context.moveTo(canvasX + block.points[i].x, canvasY + block.points[i].y);
      }
      else{
      context.lineTo(canvasX + block.points[i].x, canvasY + block.points[i].y);
      }
      if(i == block.points.length - 1){
        context.lineTo(canvasX + block.points[0].x, canvasY + block.points[0].y);
      }
    }
    context.closePath();
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


  function renderBackround(playerX, playerY){
    context.fillStyle = '#34cceb';
    context.fillRect(0,0,canvas.width,canvas.height);
    for(var x = playerX - canvas.width/2 - 400; x < canvas.width/2 + playerX + 400; x +=20){
      for(var y = playerY - canvas.height/2 - 400; y < canvas.height/2 + playerY + 400; y +=20){
        x = Math.ceil(x / 20) * 20;
        y = Math.ceil(y/20) * 20;
        if((x % 1980 == 0 && y % 2360 == 0) ||((x != 0 && y != 0) && (x % 2120 == 0 && y % 1880 == 0)) || (x % 1400 == 0 && y % 860 == 0) || ((x != 0 && y != 0) && (x % 1240 == 0 && y % 1000 == 0))){
          context.save();
          context.translate(canvas.width / 2 - playerX + x, canvas.height / 2 - playerY + y);
          context.beginPath();
          context.moveTo(170, 80);
          context.bezierCurveTo(130, 100, 130, 150, 230, 150);
          context.bezierCurveTo(250, 180, 320, 180, 340, 150);
          context.bezierCurveTo(420, 150, 420, 120, 390, 100);
          context.bezierCurveTo(430, 40, 370, 30, 340, 50);
          context.bezierCurveTo(320, 5, 250, 20, 250, 50);
          context.bezierCurveTo(200, 5, 150, 20, 170, 80);
          context.closePath();
          context.fillStyle = 'white';
          context.fill();
          context.restore();
        }
      }
    }
    context.restore();
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
  renderBackround(player.eyes.x, player.eyes.y);
  context.fillStyle = 'black';
  player.update(60/1000);  
  ships.forEach(ship =>{  
    ship.update(60/1000);
  });
  
ships.forEach(ship =>{
  for(var i = 0; i < ship.cannonBalls.length; i++){
    ship.cannonBalls[i].update(60/1000);
  }
});

  Object.keys(blocks).forEach(id =>{
    blocks[id].update(60/1000);
  });

  ships.forEach(ship =>{
    //ship planet collision
    for(var i = 0; i < planets.length; i++){
      var happened = shipPlanetCollision(ship, planets[i]);
      if(happened){
        var {push} = happened;
        ship.displace.add(push);
      }
    }

  
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
        player.didCol = true;
        }
        player.displace.add(push);
      }
        //push after collision
    else{
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
        player.didCol = true;
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
          player.didCol = true;          
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

      if(player.isTrying && (!ship.cannonLower2.user != player && (player.using == ship.cannonLower2 || !player.using)))
      ship.cannonLower2.use(player);
      
      if(player.isTrying && (!ship.telescope.user != player && (player.using == ship.cannonLower2 || !player.using)))
      ship.telescope.use(player);

      if(player.isTrying && ((player.pos.x - (ship.pos.x + ship.button.x)) * (player.pos.x - (ship.pos.x + ship.button.x)) + 
      (player.pos.y - (ship.pos.y + ship.button.y)) * (player.pos.y - (ship.pos.y + ship.button.y))) < ((ship.buttonRadius + player.radius) * (ship.buttonRadius + player.radius))/2){
        if(ship.trapDoor.isOpen){
          ship.trapDoor.closing = true;
        }
        if(ship.trapDoor.isClosed){
          ship.trapDoor.opening = true;

        }
      }
    //player ladder interaction
    var happened = playerLadderCollision(player,ship.ladder);
    if(happened){  
        player.setMove(new Vector(ship.points[1].x - ship.points[0].x, ship.points[1].y - ship.points[0].y).unit());
        player.applyFriction(ship.ladder.ship.netVelocity,true);
        player.rotateTo(ship.ladder.ship.direction);
        player.onLadder = true;
        player.didOnLadder = true;
        ship.hasPlayers[player.id] = player; 
      }
      else{
        var happened = playerLadderCollision(player,ship.mast);
        if(happened){  
            player.setMove(new Vector(ship.points[1].x - ship.points[0].x, ship.points[1].y - ship.points[0].y).unit());
            player.applyFriction(ship.ladder.ship.netVelocity,true);
            player.rotateTo(ship.ladder.ship.direction);
            player.onLadder = true;
            player.didOnLadder = true;
            ship.hasPlayers[player.id] = player; 
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

    //cannon ball ship collision
    for(var i = 0; i < ship.cannonBalls.length;i++){
      ships.forEach(otherShip =>{
        if(ship.cannonBalls[i]){
          var collision = cannonBallShipCollision(ship.cannonBalls[i],otherShip);
          if(collision){
            ship.cannonBalls[i].explode();
            ship.cannonBalls.splice(i,1);
            otherShip.takeDamage(collision.u, collision.j);
          }
        }
      });
    }

    //cannon ball planet collisions
    for(var i = 0; i < ship.cannonBalls.length;i++){
      planets.forEach(planet =>{
        if(ship.cannonBalls[i]){
          if(cannonBallPlanetCollision(ship.cannonBalls[i],planet)){
            ship.cannonBalls[i].explode();
            ship.cannonBalls.splice(i,1);
          }
        }
      });
    }
        //graple planet collision
    if(ship.grapple && !ship.grapple.gotHooked){
      for(var i = 0; i<planets.length; i++){
        if(ship.grapple.distanceTo(planets[i]) < 100){
          ship.grapple.hook(planets[i]);
          ship.orbit();
        }
      }
    }

    //grapple ship collision
    if(ship.grapple && !ship.grapple.gotHooked){
      ships.forEach(otherShip =>{
        if(ship.grapple && !ship.grapple.gotHooked){
          if(shipPlanetCollision(otherShip,ship.grapple)){
            ship.grapple.detach();
          }
        }
      });
    }

    //ship ship collision
    for(var i = 0; i < ships.length; i++){
      var happened = shipShipCollision(ship, ships[i]);
      if(happened){
        var {push} = happened;
        ship.displace.add(new Vector(push.x/2, push.y/2));
        ships[i].displace.add(new Vector(-push.x/2, -push.y/2));
      }
    }
  });

  //PLAYER COLLISION FIX
  if(!player.didCol){
    player.isCol = false;
  }
  player.didCol = false;

  if(!player.didOnLadder){
    player.onLadder = false;
  }
  player.didOnLadder = false;


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
  
  //update displacements
  player.updateDisplace();
  ships.forEach(ship =>{
    ship.updateDisplace();
  });
  Object.keys(blocks).forEach(id =>{
    blocks[id].updateDisplace();
  });
  //draw ships
  ships.forEach(ship =>{
    lineWidth = 3;
    drawPoly(ship,player);
    context.fillStyle = '#52300d';
    context.fill();
    context.fillStyle = 'black';
  });
  lineWidth = 1;

  //draw Damage
  ships.forEach(ship =>{  
    for(var i = 0; i < ship.damages.length; i++){
      var canvasX = canvas.width / 2 + ship.pos.x + ship.damages[i].x - player.eyes.x;
      var canvasY = canvas.height / 2 + ship.pos.y + ship.damages[i].y - player.eyes.y;
      context.beginPath();
      context.arc(canvasX, canvasY, 10, 0, 2*CONSTANTS.PI);
      context.fillStyle = '#34cceb';
      context.fill();
      context.fillStyle = 'black';
    }
  });
  //draw ship parts
  ships.forEach(ship =>{  
  lineWidth = 1;
  context.strokeStyle = 'black';
  drawPoly(ship.cannonWire1, player, ship.pos.x, ship.pos.y);
  context.restore();
  
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
  }
    context.strokeStyle = 'black';
    color = 'black';
    context.lineWidth = .5;
    lineWidth = 1;
    //draw cannon1
    var canvasX = canvas.width / 2 + ship.cannon1.pos.x - player.eyes.x;
    var canvasY = canvas.height / 2 + ship.cannon1.pos.y - player.eyes.y;
    context.beginPath();
    context.arc(canvasX, canvasY, ship.cannon1.radius, 0, (2*CONSTANTS.PI/5) * ship.cannon1.ammo);
    context.fill();
    drawPoly(ship.cannon1,player);
    context.fillStyle = "rgb("+(ship.cannon1.loadTimer*18).toString()+", 10, 10)";
    context.fill();
    context.fillStyle = 'black';
    
    //drawLowerCannon1
    var canvasX = canvas.width / 2 + ship.cannonLower1.pos.x - player.eyes.x;
    var canvasY = canvas.height / 2 + ship.cannonLower1.pos.y - player.eyes.y;
    context.beginPath();
    context.arc(canvasX, canvasY, ship.cannon1.radius, 0, (2*CONSTANTS.PI/5) * ship.cannonLower2.ammo);
    context.fill();
    drawPoly(ship.cannonLower1,player);
    context.fillStyle = "rgb("+(ship.cannonLower1.loadTimer*18).toString()+", 10, 10)";
    context.fill();
    context.fillStyle = 'black';

    //drawLowerCannon2
    var canvasX = canvas.width / 2 + ship.cannonLower2.pos.x - player.eyes.x;
    var canvasY = canvas.height / 2 + ship.cannonLower2.pos.y - player.eyes.y;
    context.beginPath();
    context.arc(canvasX, canvasY, ship.cannon1.radius, 0, (2*CONSTANTS.PI/5) * ship.cannonLower2.ammo);
    context.fill();
    drawPoly(ship.cannonLower2,player);
    context.fillStyle = "rgb("+(ship.cannonLower2.loadTimer*18).toString()+", 10, 10)";
    context.fill();
    context.fillStyle = 'black';

    //draw ladder, mast, and trap door
    drawTrapDoor(ship.trapDoor,player);
    drawPoly(ship.ladder,player);
    drawPoly(ship.mast,player);
    context.fillStyle = '#4d0f20';
    context.fill();
    context.fillStyle = 'black';
    drawPoly(ship.platform,player);

    //draw Telescope
    var canvasX = canvas.width / 2 + ship.telescope.pos.x - player.eyes.x;
    var canvasY = canvas.height / 2 + ship.telescope.pos.y - player.eyes.y;
    context.beginPath();
    context.arc(canvasX, canvasY, ship.telescope.radius, 0, 2*CONSTANTS.PI);
    context.fill();
    drawPoly(ship.telescope,player);

    //draw Telescope
    var canvasX = canvas.width / 2 + ship.pos.x + ship.button.x - player.eyes.x;
    var canvasY = canvas.height / 2 + ship.pos.y + ship.button.y - player.eyes.y;
    context.beginPath();
    context.arc(canvasX, canvasY, ship.buttonRadius, 0, 2*CONSTANTS.PI);
    context.fill();
  });
    //draw planets
    for(var i = 0; i < planets.length; i++){
      drawPoly(planets[i],player);
    }
    //draw Player
    drawPoly(player,player);
    //draw Block
    color = 'green';
    Object.keys(blocks).forEach(id =>{
      drawPoly(blocks[id],player);
    });
  
}