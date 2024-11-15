 package org.abx.core.test.model;

 import org.abx.core.ABMFrameworkCore;
 import org.abx.core.syntax.OptimizationLevel;
 import org.junit.jupiter.api.Test;

 public class ModelTest3 {

     @Test
     void modelTest3() throws Exception {
         new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                 "src/test/java/org/itcr/msc/thesis/abm/test/model/ModelTest3.js");
     }
 }
