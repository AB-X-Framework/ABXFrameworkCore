package org.abx.core.test.movement;

import org.abx.core.ABMFrameworkCore;
import org.abx.core.ConsoleABMListener;
import org.abx.core.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class MovementTest {

    @Test
    void movementTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).addListener(new ConsoleABMListener()).processFile(
                "src/test/java/org/abx/core/test/movement/Baseline Movement.js");
    }

    @Test
    void galoreTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).addListener(new ConsoleABMListener()).processFile(
                "src/test/java/org/abx/core/test/movement/Happy Galore.js");
    }

    @Test
    void moveToTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).addListener(new ConsoleABMListener()).processFile(
                "src/test/java/org/abx/core/test/movement/MoveTo.js");
    }
}
