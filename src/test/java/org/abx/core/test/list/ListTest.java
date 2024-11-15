package org.abx.core.test.list;

import org.itcr.msc.thesis.abm.ABMFrameworkCore;
import org.itcr.msc.thesis.abm.ConsoleABMListener;
import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
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
