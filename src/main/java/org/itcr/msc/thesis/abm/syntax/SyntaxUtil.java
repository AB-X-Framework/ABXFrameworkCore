package org.itcr.msc.thesis.abm.syntax;

import org.graalvm.polyglot.Context;

import java.util.Map;

public class SyntaxUtil {



    public static String preprocess(String input, OptimizationLevel optimizationLevel) {
        StringProcessor processor = new StringProcessor();
        String preprocess = processor.preprocess(input);
        String output= new TypingSupport(optimizationLevel).
                preprocess(SetSupport.preprocess(preprocess,optimizationLevel));
        String postprocess= processor.postprocess(output);
        return postprocess;
    }

    public static void setup(Context cx) {
        SetSupport.setup(cx);
    }

    public static String postprocess(String output) {
        return SetSupport.postprocess(output);
    }

}
