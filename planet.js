import Vector from "./2Dvector";
import { Polygon } from "./polygon";

export class Planet{
    constructor(x,y){
        this.pos = new Vector(x,y);
        this.radius = 100;
        this.colBox = new Polygon([new Vector(0, -30), new Vector(30, 0), new Vector(0, 30), new Vector(-30,0)]);
    }
}