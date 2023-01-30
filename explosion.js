import Vector from "./2Dvector";

export class Explosion{
    constructor(x,y,power,surface,ship,id){
        this.pos = new Vector(x,y);
        this.id = id;
        this.radius = 10 + power/15;
        this.timer = 0;
        this.exist = true;
        this.hitboxExist = 0;
        this.ship = ship;
        this.surface = surface;
        this.netVelocity = new Vector(ship.netVelocity.x,ship.netVelocity.y);
    }

    update(dt){
        this.pos.x += dt * this.netVelocity.x;
        this.pos.y += dt * this.netVelocity.y;
        this.hitboxExist++;
        this.timer += dt;
        if(this.timer > 5){
            delete this.ship.explosions[this.id];
        }
    }
}