package org.abx.core.test.syntax;

import org.itcr.msc.thesis.abm.ABMFrameworkCore;
import org.itcr.msc.thesis.abm.ConsoleABMListener;
import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
import org.itcr.msc.thesis.abm.syntax.StringProcessor;
import org.itcr.msc.thesis.abm.syntax.SyntaxUtil;
import org.itcr.msc.thesis.abm.utils.StreamUtils;
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
        validateSource("src/test/java/org/itcr/msc/thesis/abm/test/infix/InfixTest.js");
        validateSource("src/test/java/org/itcr/msc/thesis/abm/test/math/ComplexTest.js");
        validateSource("src/main/resources/org/itcr/msc/thesis/abm/framework/ABMGrid.js");
    }

    @Test
    void testWithEqual()throws Exception {
        System.out.println(SyntaxUtil.preprocess(StreamUtils.readStream(new FileInputStream(
                "src/test/java/org/itcr/msc/thesis/abm/test/syntax/WithEqual.js")

        ), OptimizationLevel.standard));
    }
}
