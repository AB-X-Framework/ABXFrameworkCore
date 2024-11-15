/**
 * Basic class to handle a pen
 */
class ABMPen{
    color;
    width;

    /**
     * Constructor
     * @param color
     * @param width
     */
    constructor(color, width?:Number) {
        if (color !== undefined){
            this.color=color;
        }else {
            this.color = namedColor("black");
        }
        if (width !== undefined){
            this.width=width;
        }else {
            this.width = 1;
        }

    }
}