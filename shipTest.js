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
import { playerRopeCollision } from "./playerRopeCollision";
import { shipShipCollision } from "./shipShipCollision";
import { Explosion } from "./explosion";
import { Asteroid } from "./asteroid";

var color;
var ldown = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.save();
var rDown = false;
var ships = [];
var asteroids = [];
var userShip;
var player = new PlayerObject(0,'1',window.innerWidth/2-300,window.innerHeight/2-250,25,25);
ships.push(new PirateShip(window.innerWidth/2-100,window.innerHeight/2-100,'gallion','ARGGGG'));
userShip = ships[0];
var blocks = {};
var blockID = 'a';
var lineWidth = 3;
var planets = [];
var mouseX;
var mouseY;
var AsteroidLineStart = new Vector(0,0);
var AsteroidLineEnd = new Vector(0,0);

var lastUpdateTime = 0;
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
      ships.push(new PirateShip(-canvas.width / 2 + mouseX + player.pos.x,-canvas.height / 2 + mouseY + player.pos.y,'gallion','ARGG'));
    }

    if(e.key == 'n'){
      rDown = rDown ? false : true;
    }

    if(e.key == 'x'){
      ships.forEach(ship=>{
        if(Math.sqrt((-canvas.width / 2 + mouseX + player.pos.x - ship.pos.x) * (-canvas.width / 2 + mouseX + player.pos.x - ship.pos.x) + (-canvas.height / 2 + mouseY + player.pos.y - ship.pos.y) * (-canvas.height / 2 + mouseY + player.pos.y - ship.pos.y)) < ship.radius){
          userShip = ship;
        }
      });
    }

    if(e.key == 'b'){
      blocks[blockID] = new Block(blockID, -canvas.width / 2 + mouseX + player.pos.x, -canvas.height / 2 + mouseY + player.pos.y,20,20);
      blockID += 'a';
    }
    if(e.key == 't'){
      ships[0].explosions[ships[0].explosionID] = new Explosion( -canvas.width / 2 + mouseX + player.pos.x, -canvas.height / 2 + mouseY + player.pos.y,100,new Vector(1,0),ships[0],ships[0].explosionID);
      ships[0].explosionID++;
    }
    if(e.key == 'l'){
      ldown = ldown ? false : true;
      if(!ldown){
        AsteroidLineStart.x = (-canvas.width / 2 + mouseX + player.pos.x);
        AsteroidLineStart.y = -canvas.height / 2 + mouseY + player.pos.y;
      }
      else{
        AsteroidLineEnd.x = (-canvas.width / 2 + mouseX + player.pos.x);
        AsteroidLineEnd.y = -canvas.height / 2 + mouseY + player.pos.y;
        asteroids.push(new Asteroid('a',AsteroidLineStart,new Vector(AsteroidLineEnd.x - AsteroidLineStart.x, AsteroidLineEnd.y - AsteroidLineStart.y)));
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

function drawPoly(block, me){
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

  var cp1X;
  var cp1Y;
  var cp2X;
  var cp2Y;
  function drawShip(ship,me){
    var canvasX = canvas.width / 2 + ship.pos.x - me.eyes.x;
    var canvasY = canvas.height / 2 + ship.pos.y - me.eyes.y;
    context.restore();
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    var o;
    context.beginPath();
    var damageCurves = [];
    for(var i = 0; i<ship.points.length; i++){
      o = i + 1;
      if(o == ship.points.length){
        o = 0;
      }
      var surface = new Vector(ship.points[o].x - ship.points[i].x, ship.points[o].y - ship.points[i].y).unit();
      var perp = new Vector((ship.points[o].y - ship.points[i].y), -(ship.points[o].x - ship.points[i].x)).unit();
      if(i == 0){
      context.moveTo(canvasX + ship.points[i].x, canvasY + ship.points[i].y);
      ship.damages.filter(damage =>damage.surface == i,).sort((a,b) =>{
        if(Math.abs((a.point.x - ship.points[i].x) * (a.point.y - ship.points[i].y)) < Math.abs((b.point.x - ship.points[i].x) * (b.point.y - ship.points[i].y))){
          return -1;
        }
        return 1;
      }).forEach(damage =>{
        var startX = canvasX + damage.point.x - 10 * surface.x;
        var startY = canvasY + damage.point.y - 10 * surface.y;
        var endX = canvasX + damage.point.x - 10 * perp.x;
        var endY = canvasY + damage.point.y - 10 * perp.y;
        cp1X = startX - perp.x * 10 * .552;
        cp1Y = startY - perp.y * 10 * .552;
        cp2X = endX - surface.x * 10 * .552;
        cp2Y = endY - surface.y * 10 * .552;
        if(damage.health == 0){
          context.lineTo(startX, startY);
          context.bezierCurveTo(cp1X,cp1Y,cp2X,cp2Y,endX,endY);
        }
        
        var startX2 = endX;
        var startY2 = endY;
        var endX2 = canvasX + damage.point.x + 10 * surface.x;
        var endY2 = canvasY + damage.point.y + 10 * surface.y;
        var cp1X2 = startX2 + surface.x * 10 * .552;
        var cp1Y2 = startY2 + surface.y * 10 * .552;
        var cp2X2 = endX2 - perp.x * 10 * .552;
        var cp2Y2 = endY2 - perp.y * 10 * .552;
        if(damage.health > 0){
          damageCurves.push({start : new Vector(startX,startY), curve1 : [cp1X,cp1Y,cp2X,cp2Y,endX,endY], curve2 : [cp1X2,cp1Y2,cp2X2,cp2Y2,endX2,endY2],health : damage.health});
        }
        else{
          context.bezierCurveTo(cp1X2,cp1Y2,cp2X2,cp2Y2,endX2,endY2);
        }
      });
      }
      else if(i != ship.points.length - 1){
      context.lineTo(canvasX + ship.points[i].x, canvasY + ship.points[i].y);
      ship.damages.filter(damage =>damage.surface == i,).sort((a,b) =>{
        if(Math.abs((a.point.x - ship.points[i].x) * (a.point.y - ship.points[i].y)) < Math.abs((b.point.x - ship.points[i].x) * (b.point.y - ship.points[i].y))){
          return -1;
        }
        return 1;
      }).forEach(damage =>{
        var startX = canvasX + damage.point.x - 10 * surface.x;
        var startY = canvasY + damage.point.y - 10 * surface.y;
        var endX = canvasX + damage.point.x - 10 * perp.x;
        var endY = canvasY + damage.point.y - 10 * perp.y;
        cp1X = startX - perp.x * 10 * .552;
        cp1Y = startY - perp.y * 10 * .552;
        cp2X = endX - surface.x * 10 * .552;
        cp2Y = endY - surface.y * 10 * .552;
        if(damage.health == 0){
          context.lineTo(startX, startY);
          context.bezierCurveTo(cp1X,cp1Y,cp2X,cp2Y,endX,endY);
        }
        
        var startX2 = endX;
        var startY2 = endY;
        var endX2 = canvasX + damage.point.x + 10 * surface.x;
        var endY2 = canvasY + damage.point.y + 10 * surface.y;
        var cp1X2 = startX2 + surface.x * 10 * .552;
        var cp1Y2 = startY2 + surface.y * 10 * .552;
        var cp2X2 = endX2 - perp.x * 10 * .552;
        var cp2Y2 = endY2 - perp.y * 10 * .552;
        if(damage.health > 0){
          damageCurves.push({start : new Vector(startX,startY), curve1 : [cp1X,cp1Y,cp2X,cp2Y,endX,endY], curve2 : [cp1X2,cp1Y2,cp2X2,cp2Y2,endX2,endY2], health : damage.health});
        }
        else{
          context.bezierCurveTo(cp1X2,cp1Y2,cp2X2,cp2Y2,endX2,endY2);
        }
      });
      }
      if(i == ship.points.length - 1){
        context.lineTo(canvasX + ship.points[i].x, canvasY + ship.points[i].y);
        ship.damages.filter(damage =>damage.surface == i,).sort((a,b) =>{
          if(Math.abs((a.point.x - ship.points[i].x) * (a.point.y - ship.points[i].y)) < Math.abs((b.point.x - ship.points[i].x) * (b.point.y - ship.points[i].y))){
            return -1;
          }
          return 1;
        }).forEach(damage =>{
        var startX = canvasX + damage.point.x - 10 * surface.x;
        var startY = canvasY + damage.point.y - 10 * surface.y;
        var endX = canvasX + damage.point.x - 10 * perp.x;
        var endY = canvasY + damage.point.y - 10 * perp.y;
        cp1X = startX - perp.x * 10 * .552;
        cp1Y = startY - perp.y * 10 * .552;
        cp2X = endX - surface.x * 10 * .552;
        cp2Y = endY - surface.y * 10 * .552;
        if(damage.health == 0){
          context.lineTo(startX, startY);
          context.bezierCurveTo(cp1X,cp1Y,cp2X,cp2Y,endX,endY);
        }
        
        var startX2 = endX;
        var startY2 = endY;
        var endX2 = canvasX + damage.point.x + 10 * surface.x;
        var endY2 = canvasY + damage.point.y + 10 * surface.y;
        var cp1X2 = startX2 + surface.x * 10 * .552;
        var cp1Y2 = startY2 + surface.y * 10 * .552;
        var cp2X2 = endX2 - perp.x * 10 * .552;
        var cp2Y2 = endY2 - perp.y * 10 * .552;
        if(damage.health > 0){
          damageCurves.push({start : new Vector(startX,startY), curve1 : [cp1X,cp1Y,cp2X,cp2Y,endX,endY], curve2 : [cp1X2,cp1Y2,cp2X2,cp2Y2,endX2,endY2], health : damage.health});
        }
        else{
          context.bezierCurveTo(cp1X2,cp1Y2,cp2X2,cp2Y2,endX2,endY2);
        }        
        });
        context.lineTo(canvasX + ship.points[0].x, canvasY + ship.points[0].y);
      }
    }
    context.closePath();
    context.fillStyle = '#52300d';
    context.fill();
    damageCurves.forEach(curve =>{
      context.beginPath();
      context.moveTo(curve.start.x, curve.start.y);
      context.bezierCurveTo(curve.curve1[0],curve.curve1[1],curve.curve1[2],curve.curve1[3],curve.curve1[4],curve.curve1[5]);
      context.bezierCurveTo(curve.curve2[0],curve.curve2[1],curve.curve2[2],curve.curve2[3],curve.curve2[4],curve.curve2[5]);
      context.lineTo(curve.start.x,curve.start.y);
      context.closePath();
      context.globalAlpha = 1 - (curve.health/300);
      context.fillStyle = 'red';
      context.fill();
    });
    context.globalAlpha = 1;
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
          var gameY =  -canvas.height / 2 + y + playerY;
          if(gameY < 6000){
          context.fillStyle = "#FFDB51";
          context.translate(canvas.width / 2 - playerX + x, canvas.height / 2 - playerY + y);
          context.beginPath();
          const a = 5;
          context.moveTo(108/a, 0.0);
          context.lineTo(141/a, 70/a);
          context.lineTo(218/a, 78.3/a);
          context.lineTo(162/a, 131/a);
          context.lineTo(175/a, 205/a);
          context.lineTo(108/a, 170/a);
          context.lineTo(41.2/a, 205/a);
          context.lineTo(55/a, 131/a);
          context.lineTo(1/a, 78/a);
          context.lineTo(75/a, 68/a);
          context.lineTo(108/a, 0);
          context.closePath();
          context.fill();
          context.restore();
        }
        else{
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
    }
    context.restore();
  }



function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width =  window.innerWidth;
  canvas.height = window.innerHeight;
}
function drawCannonWire(block,me,x,y){
  var canvasX = canvas.width / 2 + x - me.eyes.x;
  var canvasY = canvas.height / 2 + y - me.eyes.y;
  context.restore();
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
setInterval(draw,1000/60);
setCanvasDimensions();
function draw(){
  const now = Date.now();
  const dt = (now - lastUpdateTime) / 1000;
  lastUpdateTime = now;

  //clear rect 
  context.clearRect(0,0,window.innerWidth,window.innerHeight);
  renderBackround(player.eyes.x, player.eyes.y);
  context.fillStyle = 'black';
  ships.forEach(ship =>{  
    ship.update(60/1000);
  });
  
  player.update(60/1000);  
  asteroids.forEach(a =>{
    a.update(60/1000);
  })
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

    //player rope collisions
    ships.forEach(ship =>{
      if(ship.grapple && ship.grapple.gotHooked){
        var happened = playerRopeCollision(player,ship.grapple.ropeBox);
        if(happened){  
          player.setMove(new Vector(-(ship.grapple.pos.y - ship.grapple.cannon.pos.y), (ship.grapple.pos.x - ship.grapple.cannon.pos.x)).unit());
          var angularConvert = new Vector((ship.netVelocity.x/ship.distanceTo(ship.planet))*player.distanceTo(ship.planet),
          (ship.netVelocity.y/ship.distanceTo(ship.planet))*player.distanceTo(ship.planet));
          player.applyFriction(angularConvert,true);
          player.rotateTo(0);
          player.onLadder = true;
          player.didOnLadder = true;
          player.shipWithin = null;
          player.withinShip = false;
          player.didOnRope = true;
          player.onRope = true;
          ship.hasPlayers[player.id] = player; 
        }
      }
    });
    if(player.didOnRope){
      player.onRope = true;
    }else{player.onRope = false;}
    player.didOnRope = false;
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
        player.withinShip = true;
        player.shipWithin = ship;
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
        player.withinShip = true;
        player.shipWithin = ship;
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
          player.withinShip = true;
          player.shipWithin = ship;
        }
          player.displace.add(push);
      }
    }

    if(player.shipWithin == ship && player.distanceTo(ship) < ship.radius){
      player.didWithinShip = true;
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
        player.rotateTo(ship.direction);
        player.onLadder = true;
        player.didOnLadder = true;
        ship.hasPlayers[player.id] = player; 
      }
      else{ //player mast interaction
        var happened = playerLadderCollision(player,ship.mast);
        if(happened){  
            player.setMove(new Vector(ship.points[1].x - ship.points[0].x, ship.points[1].y - ship.points[0].y).unit());
            player.applyFriction(ship.ladder.ship.netVelocity,true);
            player.rotateTo(ship.direction);
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
            otherShip.takeDamage(collision.u, collision.j,ship.cannonBalls[i].power);
            ship.cannonBalls.splice(i,1);
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

    //graple asteroid collision
    if(ship.grapple && !ship.grapple.gotHooked){
      for(var i = 0; i<asteroids.length; i++){
        if(ship.grapple.distanceTo(asteroids[i]) < 100){
          ship.grapple.hook(asteroids[i]);
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

    //player explosion collision
    Object.values(ship.explosions).filter(e => e.hitboxExist < 3).forEach(e =>{
      if(player.withinRect(e,(e.radius + player.radius)/2,(e.radius + player.radius)/2)){
        if(player.distanceTo(e) < player.radius + e.radius){
          var d = new Vector(player.pos.x - (e.point.x + ship.pos.x), player.pos.y - (e.point.y + ship.pos.y)).unit();
          var p = new Vector(e.surface.y, -e.surface.x).unit();
          p.add(d);
          player.boom(p.unit());             
          player.withinShip = false;
          player.shipWithin = null;
          player.setMove(new Vector(1,0));
          player.rotateTo(0);
      
        }
      }
    });

    //block explosion collision 
    Object.values(blocks).forEach(block =>{
      Object.values(ship.explosions).filter(e => e.hitboxExist < 3).forEach(e =>{
        if(block.withinRect(e,e.radius,e.radius)){
          if(block.distanceTo(e) < block.radius + e.radius){
            var d = new Vector(block.pos.x - (e.point.x + ship.pos.x), block.pos.y - (e.point.y + ship.pos.y)).unit();
            var p = new Vector(e.surface.y, -e.surface.x).unit();
            p.add(d);
            block.boom(p.unit());             
          }
        }
      });
    });
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

  //PLAYER LADDER FIX
  if(!player.didOnLadder){
    player.onLadder = false;
  }
  player.didOnLadder = false;

  //player within ship fix
  if(!player.didWithinShip && !player.onRope){
    player.withinShip = false;
    player.shipWithin = null;
    player.setMove(new Vector(1,0));
    player.rotateTo(0);
  }
  player.didWithinShip = false;

   //player block Collision
   Object.keys(blocks).forEach(id =>{
      var happened = blockCollision(player,blocks[id]);
      if(happened){  
        if(blocks[id].holder == player){
          player.drop();
        }
        color = 'red';
        var {push, vec2} = happened;
        if(vec2){
          player.setMove(vec2);
          player.applyFriction(blocks[id].netVelocity);
          player.rotateTo(blocks[id].direction);
          player.turnGravity(false);
          player.onTop = true;
          blocks[id].hasTop[player.id] = player;
          player.isCol = true;
          player.didCol = true;
        }
        else{
          if(blocks[id].hasTop[player.id]){
            player.onTop = false;
            delete blocks[id].hasTop[player.id];
          }
          if(player.isGrabing && !player.isHolding){
            player.grab(blocks[id]);
          }
        }
        player.displace.add(push);
      }
      else{
        blocks[id].wasJustHeld = false;
        color = 'black';
        if(blocks[id].hasTop[player.id]){
          player.onTop = false;
          delete blocks[id].hasTop[player.id];
        }
      }
  });  


    
  //PLAYER COLLISION FIX
    if(!player.didCol){
      player.isCol = false;
    }
    player.didCol = false;

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
        
        if(blocks[id2].beingHeld){
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
    drawShip(ship,player);
    context.fillStyle = 'black';
  });

  

  //draw ship parts
  ships.forEach(ship =>{  
  lineWidth = 1;
  context.strokeStyle = 'black';
  drawCannonWire(ship.cannonWire1, player);
  context.restore();
  
  //draw cannonBalls
  for(var i = 0; i < ship.cannonBalls.length; i++){
    var canvasX = canvas.width / 2 + ship.cannonBalls[i].pos.x - player.pos.x;
    var canvasY = canvas.height / 2 + ship.cannonBalls[i].pos.y - player.pos.y;
    context.beginPath();
    context.arc(canvasX, canvasY, ship.cannon1.radius, 0, 2*CONSTANTS.PI);
    context.fill();
  }

  //draw explosions
  
  Object.keys(ship.explosions).forEach(id =>{
    var canvasX = canvas.width / 2 +  ship.explosions[id].pos.x - player.pos.x;
    var canvasY = canvas.height / 2 + ship.explosions[id].pos.y - player.pos.y;
    context.beginPath();
    context.arc(canvasX, canvasY, ship.explosions[id].radius, 0, 2*CONSTANTS.PI);
    context.fillStyle = 'red';
    context.fill();
  });
  context.fillStyle = 'black';
  
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

    //draw button
    var canvasX = canvas.width / 2 + ship.pos.x + ship.button.x - player.eyes.x;
    var canvasY = canvas.height / 2 + ship.pos.y + ship.button.y - player.eyes.y;
    context.beginPath();
    context.arc(canvasX, canvasY, ship.buttonRadius, 0, 2*CONSTANTS.PI);
    context.fill();



    //draw flag
    drawPoly(ship.flag,player);
    context.fillStyle = ship.flag.color;
    context.fill();
    context.fillStyle = 'black';
    context.font = "8px papyrus";
    context.save();
    context.translate(canvas.width/2 - player.eyes.x + ship.pos.x + ship.namePoint.x,canvas.height/2 - player.eyes.y + ship.pos.y + ship.namePoint.y);
    context.rotate(ship.direction);
    context.fillText(ship.flag.name,0,0);
    context.restore();
    //rope
    if(ship.grapple?.gotHooked){
      var canvasX = canvas.width / 2  - player.eyes.x;
      var canvasY = canvas.height / 2  - player.eyes.y;
      context.beginPath();
      context.moveTo(ship.grapple.ropeBox.points[0].x + canvasX,ship.grapple.ropeBox.points[0].y + canvasY);
      context.lineTo(ship.grapple.ropeBox.points[1].x + canvasX,ship.grapple.ropeBox.points[1].y + canvasY);
      context.lineTo(ship.grapple.ropeBox.points[2].x + canvasX,ship.grapple.ropeBox.points[2].y + canvasY);
      context.lineTo(ship.grapple.ropeBox.points[3].x + canvasX,ship.grapple.ropeBox.points[3].y + canvasY);
      context.lineTo(ship.grapple.ropeBox.points[0].x + canvasX,ship.grapple.ropeBox.points[0].y + canvasY);

    }
    context.stroke();
    context.restore();
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
    //draw Astroid
    asteroids.forEach(a =>{
      var canvasX = canvas.width / 2 + a.pos.x - player.eyes.x;
      var canvasY = canvas.height / 2 + a.pos.y - player.eyes.y;
      context.beginPath();
      context.arc(canvasX,canvasY,a.radius,0,2 * CONSTANTS.PI);
      context.stroke();
  
    });
    //draw Astroid Line
    var canvasXS = canvas.width / 2 + AsteroidLineStart.x - player.eyes.x;
    var canvasYS = canvas.height / 2 + AsteroidLineStart.y - player.eyes.y;
    var canvasXE = canvas.width / 2 + AsteroidLineEnd.x - player.eyes.x;
    var canvasYE = canvas.height / 2 + AsteroidLineEnd.y - player.eyes.y;
    context.beginPath();
    context.moveTo(canvasXS,canvasYS);
    context.lineTo(canvasXE, canvasYE);
    context.stroke();
    
  }