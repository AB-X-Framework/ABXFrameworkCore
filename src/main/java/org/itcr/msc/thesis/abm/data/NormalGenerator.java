package org.itcr.msc.thesis.abm.data;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import org.itcr.msc.thesis.abm.math.MersenneTwisterFast;

import java.util.Random;

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
