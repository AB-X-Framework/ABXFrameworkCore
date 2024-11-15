package org.abx.core.test.syntax;

import org.abx.core.ABMFrameworkCore;
import org.abx.core.ConsoleABMListener;
import org.abx.core.syntax.OptimizationLevel;
import org.abx.core.syntax.StringProcessor;
import org.abx.core.syntax.SyntaxUtil;
import org.abx.core.utils.StreamUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.FileInputStream;

public class StringProcessorTest {

    private void validateSource(String source) throws Exception {
        String val = StreamUtils.readStream(new FileInputStream(
                source));
        StringProcessor processor = new StringProcessor();
        String output = processor.preprocess(val);
        Assertions.assertNotEquals(val, output);
        String postprocess = processor.postprocess(output);
        Assertions.assertEquals(val, postprocess);
    }

    @Test
    void stringProcessorTest() throws Exception {
        validateSource("src/test/java/org/abx/core/test/infix/InfixTest.js");
        validateSource("src/test/java/org/abx/core/test/math/ComplexTest.js");
        validateSource("src/main/resources/org/itcr/msc/thesis/abm/framework/ABMGrid.js");
    }

    @Test
    void testWithEqual()throws Exception {
        System.out.println(SyntaxUtil.preprocess(StreamUtils.readStream(new FileInputStream(
                "src/test/java/org/abx/core/test/syntax/WithEqual.js")

        ), OptimizationLevel.standard));
    }
}
