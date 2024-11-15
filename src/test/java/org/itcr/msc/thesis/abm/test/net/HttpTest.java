package org.itcr.msc.thesis.abm.test.net;

import org.itcr.msc.thesis.abm.ABMFrameworkCore;
import org.itcr.msc.thesis.abm.ConsoleABMListener;
import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
import org.junit.jupiter.api.Test;

public class HttpTest {
    @Test
    void HttpTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).
                addListener(new ConsoleABMListener()).processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/net/Http Test.js");
    }
}
