 package org.abx.core.test.near;

 import org.abx.core.ABMFrameworkCore;
 import org.abx.core.ConsoleABMListener;
 import org.abx.core.syntax.OptimizationLevel;
 import org.junit.jupiter.api.Test;

 public class NearTest {

     @Test
     void testNearInRadius() throws Exception {
         new ABMFrameworkCore(OptimizationLevel.standard).
                 addListener(new ConsoleABMListener()).processFile(
                 "src/test/java/org/abx/core/test/near/NearTest.js");
     }

     @Test
     void inRadius() throws Exception {
         new ABMFrameworkCore(OptimizationLevel.standard).
                processFile(
                         "src/test/java/org/abx/core/test/near/InRadius.js");


         new ABMFrameworkCore(OptimizationLevel.performance).
                 addListener(new ConsoleABMListener()).processFile(
                         "src/test/java/org/abx/core/test/near/InRadius.js");
     }
 }
