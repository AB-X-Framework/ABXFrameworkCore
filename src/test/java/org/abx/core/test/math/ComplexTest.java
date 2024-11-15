package org.abx.core.test.math;


import org.abx.core.ABMFrameworkCore;
import org.abx.core.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class ComplexTest {
    @Test
    void complexTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                "src/test/java/org/abx/core/test/math/ComplexTest.js");
    }
}
