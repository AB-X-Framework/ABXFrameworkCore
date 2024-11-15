package org.itcr.msc.thesis.abm.test.math;

import org.itcr.msc.thesis.abm.ABMFrameworkCore;
import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class ComplexTest {
    @Test
    void complexTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/math/ComplexTest.js");
    }
}
