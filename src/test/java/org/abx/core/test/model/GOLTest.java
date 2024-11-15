 package org.abx.core.test.model;

 import org.itcr.msc.thesis.abm.ABMFrameworkCore;
 import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
 import org.junit.jupiter.api.Test;

 public class GOLTest {

     @Test
     void modelTest3() throws Exception {
         new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                 "src/test/java/org/itcr/msc/thesis/abm/test/model/GameOfLife.js");
     }
 }
