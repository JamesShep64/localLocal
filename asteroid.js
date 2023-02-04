import Vector from "./2Dvector";

export class Asteroid{
    constructor(id,start,line){
        this.id = id;
        this.line = line;
        this.start = new Vector(start.x,start.y);
        this.radius = Math.round(10 + Math.random() * 15);
        this.t = Math.round(Math.random() * 100)/100;
        this.pos = new Vector(0,0);
        this.netVelocity = new Vector(0,0);
        this.pos.x = this.start.x + this.line.x;
        this.pos.y = this.start.y + this.line.y;
        this.mag = this.line.magnatude();
        if(this.t > .5){this.turn = -1;}
        else{this.turn = 1;}
    }

    update(dt){
        if(this.t > 1 || this.t < 0){
            this.turn *= -1;
        }
        this.t +=  (this.turn * 2)/this.mag;
        this.netVelocity.x = (this.start.x +  this.t * this.line.x - this.pos.x)/dt;
        this.netVelocity.y = (this.start.y +  this.t * this.line.y - this.pos.y)/dt;
        this.pos.x = this.start.x +  this.t * this.line.x;
        this.pos.y = this.start.y +  this.t * this.line.y;

    }
}