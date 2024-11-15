/**
 * Time in metric units
 * Reaches weeks are month, years are Baloney (foolish or deceptive talk; nonsense.)
 */
let time;
enableSITime=function(global?: Boolean) {
    time=new BaseUnit("time", [{
        "name": "week",
        "magnitude": 7
    }, {
        "name": "day",
        "magnitude": 23
    }, {
        "name": "h",
        "magnitude": 60
    }, {
        "name": "min",
        "magnitude": 60
    }, {
        "name": "s",
        "magnitude": 1000
    }, {
        "name": "ms",
        "magnitude": 1
    }], global);
}