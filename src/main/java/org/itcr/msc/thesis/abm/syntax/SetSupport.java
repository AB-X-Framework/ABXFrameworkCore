package org.itcr.msc.thesis.abm.syntax;

import org.graalvm.polyglot.Context;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class SetSupport {
    private static final Map<String, String> functions;
    private static final Map<String, String> newInfix;
    private static final Map<String, String> reverseInfix;
    private static final Set<String> resultAsSet;


    private static final Map<String, String> toJS;
    private static final Map<String, String> toJava;

    static {
        newInfix = new HashMap<>();
        newInfix.put("∪", "__union");
        newInfix.put("∩", "__intersection");
        newInfix.put("⊆", "__isSubset");
        newInfix.put("⊇", "__isSuperset");
        functions = new HashMap<>();
        functions.put("∅", "__Empty_Set_");
        functions.put("π", "__Pi_");
        functions.put("ε", "__Epsilon_");

        //Reverse Infix of isMember
        reverseInfix = new HashMap<>();
        reverseInfix.put("∈", "__containsMember");
        reverseInfix.put("∉", "__doesNotContainMember");

        //resultAsSet
        resultAsSet = new HashSet<>();
        resultAsSet.add("__union");
        resultAsSet.add("__intersection");


        toJS = new HashMap<>();
        for (Map.Entry<String, String> entry : newInfix.entrySet()) {
            toJS.put(entry.getKey(), "._" + entry.getValue() + "()+");
        }
        for (Map.Entry<String, String> entry : reverseInfix.entrySet()) {
            toJS.put(entry.getKey(), "._" + entry.getValue() + "()+");
        }
        for (Map.Entry<String, String> entry : functions.entrySet()) {
            toJS.put(entry.getKey(), entry.getValue());
        }
        toJava = new HashMap<>();
        for (Map.Entry<String, String> entry : newInfix.entrySet()) {
            toJava.put("._" + entry.getValue() + "()+", entry.getKey());
        }

        for (Map.Entry<String, String> entry : reverseInfix.entrySet()) {
            toJava.put("._" + entry.getValue() + "()+", entry.getKey());
        }
        for (Map.Entry<String, String> entry : functions.entrySet()) {
            toJava.put(entry.getValue(), entry.getKey());
        }
    }

    public static String preprocess(String input, OptimizationLevel optimizationLevel) {
        for (Map.Entry<String, String> entry : toJS.entrySet()) {
            input = input.replace(entry.getKey(), entry.getValue());
        }
        return new TypingSupport(optimizationLevel).preprocess(input);
    }

    public static void setup(Context cx) {
        for (String entry : newInfix.values()) {
            boolean result = resultAsSet.contains(entry);
            cx.eval("js", "processInfix(\"" + entry + "\"," + result + ");");
        }
        for (String entry : reverseInfix.values()) {
            cx.eval("js", "processReverseInfix(\"" + entry + "\",false);");
        }
    }

    public static String postprocess(String output) {
        for (Map.Entry<String, String> entry : toJava.entrySet()) {
            output = output.replace(entry.getKey(), entry.getValue());
        }
        return output;
    }
}
