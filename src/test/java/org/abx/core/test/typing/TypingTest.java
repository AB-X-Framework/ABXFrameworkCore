package org.abx.core.test.typing;

import org.itcr.msc.thesis.abm.ABMFrameworkCore;
import org.itcr.msc.thesis.abm.ConsoleABMListener;
import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class TypingTest {
    @Test
    void typingTest() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).
                addListener(new ConsoleABMListener()).processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/typing/TypingTest.js");

    }

    @Test
    void typingTest2() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/typing/TypingTest2.js");

    }

    @Test
    void brokenType() throws Exception {
        Exception expected = null;
        try {
            new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                    "src/test/java/org/itcr/msc/thesis/abm/test/typing/BrokenTypingTest.js");
        } catch (Exception e) {
            expected = e;
        }
        Assertions.assertNotNull(expected);
        Assertions.assertTrue(expected.getMessage().contains("1 is not of function String"), expected.getMessage());


    }

    @Test
    void brokenOutputType() throws Exception {
        Exception expected = null;
        try {
            new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                    "src/test/java/org/itcr/msc/thesis/abm/test/typing/BrokenOutputType.js");
        } catch (Exception e) {
            expected = e;
        }
        Assertions.assertNotNull(expected);
        Assertions.assertTrue(expected.getMessage().contains("21 is not of function String"), expected.getMessage());
    }

    @Test
    void brokenOutputType2() throws Exception {
        Exception expected = null;
        try {
            new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                    "src/test/java/org/itcr/msc/thesis/abm/test/typing/BrokenOutputType2.js");
        } catch (Exception e) {
            expected = e;
        }
        Assertions.assertNotNull(expected);
        Assertions.assertTrue(expected.getMessage().contains("21 is not of function String"), expected.getMessage());

    }

    @Test
    void brokenOutputType3() throws Exception {
        Exception expected = null;
        try {
            new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                    "src/test/java/org/itcr/msc/thesis/abm/test/typing/BrokenOutputType3.js");
        } catch (Exception e) {
            expected = e;
        }
        Assertions.assertNotNull(expected);
        Assertions.assertTrue(expected.getMessage().contains("done is not of function Number"), expected.getMessage());

    }

    @Test
    void subClass() throws Exception {
        new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                "src/test/java/org/itcr/msc/thesis/abm/test/typing/Subclass.js");

    }

    @Test
    void brokenOutputType4() throws Exception {
        Exception expected = null;
        try {
            new ABMFrameworkCore(OptimizationLevel.standard).processFile(
                    "src/test/java/org/itcr/msc/thesis/abm/test/typing/BrokenOutputType4.js");
        } catch (Exception e) {
            expected = e;
        }
        Assertions.assertNotNull(expected);
        Assertions.assertTrue(expected.getMessage().contains("Expecting void but got 5"), expected.getMessage());

    }
}

