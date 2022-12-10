import Vector from "./2Dvector";
import { Polygon } from "./polygon";
import { CONSTANTS } from "./constants";
export class Ladder extends Polygon{
    constructor(ship,points){
        super(points);
        this.ship = ship;
        this.pos = ship.pos;
        this.floor = [];
        this.repeats1 = [];
        this.repeats2 = [];
    }

    update(dt){

    }

    rotate(angle,cos,sin){
        if(typeof angle == 'number' && cos && angle!=0){
            for(var i = 0; i <this.points.length;i++){
                var x = this.points[i].x;
                var y = this.points[i].y;
                this.points[i].x = x * cos - y * sin;
                this.points[i].y = y * cos + x * sin;
            }
            this.direction += angle;
            this.direction %= 2 * CONSTANTS.PI;
        }
    }

    get realPoints(){
        var real = [];
        for(var i = 0; i<4; i++){
          real.push(new Vector(this.points[i].x + this.pos.x, this.points[i].y + this.pos.y));
        }
        return real;
      }
}