package org.abx.core.test.csv;


import org.abx.core.ABMFrameworkCore;
import org.abx.core.ConsoleABMListener;
import org.abx.core.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class CSVTest {@Test
void csvTest() throws Exception {
    ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.standard);
    abmFrameworkCore.addListener(new ConsoleABMListener());
    abmFrameworkCore.processFile(
            "src/test/java/org/itcr/msc/thesis/abm/test/csv/CSVTest.js");
}
}
