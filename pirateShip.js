import Vector from "./2Dvector";
import { Cannon } from "./cannon";
import { Polygon } from "./polygon";
import { CONSTANTS } from "./constants";
import {TrapDoor} from "./trapDoor";
import {Ladder} from "./ladder";
import { Platform } from "./platform";
import { Telescope } from "./telescope";
import { Explosion } from "./explosion";
import { Flag } from "./flag";
export class PirateShip extends Polygon{
  constructor(x, y,type,name) {
    if(type == 'dingy'){
      super([new Vector(-200, -25), new Vector(200, -25), new Vector(200, 0), new Vector(100, 100), new Vector(-100,100), new Vector(-200, 0)]);
      this.radius = 225;
    }

    if(type == 'gallion'){
      super([new Vector(-200, -30), new Vector(-35, -30), new Vector(-35, 0),new Vector(-125, 0),new Vector(-125, 65),new Vector(125, 65),new Vector(125, 0),new Vector(35, 0),new Vector(35, -30), new Vector(200, -30), new Vector(200, 0), new Vector(100, 100), new Vector(-100,100), new Vector(-200, 0)]);
      this.outer = [this.points[0], this.points[9], this.points[10], this.points[11], this.points[12], this.points[13]];
      this.radius = 220;
    }
    //movement
    this.pos = new Vector(x,y);
    this.netVelocity = new Vector(0,0);
    this.displace = new Vector(0,0);
    this.friction = new Vector(0,0);
    this.forward = new Vector(1,0);
    this.forwardMove = new Vector(15,0);
  
    //stop vec
    this.stop = false;
    //Collision Vectors
    if(type == 'dingy'){
      this.collisionZeros = [new Vector(0, 0), new Vector(0, 0), new Vector(0, 0),new Vector(0, 0), new Vector(0, 0),new Vector(0, 0)];
    } 
    
    if(type == 'gallion'){
      this.collisionZeros = [new Vector(-180, -10), 'a', new Vector(-45, -10), 'a', 'a', 'a', 'a', new Vector(45, -10), 'a', new Vector(150, 20), new Vector(180, -20), new Vector(85, 85), new Vector(-85, 85), new Vector(-180, -20)];
      this.collisionZero1 = new Vector(-50,-15);
      this.collisionZero8 = new Vector(50,-15);
      this.trapDoor = new TrapDoor(this);
      this.ladder = new Ladder(this, [new Vector(35,0), new Vector(45,0), new Vector(45,55), new Vector(35,55)]);
      this.mast = new Ladder(this, [new Vector(70,-30), new Vector(55,-30), new Vector(55,-160), new Vector(70,-160)]);
      this.button = this.mast.points[1];
      this.buttonRadius = 5;
      this.flag = new Flag(this,name,'red');
      this.namePoint = new Vector(75,-115);
      this.name = name;
      this.damageDown = [0,false,1,0,0,true,1,true,0,3,2,1,false,true];
    }
    //collision
    this.isCol = false;
    if(type == 'dingy'){
      this.floor = [0];
    }

    if(type == 'gallion'){
      this.floor = [0,4,8];
    }
    //Steering
    this.hasPlayers = {};
    this.hasBlocks = {};
    this.torque = 0;
 

    //cannon
    this.cannonWire1 = new Polygon([new Vector(-200,-35), new Vector(-50,-35)]);
    this.cannon1 = new Cannon(this,this.cannonWire1);
    if(type == 'gallion'){
      this.cannonLower1 = new Cannon(this, null, this.points[4],1);
      this.cannonLower2 = new Cannon(this,null, this.points[5],-1);
    }

    //telescope and platform
    if(type == 'gallion'){
      this.platform = new Platform(this,[new Vector(45,-150), new Vector(80,-150), new Vector(80,-155), new Vector(45,-155)]);
      this.telescope = new Telescope(this,this.platform.points[2]);

    }

    //cannon Balls and grapple
    this.cannonBalls = [];
    this.grapple;
    this.continueGrapple = false;

    //explosions
    this.explosions = {};
    this.explosionID = 'a';

    //orbit
    this.inOrbit = false;
    this.planet;
    this.justGrappled = true;
    this.rotOG;
    this.rotOGCounter = 0;
    this.turn = 1;
    this.tangent = new Vector(0,0);
    this.continued = false;
    this.onAsteroid = false;

    //Takedamage 
    this.damages = [];
    
  }    

  
  update(dt) {
    //update position
    this.netVelocity.x = this.forwardMove.x;
    this.netVelocity.y = this.forwardMove.y;
    if(!this.stop){
      this.pos.x += dt * this.netVelocity.x;
      this.pos.y += dt * this.netVelocity.y;
    }
    else{
      this.netVelocity.x = 0;
      this.netVelocity.y = 0;
    }
    //update cannons and telescope
    this.cannon1.update(dt);
    this.cannonLower1.update(dt);
    this.cannonLower2.update(dt);
    this.telescope.update();
    //update grapple
    if(this.grapple){
      this.grapple.update(dt);
      if(!this.grapple.exists){
        delete this.grapple;
        this.grapple = null;
        
      }
    }
    //update ropeBox
    if(this.grapple?.gotHooked){
      this.grapple.updateRopeBox();
    }
    
    //update explosions
    Object.keys(this.explosions).forEach(id =>{
      this.explosions[id].update(dt);
    });
    //apply torques
    this.torque = 0;
    
    //cannon Turque
    this.torque += (this.cannon1.pos.x - this.pos.x)/600;

    //Players Torque
    for(var id in this.hasPlayers){
      this.torque += (this.hasPlayers[id].pos.x - this.pos.x)/600;
    }

    //Block Torque
    for(var id in this.hasBlocks){
      this.torque += (this.hasBlocks[id].pos.x - this.pos.x)/1000;
      if(this.hasBlocks[id].hasTop){
        for(var id2 in this.hasBlocks[id].hasTop){
          if(this.hasBlocks[id].hasTop[id2].constructor.name == 'Block'){
            this.torque += (this.hasBlocks[id].hasTop[id2].pos.x - this.pos.x)/1000;
          }
          if(this.hasBlocks[id].hasTop[id2].constructor.name == 'PlayerObject'){
            this.torque += (this.hasBlocks[id].hasTop[id2].pos.x - this.pos.x)/600;
          }
        }
      }
    }

    //damage torque
    for(var i = 0; i < this.damages.length; i++){
      this.torque -= (this.damages[i].point.x)/1500;
    }
    if(!this.inOrbit){
      if(!this.stop){
        this.applyTorque();
      }
    }
    else{
      this.orbit();
    }
    
    //trap door update
    this.trapDoor.update(dt);
   
    //give asteroid speed
    if(this.onAsteroid){
      this.netVelocity.x +=this.planet.netVelocity.x;
      this.netVelocity.y +=this.planet.netVelocity.y;
      this.pos.x += dt * this.planet.netVelocity.x;
      this.pos.y += dt * this.planet.netVelocity.y;
    }

    //change collision zeros for trap door
    if(this.trapDoor.isClosed){
      this.collisionZeros[1] = 'a';
      this.collisionZeros[8] = 'a';
    }
    else if(this.trapDoor.opening || this.trapDoor.closing){
      this.collisionZeros[1] = 'a';
      this.collisionZeros[8] = this.collisionZero8;

    }
    else{
      this.collisionZeros[1] = this.collisionZero1;
      this.collisionZeros[8] = this.collisionZero8;
    }

  }
  updateDisplace(){
    this.pos.x += this.displace.x;
    this.pos.y += this.displace.y;
    this.displace.x = 0;
    this.displace.y = 0;
  }

  applyTorque(){
    if(!(Math.abs(this.torque) < .03)){
      var v = new Vector(this.points[1].x - this.points[0].x, this.points[1].y - this.points[0].y);
      this.forward = v.unit();
      v.y += this.torque;
      v = v.unit();
      var rot = Math.acos(v.dot(this.forward));
      if(this.torque < 0)
        rot *= -1;
      this.rotate(rot,true);
      this.forwardMove.x = this.turn * this.forward.x * 15;
      this.forwardMove.y = this.turn * this.forward.y * 15;
    }
  }

  orbit(){
    if(!this.inOrbit){
      this.tangent = new Vector(-this.turn * (this.planet.pos.y - this.pos.y), this.turn * (this.planet.pos.x - this.pos.x)).unit();
      var now = new Vector(this.turn * (this.points[1].x - this.points[0].x), this.turn * (this.points[1].y - this.points[0].y)).unit();
      this.rotOG = Math.acos(this.tangent.dot(now));
      if(now.y > 0 && now.y  > this.turn * now.x){
        if(this.turn * (this.tangent.x - now.x) < 0){
          this.grapple.detach();
        }
      }

      else if(now.y < 0 && -now.y  > this.turn * now.x){
        if(this.turn * (this.tangent.x - now.x) > 0){
          this.grapple.detach();
        }
      }

      else if(this.tangent.y - now.y > 0){
        this.grapple.detach();
      }
    }
    if(!this.justGrappled){
      this.doOrbit();
    }
    else if(this.planet){
      this.getIntoOrbit(this.rotOG);
      this.inOrbit = true;
    }
  }
  doOrbit(){
    this.tangent = new Vector(-this.turn * (this.planet.pos.y - this.pos.y), this.turn * (this.planet.pos.x - this.pos.x)).unit();
    var now = new Vector(this.turn * (this.points[1].x - this.points[0].x), this.turn * (this.points[1].y - this.points[0].y)).unit();
    var rot = Math.acos(this.tangent.dot(now));
        if(this.continueGrapple && this.direction < -this.turn * CONSTANTS.PI + .1 && this.direction > -this.turn * CONSTANTS.PI - .1){
          this.continued = true;        
        }
        if(!this.continueGrapple && this.direction < -this.turn * CONSTANTS.PI + .1 && this.direction > -this.turn * CONSTANTS.PI - .1){
            this.grapple.detach();
            this.flip();
        }
        else if(this.continued && this.direction <  .1 && this.direction >  -.1){
          this.grapple.detach();
          this.continued = false;
          this.cannon1.rotateBarellTo(0);
          this.cannonLower1.rotateBarellTo(2);
          this.cannonLower2.rotateBarellTo(CONSTANTS.PI - 2);
        }
        else{
          this.rotate(-this.turn * rot,true);
          this.forwardMove.x = this.tangent.x * 15;
          this.forwardMove.y = this.tangent.y * 15;
        }
  }
  getIntoOrbit(rot){
    this.tangent = new Vector(-this.turn * (this.planet.pos.y - this.pos.y), this.turn * (this.planet.pos.x - this.pos.x)).unit();
    this.rotate(-this.turn * rot/60,true);
    this.forwardMove.x = this.tangent.x * 0;
    this.forwardMove.y = this.tangent.y * 0;
    this.rotOGCounter +=1;
    if(this.rotOGCounter == 60){
      this.justGrappled = false;
    }
  }
  flip(){
    this.rotate(this.turn * CONSTANTS.PI);
    for(var id in this.hasBlocks){
      this.hasBlocks[id].pos.y -= (this.hasBlocks[id].pos.y - this.pos.y) * 2;
      this.hasBlocks[id].pos.x -= (this.hasBlocks[id].pos.x - this.pos.x) * 2;

      if(this.hasBlocks[id].hasTop){
        for(var id2 in this.hasBlocks[id].hasTop){
            this.hasBlocks[id].hasTop[id2].pos.y -= (this.hasBlocks[id].hasTop[id2].pos.y - this.pos.y) * 2;
            this.hasBlocks[id].hasTop[id2].pos.x -= (this.hasBlocks[id].hasTop[id2].pos.x - this.pos.x) * 2;
        }
      }
    }
    for(var id in this.hasPlayers){
      this.hasPlayers[id].pos.y -= (this.hasPlayers[id].pos.y - this.pos.y) * 2;
      this.hasPlayers[id].pos.x -= (this.hasPlayers[id].pos.x - this.pos.x) * 2;    

      if(this.hasPlayers[id].hasTop){
        for(var id2 in this.hasPlayers[id].hasTop){
            this.hasPlayers[id].hasTop[id2].pos.y -= (this.hasPlayers[id].hasTop[id2].pos.y - this.pos.y) * 2;
            this.hasPlayers[id].hasTop[id2].pos.x -= (this.hasPlayers[id].hasTop[id2].pos.x - this.pos.x) * 2;
        }
      }
    }
    this.turn *= -1;
  }
  applyFriction(vec){
    this.friction.x = vec.x;
    this.friction.y = vec.y;
  }
  get realPoints(){
    var real = [];
    for(var i = 0; i<this.points.length; i++){
      real.push(new Vector(this.points[i].x + this.pos.x, this.points[i].y + this.pos.y));
    }
    return real;
  }

  distanceTo(player){
  return Math.sqrt((this.pos.x - player.pos.x) * (this.pos.x - player.pos.x) + (this.pos.y - player.pos.y) * (this.pos.y - player.pos.y));
  }
  withinRect(other,width,height){
    if(other.pos.x < this.pos.x + width && other.pos.x > this.pos.x - width && other.pos.y < this.pos.y + height && other.pos.y > this.pos.y - height)
      return true;
    return false;
  }  
  rotate(angle,doObjects){
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      super.rotate(angle,cos,sin);
      this.cannon1.rotateWire(angle,cos,sin);
      this.cannon1.rotateBarell(angle,cos,sin);
      this.cannonLower1.rotateBarell(angle,cos,sin);
      this.cannonLower2.rotateBarell(angle,cos,sin);
      this.telescope.rotateBarell(angle,cos,sin);
      this.trapDoor.rotate(angle,cos,sin);
      this.ladder.rotate(angle,cos,sin);
      this.mast.rotate(angle,cos,sin);
      this.platform.rotate(angle,cos,sin);
      this.flag.rotate(angle,cos,sin);
      for(var i = 0; i<this.collisionZeros.length;i++){
        if(this.collisionZeros[i] != 'a' && i != 1 && i != 8){
          var x = this.collisionZeros[i].x;
          var y = this.collisionZeros[i].y;
          this.collisionZeros[i].x = x * cos - y * sin;
          this.collisionZeros[i].y = y * cos + x * sin;
        }
      }
      var x = this.collisionZero1.x;
      var y = this.collisionZero1.y;
      this.collisionZero1.x = x * cos - y * sin;
      this.collisionZero1.y = y * cos + x * sin;
      
      var x = this.collisionZero8.x;
      var y = this.collisionZero8.y;
      this.collisionZero8.x = x * cos - y * sin;
      this.collisionZero8.y = y * cos + x * sin;

      for(var i = 0; i<this.damages.length;i++){
          var x = this.damages[i].point.x;
          var y = this.damages[i].point.y;
          this.damages[i].point.x = x * cos - y * sin;
          this.damages[i].point.y = y * cos + x * sin;
      }

      for(var i = 0; i<this.trapDoor.collisionZeros.length;i++){
        if(this.trapDoor.collisionZeros[i] != 'a'){
          var x = this.trapDoor.collisionZeros[i].x;
          var y = this.trapDoor.collisionZeros[i].y;
          this.trapDoor.collisionZeros[i].x = x * cos - y * sin;
          this.trapDoor.collisionZeros[i].y = y * cos + x * sin;
        }

        for(var i = 0; i<this.platform.collisionZeros.length;i++){
          if(this.platform.collisionZeros[i] != 'a'){
            var x = this.platform.collisionZeros[i].x;
            var y = this.platform.collisionZeros[i].y;
            this.platform.collisionZeros[i].x = x * cos - y * sin;
            this.platform.collisionZeros[i].y = y * cos + x * sin;
          }
        }
        var x = this.namePoint.x;
        var y = this.namePoint.y;
        this.namePoint.x = x * cos - y * sin;
        this.namePoint.y = y * cos + x * sin;

      }
    if(doObjects){
      for(var id in this.hasPlayers){
        var d = new Vector(this.hasPlayers[id].pos.x - this.pos.x, this.hasPlayers[id].pos.y - this.pos.y);
        var dNew = new Vector(0,0);
        dNew.x = d.x * cos - d.y * sin;
        dNew.y = d.y * cos + d.x * sin;
        dNew.subtract(d);
        this.hasPlayers[id].pos.add(dNew);
      }
      for(var id in this.hasBlocks){
        var d = new Vector(this.hasBlocks[id].pos.x - this.pos.x, this.hasBlocks[id].pos.y - this.pos.y);
        var dNew = new Vector(0,0);
        dNew.x = d.x * cos - d.y * sin;
        dNew.y = d.y * cos + d.x * sin;
        dNew.subtract(d);
        this.hasBlocks[id].pos.add(dNew);
        if(this.hasBlocks[id].hasTop){
          for(var id2 in this.hasBlocks[id].hasTop){
            var d = new Vector( this.hasBlocks[id].hasTop[id2].pos.x - this.pos.x,  this.hasBlocks[id].hasTop[id2].pos.y - this.pos.y);
            var dNew = new Vector(0,0);
            dNew.x = d.x * cos - d.y * sin;
            dNew.y = d.y * cos + d.x * sin;
            dNew.subtract(d);
            this.hasBlocks[id].hasTop[id2].pos.add(dNew);
          }
        }
      }
    }
  }

  takeDamage(u,j,power){
    var o = j + 1;
    if(j == this.points.length - 1){
      o = 0;
    }
    var no = false;
    var surface = new Vector(this.points[o].x - this.points[j].x, this.points[o].y - this.points[j].y);
    if(j == 9 || j == 13){
      u = .5;
    }
    else{
      if(Math.abs(this.points[j].x + (surface.x) * u - this.points[j].x) < 10){
        var signX = this.points[o].x - this.points[j].x > 0 ? 1 : -1;
        u = 1 - ((this.points[o].x - (this.points[j].x + signX * 10))/surface.x); 
      }
      if(Math.abs(this.points[j].x + (surface.x) * u - this.points[o].x) < 10){
        var signX = this.points[o].x - this.points[j].x > 0 ? 1 : -1;
        u = ((this.points[o].x - signX * 10) - this.points[j].x)/surface.x; 
      }
  }
    var damage = new Vector(this.points[j].x +(surface.x) * u, this.points[j].y + (surface.y) * u);
    this.explosions[this.explosionID] = new Explosion(this.pos.x + damage.x, this.pos.y + damage.y,power,surface,damage,this,this.explosionID);
    this.explosionID += 'a';

    for(var i = 0; i < this.damages.length; i++){
      if(damage.x < this.damages[i].point.x + 20 && damage.x > this.damages[i].point.x - 20 && damage.y < this.damages[i].point.y + 20 && damage.y > this.damages[i].point.y - 20){
        this.damages[i].health -= power;
        if(this.damages[i].health < 0)
          this.damages[i].health = 0;
        no = true;
      }
    }
    if(!no){
      this.damages.push({point : damage, surface : j, health : 190- power});
      }
  }

  serializeForUpdate() {
  return {
    id: this.id,
    x : this.pos.x,
    y : this.pos.y,
    col : this.isCol,
    points: this.points
  };
  }
}