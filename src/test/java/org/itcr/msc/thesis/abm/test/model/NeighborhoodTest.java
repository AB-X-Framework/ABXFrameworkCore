 package org.itcr.msc.thesis.abm.test.model;

import org.itcr.msc.thesis.abm.ABMFrameworkCore;
import org.itcr.msc.thesis.abm.ConsoleABMListener;
import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
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
