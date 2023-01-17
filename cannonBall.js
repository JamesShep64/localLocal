import Vector from "./2Dvector";
import { Explosion } from "./explosion";
import { Polygon } from "./polygon";

export class CannonBall extends Polygon{
    constructor(x,y,vec,team, power,ship){
        super([new Vector(0,-20), new Vector(20,0), new Vector(0,20), new Vector(-20,0)]);
        this.pos = new Vector(x, y);
        this.team = team;
        this.power = power;
        this.radius = 20;
        //movement
        this.gvel = new Vector(0,0);
        this.gravity = new Vector(0,10);
        this.netVelocity = new Vector(0,0);
        this.shootVel = new Vector(vec.x * power, vec.y * power);
        this.shipVel = new Vector(ship.netVelocity.x,ship.netVelocity.y);
    }

    update(dt){        
        //APPLY GRAVITY
        this.gvel.x += dt * this.gravity.x;
        this.gvel.y += dt * this.gravity.y;
        if(this.gvel.magnatude() > 300){
        this.gvel.y = 300;
        }

        //APPLY VELOCITIES
        this.netVelocity.x = this.gvel.x + this.shootVel.x + this.shipVel.x;
        this.netVelocity.y = this.gvel.y + this.shootVel.y + this.shipVel.y;
        this.pos.x += dt * this.netVelocity.x;
        this.pos.y += dt * this.netVelocity.y;
    }

    distanceTo(player){
        return Math.sqrt((this.pos.x - player.pos.x) * (this.pos.x - player.pos.x) + (this.pos.y - player.pos.y) * (this.pos.y - player.pos.y));
    }
    
    withinRect(other,width,height){
        if(other.pos.x < this.pos.x + width && other.pos.x > this.pos.x - width && other.pos.y < this.pos.y + height && other.pos.y > this.pos.y - height)
          return true;
        return false;
      }  

    get realPoints(){
        var real = [];
        for(var i = 0; i<4; i++){
          real.push(new Vector(this.points[i].x + this.pos.x, this.points[i].y + this.pos.y));
        }
        return real;
      }

}