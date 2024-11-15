package org.abx.core.framework;

import org.graalvm.polyglot.Value;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class GridJava {
    public final Value[][] patches;
    public final int wValue;
    public final int hValue;
    public final boolean horizontalLimit;
    public final boolean verticalLimit;

    public GridJava(int w, int h, boolean horizontalLimit, boolean verticalLimit) {
        wValue = w;
        hValue = h;
        patches = new Value[h][w];
        this.horizontalLimit = horizontalLimit;
        this.verticalLimit = verticalLimit;
    }

    /**
     * @param x
     * @param mod
     * @return
     */
    public int positiveModule(int x, int mod) {
        if (x >= mod) {
            return x % mod;
        } else if (x < 0) {
            //Cover weird JS case with small values like -6.38378239159465e-16
            return ((x % mod) + mod) % mod;
        } else {
            return x;
        }
    }

    /**
     * @param x
     * @return
     */
    public boolean checkX(int x) {
        if (horizontalLimit && (x >= wValue || x < 0)) {
            return false;
        }
        return true;
    }

    /**
     * @param y
     * @return
     */
    public boolean checkY(int y) {
        if (verticalLimit && (y >= hValue || y < 0)) {
            return false;
        }
        return true;
    }

    /**
     * @param x
     * @param y
     * @return
     */
    public boolean checkXY(int x, int y) {
        if (horizontalLimit && (x >= wValue || x < 0)) {
            return false;
        }
        if (verticalLimit && (y >= hValue || y < 0)) {
            return false;
        }
        return true;
    }

    /**
     * @param x
     * @return
     */
    public int validateXImpl(int x) {
        return positiveModule(x, this.wValue);
    }

    /**
     * @param y
     * @return
     */
    public int validateYImpl(int y) {
        return positiveModule(y, this.hValue);
    }

    /**
     * Return the moore neighborhood
     *
     * @param xValue
     * @param yValue
     * @param length
     * @returns {[]}
     */
    public ArrayList<Value> moore(int xValue, int yValue, int length, boolean notSelf) {
        ArrayList<Value> results = new ArrayList<>();
        for (int x = xValue - length; x <= xValue + length; ++x) {
            if (!checkX(x)) {
                continue;
            }
            int xImpl = this.validateXImpl(x);
            boolean sameX = xImpl == xValue;
            for (int y = yValue - length; y <= yValue + length; ++y) {
                if (checkY(y)) {
                    int yImpl = validateYImpl(y);
                    if (notSelf && sameX && yImpl == yValue) {
                        continue;
                    }
                    results.add(patches[yImpl][xImpl]);
                }
            }
        }
        return results;
    }

    /**
     *
     * @param xValue
     * @param yValue
     * @param length
     * @param notSelf
     * @param fx
     */
    public void eachMoore(int xValue, int yValue, int length, boolean notSelf,Value fx) {
        for (int x = xValue - length; x <= xValue + length; ++x) {
            int xImpl = x+xValue;
            if (!checkX(xImpl)) {
                continue;
            }
            xImpl = this.validateXImpl(xImpl);
            boolean sameX = xImpl == xValue;
            for (int y = yValue - length; y <= yValue + length; ++y) {
                if (checkY(y)) {
                    int yImpl = validateYImpl(y);
                    if (notSelf && sameX && yImpl == yValue) {
                        continue;
                    }
                    fx.execute(patches[yImpl][xImpl]);
                }
            }
        }
    }

    /**
     * @param xValue
     * @param yValue
     * @param length
     * @param notSelf
     * @return
     */
    public ArrayList<Value> VonNeuman(int xValue, int yValue, int length, boolean notSelf) {
        ArrayList<Value> results = new ArrayList<>();
        for (int x = -length; x <= length; ++x) {
            int xImpl = x+xValue;
            if (!checkX(xImpl)) {
                continue;
            }
            xImpl = this.validateXImpl(xImpl);
            boolean sameX = xImpl == xValue;
            int VonNeumanValue = length - (Math.abs(x));
            int maxValue = yValue + VonNeumanValue;
            for (int y = yValue - VonNeumanValue; y <= maxValue; ++y) {
                if (checkY(y)) {
                    int yImpl = this.validateYImpl(y);
                    if (notSelf && sameX && yImpl == yValue) {
                        continue;
                    }
                    results.add(patches[yImpl][xImpl]);
                }
            }
        }
        return results;
    }

    /**
     *
     * @param xValue
     * @param yValue
     * @param length
     * @param notSelf
     * @param fx
     */
    public void eachVonNeumann(int xValue, int yValue, int length, boolean notSelf,Value fx) {
        for (int x = -length; x <= length; ++x) {
            int xImpl = x+xValue;
            if (!checkX(xImpl)) {
                continue;
            }
            xImpl = this.validateXImpl(xImpl);
            boolean sameX = xImpl == xValue;
            int VonNeumanValue = length - (Math.abs(x));
            int maxValue = yValue + VonNeumanValue;
            for (int y = yValue - VonNeumanValue; y <= maxValue; ++y) {
                if (checkY(y)) {
                    int yImpl = this.validateYImpl(y);
                    if (notSelf && sameX && yImpl == yValue) {
                        continue;
                    }
                    fx.execute(patches[yImpl][xImpl]);
                }
            }
        }
    }

    /**
     *
     * @param agX
     * @param agY
     * @param radius
     * @return
     */
    public ArrayList<Value> patchesInRadius(double agX, double agY, double radius) {
        double max_radius = radius * 1.42;
        double radiusSqr = radius * radius;
        ArrayList<Value> results = new ArrayList<>();
        int length = (int) Math.ceil(radius+1);
        int xValue = (int) agX;
        int yValue = (int) agY;
        for (int xImpl = xValue - length, x = -length; x <= length; ++xImpl, ++x) {
            if (!this.checkX(xImpl)) {
                continue;
            }
            xImpl = this.validateXImpl(xImpl);
            for (int yImpl = yValue - length, y = -length; y <= length; ++yImpl, ++y) {
                if (this.checkY(yImpl)) {
                    yImpl = this.validateYImpl(yImpl);
                    //First case Von Newman
                    int absX = Math.abs(x);
                    int absY = Math.abs(y);
                    if (absX + absY <= radius) {
                        results.add(patches[yImpl][xImpl]);
                    } else if (absX + absY < max_radius) {
                        double distToPatchSqr = x * x + y * y;
                        if (distToPatchSqr <= radiusSqr) {
                            results.add(patches[yImpl][xImpl]);
                        }
                    }
                }
            }
        }
        return results;
    }

    /**
     *
     * @param agX
     * @param agY
     * @param radius
     * @param fx
     * @return
     */
    public void eachPatchInRadius(double agX, double agY, double radius, Value fx) {
        double max_radius = radius * 1.42;
        double radiusSqr = radius * radius;
        int length = (int) Math.ceil(radius);
        int xValue = (int) agX;
        int yValue = (int) agY;
        int maxX = xValue + length;
        int maxY = yValue + length;
        for (int xImpl = xValue - length, x = -length; x <= length; ++xImpl, ++x) {
            if (!this.checkX(xImpl)) {
                continue;
            }
            xImpl = this.validateXImpl(xImpl);
            for (int yImpl = yValue - length, y = -length; y <= length; ++yImpl, ++y) {
                if (this.checkY(yImpl)) {
                    yImpl = this.validateYImpl(yImpl);
                    //First case Von Newman
                    int absX = Math.abs(x);
                    int absY = Math.abs(y);
                    if (absX + absY <= radius) {
                        fx.execute(patches[yImpl][xImpl]);
                    } else if (absX + absY < max_radius) {
                        double distToPatchSqr = x * x + y * y;
                        if (distToPatchSqr <= radiusSqr) {
                            fx.execute(patches[yImpl][xImpl]);
                        }
                    }
                }
            }
        }
    }

    public ArrayList<Value> mooreEdge(int xValue, int yValue, int length) {
        ArrayList<Value>  results = new ArrayList<Value> ();
        int yValueInit = yValue - length;
        int yValueEnd = yValue + length;
        for (int x = xValue - length; x <= xValue + length; ++x) {
            int xImpl = this.validateXImpl(x);
            if (checkXY(x, yValueInit)) {
                int yImpl = this.validateYImpl(yValueInit);
                results.add(patches[yImpl][xImpl]);
            }
            if (checkXY(x, yValueEnd)) {
                int yImpl= validateYImpl(yValueEnd);
                results.add(patches[yImpl][xImpl]);
            }
        }
        int xValueInit =xValue - length;
        int xValueEnd = xValue + length;
        for (int y = yValue - length + 1; y < yValue + length; ++y) {
            int yImpl = this.validateYImpl(y);
            if (checkXY(xValueInit, y)) {
                int xImpl = this.validateXImpl(xValueInit);
                results.add(patches[yImpl][xImpl]);
            }
            if (checkXY(xValueEnd, y)) {
                int xImpl = this.validateXImpl(xValueEnd);
                results.add(patches[yImpl][xImpl]);
            }
        }
        return results;
    }

    public void eachMooreEdge(int xValue, int yValue, int length,Value fx) {
        int yValueInit = yValue - length;
        int yValueEnd = yValue + length;
        for (int x = xValue - length; x <= xValue + length; ++x) {
            int xImpl = this.validateXImpl(x);
            if (checkXY(x, yValueInit)) {
                int yImpl = this.validateYImpl(yValueInit);
                fx.execute(patches[yImpl][xImpl]);
            }
            if (checkXY(x, yValueEnd)) {
                int yImpl= validateYImpl(yValueEnd);
                fx.execute(patches[yImpl][xImpl]);
            }
        }
        int xValueInit =xValue - length;
        int xValueEnd = xValue + length;
        for (int y = yValue - length + 1; y < yValue + length; ++y) {
            int yImpl = this.validateYImpl(y);
            if (checkXY(xValueInit, y)) {
                int xImpl = this.validateXImpl(xValueInit);
                fx.execute(patches[yImpl][xImpl]);
            }
            if (checkXY(xValueEnd, y)) {
                int xImpl = this.validateXImpl(xValueEnd);
                fx.execute(patches[yImpl][xImpl]);
            }
        }
    }

    public void impPatches(double agX, double agY, double radius, Value fullIn, Value check) {
        double max_radius = radius * 1.42;
        double radiusSqr = radius * radius;
        int length = (int) Math.ceil(radius);
        int xValue = (int) agX;
        int yValue = (int) agY;
        int maxX = xValue + length;
        int maxY = yValue + length;
        for (int xImpl = xValue - length, x = -length; x <= length; ++xImpl, ++x) {
            if (!this.checkX(xImpl)) {
                continue;
            }
            xImpl = this.validateXImpl(xImpl);
            for (int yImpl = yValue - length, y = -length; y <= length; ++yImpl, ++y) {
                if (this.checkY(yImpl)) {
                    yImpl = this.validateYImpl(yImpl);
                    //First case Von Newman
                    int absX = Math.abs(x);
                    int absY = Math.abs(y);
                    if (absX + absY <= radius) {
                        fullIn.execute(patches[yImpl][xImpl]);
                    } else if (absX + absY < max_radius) {
                        check.execute(patches[yImpl][xImpl]);
                    }
                }
            }
        }
    }

}
