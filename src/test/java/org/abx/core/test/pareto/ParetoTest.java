package org.abx.core.test.pareto;

import org.itcr.msc.thesis.abm.ABMFrameworkCore;
import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class ParetoTest {

    @Test
    public void test() throws Exception {
        ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.performance);
        abmFrameworkCore.processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/pareto/AllExecs.js");

    }
}
