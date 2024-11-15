package org.abx.core.test.neighbors;

import org.abx.core.ABMFrameworkCore;
import org.abx.core.ConsoleABMListener;
import org.abx.core.syntax.OptimizationLevel;
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
                "src/test/java/org/abx/core/test/neighbors/Moore.js");


        abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.performance);
        abmFrameworkCore.addListener(new ConsoleABMListener());
        abmFrameworkCore.processFile(
                "src/test/java/org/abx/core/test/neighbors/Moore.js");
    }

    /**
     *
     * @throws Exception
     */
    @Test
    void vonNewmanTest() throws Exception {
        ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.standard);
        abmFrameworkCore.processFile(
                "src/test/java/org/abx/core/test/neighbors/VonNewman.js");

        abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.performance);
        abmFrameworkCore.addListener(new ConsoleABMListener());
        abmFrameworkCore.processFile(
                "src/test/java/org/abx/core/test/neighbors/VonNewman.js");
    }

    /**
     *
     * @throws Exception
     */
    @Test
    void patchesTest() throws Exception {
        ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.standard);
        abmFrameworkCore.processFile(
                "src/test/java/org/abx/core/test/neighbors/Patches.js");

        abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.performance);
        abmFrameworkCore.addListener(new ConsoleABMListener());
        abmFrameworkCore.processFile(
                "src/test/java/org/abx/core/test/neighbors/Patches.js");
    }

    /**
     *
     * @throws Exception
     */
    @Test
    void mooreEdgeTest() throws Exception {
        ABMFrameworkCore abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.standard);
        abmFrameworkCore.processFile(
                "src/test/java/org/abx/core/test/neighbors/MooreEdge.js");

        abmFrameworkCore = new ABMFrameworkCore(OptimizationLevel.performance);
        abmFrameworkCore.addListener(new ConsoleABMListener());
        abmFrameworkCore.processFile(
                "src/test/java/org/abx/core/test/neighbors/MooreEdge.js");
    }

}
