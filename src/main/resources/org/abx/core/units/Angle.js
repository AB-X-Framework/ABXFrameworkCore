/**
 * Angle are valid metric unit
 */
let angle;
enableSIAngle=function(global?: Boolean) {
    angle=new BaseUnit("angle", [{
        "name": "rad",
        "magnitude": 180/π
    }, {
        "name": "deg",
        "magnitude": 1
    }], global);
}