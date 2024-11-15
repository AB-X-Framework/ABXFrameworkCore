/**
 * Distance in metric system
 */
let distance;
    enableSIDistance=function(global?: Boolean) {
    distance=new BaseUnit("distance", [{
        "name":"AU",
        "magnitude":149.5978
    },{
        "name": "Gm",
        "magnitude": 1000
    },{
        "name": "Mm",
        "magnitude": 1000
    },{
        "name": "km",
        "magnitude": 10
    }, {
        "name": "hm",
        "magnitude": 10
    }, {
        "name": "dam",
        "magnitude": 10
    }, {
        "name": "m",
        "magnitude": 10
    }, {
        "name": "dm",
        "magnitude": 10
    }, {
        "name": "cm",
        "magnitude": 10
    }, {
        "name": "mm",
        "magnitude": 1
    }], global);
}