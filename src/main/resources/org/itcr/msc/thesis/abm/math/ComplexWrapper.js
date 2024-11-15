/**
 * Bg Overloading operators
 */
_zeroEpsilon = (x: Number)
:
Boolean => ε > Math.abs(x);

const ComplexOps = Operators({
        "neg"(a:ComplexClass):ComplexClass{
            return -1 * a;
        },
        "+"(a: ComplexClass, b: ComplexClass): ComplexClass | Number {
            return validateComplex(new ComplexClass(a.complex.add(b.complex)));
        },
        "-"(a: ComplexClass, b: ComplexClass): ComplexClass | Number {
            return validateComplex(new ComplexClass(a.complex.substract(b.complex)));
        },
        "*"(a: ComplexClass, b: ComplexClass): ComplexClass | Number {
            return validateComplex(new ComplexClass(a.complex.multiply(b.complex)));
        },
        "=="(a: ComplexClass, b: ComplexClass): Boolean {
            const value = (a - b);
            if (Object(value) instanceof Number) {
                return Math.abs(value) < ε
            } else {
                return Math.abs(value.mag) < ε;
            }
        }
    }, {
        right: Number,
        "*"(a, b: Number): ComplexClass | Number {
            return validateComplex(new ComplexClass(a.complex.scale(b)));
        }
    }, {
        left: Number,
        "*"(a: Number, b: ComplexClass): ComplexClass | Number {
            return validateComplex(new ComplexClass(b.complex.scale(a)));
        }
    }, {
        right: Number,
        "/"(a, b: Number): ComplexClass | Number {
            if (b === 0){
                throw "Division by 0";
            }
            return validateComplex(new ComplexClass(a.complex.scale(1/b)));
        }
    },  {
        right: Number,
        "+"(a: ComplexClass, b: Number): ComplexClass | Number {
            return validateComplex(new ComplexClass(a.complex.add(b)));
        }
    }, {
        left: Number,
        "+"(a: Number, b: ComplexClass): ComplexClass | Number {
            return validateComplex(new ComplexClass(b.complex.add(a)));
        }
    },
    {
        right: Number,
        "-"(a: ComplexClass, b: Number): ComplexClass | Number {
            return validateComplex(new ComplexClass(a.complex.substract(b)));
        }
    }, {
        left: Number,
        "-"(a: Number, b: ComplexClass): ComplexClass | Number {
            return validateComplex(new ComplexClass(b.complex.substract(a)));
        }
    }
);


class ComplexClass extends ComplexOps {
    complex;

    constructor(complex) {
        super();
        this.complex = complex;
    }

    rotateDeg(deg: Number): ComplexClass {
        return new ComplexClass(this.complex.rotateRad(toRad(deg)));
    }

    rotateRad(rad: Number): ComplexClass {
        return new ComplexClass(this.complex.rotateRad(rad));
    }

    normalize(): ComplexClass {
        return new ComplexClass(this.complex.normalize());
    }

    get mag(): Number {
        return this.complex.mag();
    }

    withMag(magValue: Number): ComplexClass {
        return Polar(magValue, this.angleRad);
    }

    get i(): Number {
        return this.complex.i();
    }

    get angleRad(): Number {
        return this.complex.angleRad();
    }

    get angleDeg(): Number {
        return toDeg(this.complex.angleRad());
    }

    get r(): Number {
        return this.complex.r();
    }

    withMaxMag(magValue: Number): ComplexClass {
        return Polar(Math.min(this.mag, magValue), this.angleRad);
    }


    toString(type): String {
        if (typeof type === "undefined" || type === im) {
            const iValue = this.i;
            const rValue = this.r;
            const iZero = _zeroEpsilon(iValue)
            const rZero = _zeroEpsilon(rValue)
            if (iZero && rZero) {
                return "0";
            }
            if (rZero) {
                if (iValue === 1) {
                    return "i";
                } else {
                    return iValue + "i";
                }
            } else if (iZero) {
                return rValue + "";
            } else if (iValue === 1) {
                return rValue + " + i";
            } else {
                return rValue + " +" + iValue + "i";
            }
        } else if (type === π) {
            return this.mag + "∠" + (this.angleRad / π) + "π (rad)";
        } else if (type === "rad") {
            return this.mag + "∠" + this.angleRad + " (rad)";
        } else if (type === "deg") {
            return this.mag + "∠" + this.angleDeg + " (deg)";
        }
    }
}

const Complex = function (r, i): ComplexClass {
    return new ComplexClass(ComplexUtils.static.complex(r, i));
}

const Polar = function (mag, angle): ComplexClass {
    return new ComplexClass(ComplexUtils.static.polar(mag, angle));
}

validateComplex = (complex: ComplexClass)
:
ComplexClass | Number
=>
{
    if (complex.complex.isReal()) {
        return complex.complex.r();
    } else {
        return complex;
    }
}

im = Complex(0, 1, false);