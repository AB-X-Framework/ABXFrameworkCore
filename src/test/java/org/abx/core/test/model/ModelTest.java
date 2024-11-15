 package org.abx.core.test.model;

 import org.abx.core.ABMFrameworkCore;
 import org.abx.core.syntax.OptimizationLevel;
 import org.junit.jupiter.api.Test;

public class ModelTest {
    @Test
    void modelTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                "src/test/java/org/abx/core/test/model/ModelTest.js");
    }


}
