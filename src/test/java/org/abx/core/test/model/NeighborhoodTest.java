 package org.abx.core.test.model;

import org.abx.core.ABMFrameworkCore;
import org.abx.core.ConsoleABMListener;
import org.abx.core.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

 public class NeighborhoodTest {

     @Test
     void NeighborhoodTest() throws Exception {
         ABMFrameworkCore core = new ABMFrameworkCore(OptimizationLevel.standard);
         core.addListener(new ConsoleABMListener());
         core.processFile(
                 "src/test/java/org/itcr/msc/thesis/abm/test/model/NeighborhoodTest.js");
     }
 }
