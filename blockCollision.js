import Vector from "./2Dvector";
function vectorCollision(zero1, vec1, zero2, vec2){
    var h = vec1.x * vec2.y - vec1.y * vec2.x;
    var t = (zero2.x - zero1.x) * vec2.y - (zero2.y - zero1.y) * vec2.x;
    t/=h;

    var u = (zero2.x - zero1.x) * vec1.y - (zero2.y - zero1.y) * vec1.x;
    u/=h;

    return {t,u};
}
export function blockCollision(block1, block2){
    if(!block1.withinRect(block2,block1.radius + block2.radius,block1.radius + block2.radius))
        return false;
    if(block1.distanceTo(block2)>block1.radius + block2.radius)
        return false;
    var firstCol;
    var floor = block2.floor;
    var repeats1 = block2.repeats1;
    var repeats2 = block2.repeats2;
    for(var i = 0; i < 2; i++){
        var zero1 = block1.pos;
        var vec1 = block1.points[i];
        for(var j = 0; j < block2.points.length; j++){
            var zero2 = block2.realPoints[j];
            var o = j+1;
            if(o == block2.points.length){
                o = 0;
            }
            var vec2 = new Vector(block2.realPoints[o].x - zero2.x, block2.realPoints[o].y - zero2.y);
            var {t,u} = vectorCollision(zero1, vec1, zero2, vec2);

            if(t > -1 && t < 1 && u >= 0 && u < 1){
                var mult = 1;
                if(t < 0){
                    mult = -1;
                    t = Math.abs(t);
                }
                if(floor.indexOf(j) != -1 && block1.constructor.name == 'PlayerObject')
                    t += .05;
                var push = new Vector(1 - t, 1 - t);
                push.multiply(new Vector(mult, mult));
                push.multiply(vec1);
                push.multiply(new Vector(-1,-1));
                if(floor.indexOf(j) != -1){
                    firstCol = {push, vec2:vec2.unit(), i};
                }
                else{
                firstCol = {push, t, vec2:false};
                }
            }
        }
    }
    
    for(var i = 0; i < block2.points.length; i++){
        var zero1 = block2.pos;
        var vec1 = block2.points[i];
        if(repeats2.indexOf(i) != -1){
            continue;
        }
        for(var j = 0; j < 4; j++){
            var zero2 = block1.realPoints[j];
            var o = j+1;
            if(j == 3){
                o = 0;
            }
            var vec2 = new Vector(block1.realPoints[o].x - zero2.x, block1.realPoints[o].y - zero2.y);
            var {t,u} = vectorCollision(zero1, vec1, zero2, vec2);
            if(repeats1.indexOf(i) != -1){
                if(t > -1 && t < 1 && u >= 0 && u < 1){
                    var mult = 1;
                    if(t < 0){
                        mult = -1;
                        t = Math.abs(t);
                    }
                    var push = new Vector(1 - t, 1 - t);
                    push.multiply(new Vector(mult, mult));
                    push.multiply(vec1);
                    if(!firstCol){
                        return {push,t,vec2:false};
                    }
                    if(firstCol.t > t){
                    return {push, t,vec2:false};
                    }
                    else{
                        return firstCol;
                    }
                }
            }
            else{
                if(t > 0 && t < 1 && u >= 0 && u < 1){
                    var push = new Vector(1 - t, 1 - t);
                    push.multiply(vec1);
                    if(!firstCol){
                        return {push,t,vec2:false};
                    }
                    if(firstCol.t > t){
                    return {push, t,vec2:false};
                    }
                    else{
                        return firstCol;
                    }
                }
            }
        }
    }
    return firstCol;
}