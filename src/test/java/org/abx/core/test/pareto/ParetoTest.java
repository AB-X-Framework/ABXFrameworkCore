package org.abx.core.test.pareto;

import org.abx.core.ABMFrameworkCore;
import org.abx.core.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

import java.io.File;

public class ParetoTest {

    @Test
    public void test() throws Exception {
        try {
            ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.performance);
            abmFrameworkCore.processFile(
                    "src/test/java/org/abx/core/test/pareto/AllExecs.js");
        }finally {
            new File("src/test/java/org/abx/core/test/pareto/pareto.ab-x.csv").delete();
        }

    }
}
