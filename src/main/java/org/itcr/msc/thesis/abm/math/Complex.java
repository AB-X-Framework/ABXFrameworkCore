package org.itcr.msc.thesis.abm.math;


public class Complex {

    private final static double TWO_PI = Math.PI * 2;

    private double real;
    private double im;
    private double mag;
    private double angleRad;
    private boolean cartesian;
    private boolean polar;


    private Complex(double real, double im, boolean cartesian, double mag, double angleRad, boolean polar) {
        this.real = real;
        this.im = im;
        this.cartesian = cartesian;
        this.mag = mag;
        this.angleRad = angleRad;
        this.polar = polar;
    }

    public static Complex polar(double mag, double rad) {
        Complex complex = new Complex(0, 0, false, mag, rad, true);
        return complex;
    }

    public static Complex complex(double r, double i) {
        Complex complex = new Complex(r, i, true, 0, 0, false);
        return complex;
    }

    private void toCartesian() {
        if (!cartesian) {
            double cos = Math.cos(angleRad);
            double res = mag * cos;
            real = res;
            im = mag * Math.sin(angleRad);
            cartesian = true;
        }
    }

    private void toPolar() {
        if (!polar) {
            if (real == 0 && im == 0) {
                mag = 0;
                angleRad = 0;
            } else {
                mag = Math.sqrt(real * real + im * im);
                angleRad = Math.atan2(im, real);
            }
            polar = true;
        }
    }

    public Complex add(Complex other) {
        toCartesian();
        other.toCartesian();
        return new Complex(
                real + other.real,
                im + other.im, true, 0, 0, false);
    }

    public Complex add(double other) {
        toCartesian();
        return new Complex(
                real + other,
                im, true, 0, 0, false);
    }

    public Complex multiply(Complex other) {
        toCartesian();
        other.toCartesian();
        return new Complex(
                real * other.real - im * other.im,
                real * other.im + im * other.real, true, 0, 0, false);

    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Complex)) {
            return false;
        }
        Complex otherComplex = (Complex) other;

        if (cartesian && otherComplex.cartesian) {
            return real == otherComplex.real && im == otherComplex.im;
        }
        toPolar();
        otherComplex.toPolar();
        return mag == otherComplex.mag && angleRad == otherComplex.angleRad;
    }

    public Complex substract(Complex other) {
        toCartesian();
        other.toCartesian();
        return new Complex(
                real - other.real,
                im - other.im, true, 0, 0, false);
    }


    public Complex substract(double other) {
        toCartesian();
        return new Complex(
                real - other,
                im, true, 0, 0, false);
    }

    public Complex scale(double factor) {
        toPolar();
        return new Complex(0,0,false,mag * factor, angleRad, true);
    }

    public double angleRad() {
        toPolar();
        if (angleRad < 0){
            angleRad = (angleRad%TWO_PI)+TWO_PI;
        }else if (angleRad > TWO_PI){
            angleRad = angleRad%TWO_PI;
        }
        return angleRad;
    }


    public double mag() {
        toPolar();
        return mag;
    }

    public double r() {
        toCartesian();
        return real;
    }

    public double i() {
        toCartesian();
        return im;
    }

    public Complex normalize() {
        toPolar();
        return new Complex(0, 0, false, 1, angleRad, true);
    }


    public Complex withMaxMag(double newMag) {
        toPolar();
        return new Complex(0, 0, false, Math.max(mag, newMag), angleRad, true);
    }

    public Complex withMag(double mag) {
        toPolar();
        return new Complex(0,0,false,mag, angleRad, true);
    }

    public Complex rotateRad(double deltaRad) {
        toPolar();
        return new Complex(0,0,false,mag, angleRad + deltaRad, true);
    }

    public boolean isReal() {
        if (cartesian){
            return im == 0;
        }else {
            return angleRad==0;
        }
    }


}
