package org.abx.core.test.set;


import org.abx.core.ABMFrameworkCore;
import org.abx.core.ConsoleABMListener;
import org.abx.core.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class SetTest {

    @Test
    void setText() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).addListener(new ConsoleABMListener()).
                processFile( "src/test/java/org/abx/core/test/set/Set.js");
    }



}
