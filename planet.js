import Vector from "./2Dvector";
import { Polygon } from "./polygon";

export class Planet extends Polygon{
    constructor(x,y){
        super([new Vector(0, -60), new Vector(60, 0), new Vector(0, 60), new Vector(-60,0)]);
        this.pos = new Vector(x,y);
        this.radius = 60;
        this.repeats1 = [2,3];
        this.repeats2 = [0,1];
    }

    get realPoints(){
        var real = [];
        for(var i = 0; i<4; i++){
          real.push(new Vector(this.points[i].x + this.pos.x, this.points[i].y + this.pos.y));
        }
        return real;
    }
    withinRect(other,width,height){
        if(other.pos.x < this.pos.x + width && other.pos.x > this.pos.x - width && other.pos.y < this.pos.y + height && other.pos.y > this.pos.y - height)
          return true;
        return false;
      }  
}