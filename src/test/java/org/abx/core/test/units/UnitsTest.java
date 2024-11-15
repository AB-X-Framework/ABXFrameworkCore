package org.abx.core.test.units;

import org.itcr.msc.thesis.abm.ABMFrameworkCore;
import org.itcr.msc.thesis.abm.ConsoleABMListener;
import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class UnitsTest {
    @Test
    void unitsTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).addListener(new ConsoleABMListener()).processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/units/UnitsTest.js");
    }

    @Test
    void globalUnitsTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/units/GlobalUnitsTest.js");
    }
}
