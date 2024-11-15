/**
 * A class to model time limited strokes
 */
class ABMStroke {
    layer; //The layer of the stroke
    color;//The color of the stroke
    width;//The width of the stroke
    aliveStrokeSteps; //The time to keep this stroke, once it reaches 0 it is removed
    points; //The original points
    scaled; //The scaled points
    currScale;//The current scale for scaled points

    constructor(layer: String, pen: ABMPen, aliveStrokeSteps: Number, init, vector: ComplexClass) {
        this.layer = layer;
        this.color = pen.color;
        this.width = imgClient.createStroke(pen.width);
        this.aliveStrokeSteps = aliveStrokeSteps;
        if (vector.r >= 0) {
            this.points = [init.x, init.y, init.x+ vector.r, init.y + vector.i];
        } else {
            this.points = [init.x + vector.r, init.y + vector.i, init.x, init.y];
        }
        this.currScale = 0;
    }

    setScale(scale: Number, hPixels: Number) {
        if (scale === this.currScale) {
            return;
        }
        this.currScale = scale;
        this.scaled = [this.points[0] * scale,
            hPixels - (this.points[1] * scale),
            this.points[2] * scale,
            hPixels - (this.points[3] * scale)];
    }
}