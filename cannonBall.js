import Vector from "./2Dvector";

export class CannonBall{
    constructor(x,y,vec,ship){
        this.pos = new Vector(x, y);
        this.radius = 20;
        //movement
        this.gvel = new Vector(0,0);
        this.gravity = new Vector(0,10);
        this.netVelocity = new Vector(0,0);
        this.shootVel = new Vector(vec.x * 80, vec.y * 80);
        this.shipVel = new Vector(ship.netVelocity.x,ship.netVelocity.y);
    }

    update(dt){
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

}