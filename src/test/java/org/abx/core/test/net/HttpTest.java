package org.abx.core.test.net;

import org.abx.core.ABMFrameworkCore;
import org.abx.core.ConsoleABMListener;
import org.abx.core.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class HttpTest {
    @Test
    void HttpTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).
                addListener(new ConsoleABMListener()).processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/net/Http Test.js");
    }
}
