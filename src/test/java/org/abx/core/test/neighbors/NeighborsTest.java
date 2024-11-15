package org.abx.core.test.neighbors;

import org.itcr.msc.thesis.abm.ABMFrameworkCore;
import org.itcr.msc.thesis.abm.ConsoleABMListener;
import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class NeighborsTest {
    /**
     *
     * @throws Exception
     */
    @Test
    void mooreTest() throws Exception {
        ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.standard);
        abmFrameworkCore.processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/neighbors/Moore.js");


        abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.performance);
        abmFrameworkCore.addListener(new ConsoleABMListener());
        abmFrameworkCore.processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/neighbors/Moore.js");
    }

    /**
     *
     * @throws Exception
     */
    @Test
    void vonNewmanTest() throws Exception {
        ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.standard);
        abmFrameworkCore.processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/neighbors/VonNewman.js");

        abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.performance);
        abmFrameworkCore.addListener(new ConsoleABMListener());
        abmFrameworkCore.processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/neighbors/VonNewman.js");
    }

    /**
     *
     * @throws Exception
     */
    @Test
    void patchesTest() throws Exception {
        ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.standard);
        abmFrameworkCore.processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/neighbors/Patches.js");

        abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.performance);
        abmFrameworkCore.addListener(new ConsoleABMListener());
        abmFrameworkCore.processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/neighbors/Patches.js");
    }

    /**
     *
     * @throws Exception
     */
    @Test
    void mooreEdgeTest() throws Exception {
        ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.standard);
        abmFrameworkCore.processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/neighbors/MooreEdge.js");

        abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.performance);
        abmFrameworkCore.addListener(new ConsoleABMListener());
        abmFrameworkCore.processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/neighbors/MooreEdge.js");
    }

}
