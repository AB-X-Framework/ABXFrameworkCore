class Shape {
    constructor(color:String) {
        this.color = color;
    }

    provide():Shape {
        return this;
    }
}

class Circle extends Shape {
    constructor(color:String, radius:Number) {
        super(color);
        this.radius = radius;
    }

    provide():Shape {
        return this;
    }
}

new Shape("Red").provide()
new Circle("Red",1).provide()