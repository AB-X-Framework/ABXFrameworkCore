package org.abx.core.test.infix;



import org.abx.core.ABMFrameworkCore;
import org.abx.core.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class InfixTest {

    @Test
    void infixTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.debug).processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/infix/InfixTest.js");
    }
}
