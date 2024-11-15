package org.abx.core.data;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import org.abx.core.math.MersenneTwisterFast;

/**
 *
 * @author Luis Carlos Lara Lopez
 */
public class NormalGenerator {
    MersenneTwisterFast rnd;
    public NormalGenerator(MersenneTwisterFast f){
        rnd = f;
    }
    public double next(double mean, double stdDev){
        return rnd.nextGaussian()*stdDev + mean;
    }
}
