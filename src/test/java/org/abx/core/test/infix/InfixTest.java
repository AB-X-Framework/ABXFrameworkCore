package org.abx.core.test.infix;


import org.itcr.msc.thesis.abm.ABMFrameworkCore;
import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class InfixTest {

    @Test
    void infixTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.debug).processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/infix/InfixTest.js");
    }
}
