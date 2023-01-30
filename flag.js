import { Polygon } from "./polygon";
import Vector from "./2Dvector"
export class Flag extends Polygon{
    constructor(ship,name,color,points){
        super([new Vector(70,-140),new Vector(140,-140),new Vector(140,-90), new Vector(70,-90)]);
        this.ship = ship;
        this.name = name;
        this.color = color;
        this.pos = ship.pos;
    }
}