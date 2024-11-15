package org.abx.core.test.relation;

import org.abx.core.ABMFrameworkCore;
import org.abx.core.ConsoleABMListener;
import org.abx.core.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class RelationTest {
    @Test
    void relationsTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).addListener(new ConsoleABMListener()).
                processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/relation/Relations.js");
    }
}
