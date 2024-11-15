 package org.abx.core.test.model;

 import org.itcr.msc.thesis.abm.ABMFrameworkCore;
 import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
 import org.junit.jupiter.api.Test;

public class ModelTest {
    @Test
    void modelTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/model/ModelTest.js");
    }


}
