package org.abx.core.test.bag;


import org.abx.core.ABMFrameworkCore;
import org.abx.core.ConsoleABMListener;
import org.abx.core.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class BagTest {
    @Test
    void bagComprehension() throws Exception {
        ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.standard);
        abmFrameworkCore.addListener(new ConsoleABMListener());
        abmFrameworkCore.processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/bag/Bag.js");
    }
}
