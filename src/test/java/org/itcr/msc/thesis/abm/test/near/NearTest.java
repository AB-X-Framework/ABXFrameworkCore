 package org.itcr.msc.thesis.abm.test.near;

 import org.itcr.msc.thesis.abm.ABMFrameworkCore;
 import org.itcr.msc.thesis.abm.ConsoleABMListener;
 import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
 import org.junit.jupiter.api.Test;

 public class NearTest {

     @Test
     void testNearInRadius() throws Exception {
         new ABMFrameworkCore(OptimizationLevel.standard).
                 addListener(new ConsoleABMListener()).processFile(
                 "src/test/java/org/itcr/msc/thesis/abm/test/near/NearTest.js");
     }

     @Test
     void inRadius() throws Exception {
         new ABMFrameworkCore(OptimizationLevel.standard).
                processFile(
                         "src/test/java/org/itcr/msc/thesis/abm/test/near/InRadius.js");


         new ABMFrameworkCore(OptimizationLevel.performance).
                 addListener(new ConsoleABMListener()).processFile(
                         "src/test/java/org/itcr/msc/thesis/abm/test/near/InRadius.js");
     }
 }
