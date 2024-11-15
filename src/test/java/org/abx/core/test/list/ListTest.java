package org.abx.core.test.list;


import org.abx.core.ABMFrameworkCore;
import org.abx.core.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class ListTest {
    @Test
    void bagComprehension() throws Exception {
        ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.standard);
        abmFrameworkCore.addListener(new ConsoleABMListener());
        abmFrameworkCore.processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/list/ListTest.js");
    }
}
