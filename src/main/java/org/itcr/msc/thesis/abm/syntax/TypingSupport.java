package org.itcr.msc.thesis.abm.syntax;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class TypingSupport {
    private static final String VarName = "([a-zA-Z_$][a-zA-Z_$0-9]*)";

    private static final String MultiType = "\\s*" + VarName + "\\s*(\\|\\s*" + VarName + "\\s*)*";
    private static final String OptionalType = MultiType;
    private static final String TypedVariable = "(" + VarName + "\\s*\\??\\s*:\\s*" + OptionalType + ")";
    private static final String variable = "(" + TypedVariable + "|" + VarName + ")";

    private static final String variables = "\\s*" + variable + "(\\s*,\\s*" + variable + "\\s*)*\\s*";
    private static final String functionSignature = "(\\((" + variables + ")?\\))\\s*";

    private static final String optTypedSignature = functionSignature + "(\\s*:\\s*" + OptionalType + "\\s*)?";
    private static final String typedSignature = functionSignature + "(\\s*:\\s*" + OptionalType + "\\s*)";

    private static final String fatArrowOrBracket = "(=>\\s*\\{|\\{|=>)";
    private static final String optTypedFxHeader = optTypedSignature + fatArrowOrBracket;
    private static final String typedFxHeader = typedSignature + fatArrowOrBracket;

    private final OptimizationLevel optimizationLevel;

    public TypingSupport(OptimizationLevel optimizationLevel) {
        this.optimizationLevel = optimizationLevel;
    }

    private String prepareClassType(String type) {
        type = type.trim();
        if (type.equals("void")) {
            return "undefined";
        } else if (type.contains("|")) {
            return "[" + type.replace('|', ',') + "]";
        } else {
            return type;
        }
    }


    private void collectInputs(String input,
                               StringBuilder sb,
                               HashMap<String, String> strictMap,
                               HashMap<String, String> optionalMap) {
        Pattern pattern = Pattern.compile(TypedVariable);
        Matcher matcher = pattern.matcher(input);
        int currentIndex = 0;
        while (matcher.find()) {
            int nextIndex = matcher.start();
            sb.append(input, currentIndex, nextIndex);
            String group = matcher.group().trim();
            String[] vars = group.split(":");
            String type = vars[1].trim();
            String name = vars[0].trim();
            if (name.endsWith("?")) {
                name = name.substring(0, name.length() - 1).trim();
                optionalMap.put(name, prepareClassType(type));
            } else {
                strictMap.put(name, prepareClassType(type));
            }
            sb.append(name);
            currentIndex = matcher.end();
        }
        sb.append(input.substring(currentIndex));
    }


    private void setLambdaVariables(StringBuilder sb, HashMap<String, String> strictMap) {
        validateVariablesTypes(sb, strictMap);
        sb.append(".out=");
    }

    private void validateVariablesTypes(StringBuilder sb, HashMap<String, String> strictMap) {
        int size = strictMap.size();
        for (Map.Entry<String, String> entry : strictMap.entrySet()) {
            sb.append("[");
            sb.append(entry.getKey());
            sb.append(",");
            sb.append(entry.getValue());
            sb.append("]");
            if (size > 1) {
                --size;
                sb.append(",");
            }
        }
        sb.append("])");
    }

    /**
     * Check if we should add assertiosn
     *
     * @return
     */
    private boolean addAssertions() {
        return optimizationLevel.equals(OptimizationLevel.debug) ||
                optimizationLevel.equals(OptimizationLevel.standard);
    }

    /**
     * The current input and if the fx ends with {
     *
     * @param input The current fx header
     * @param sb    The script level string builder
     */
    private void reviewLambdaTyping(String input, StringBuilder sb, boolean typedFx) {
        HashMap<String, String> strictMap = new HashMap<>();
        HashMap<String, String> optionalMap = new HashMap<>();
        int signatureEnds = input.indexOf(")");
        collectInputs(input.substring(0, signatureEnds), sb, strictMap, optionalMap);
        sb.append(")=>");

        if (addAssertions()) {
            if (!strictMap.isEmpty()) {
                sb.append("assertValidInstances([");
                setLambdaVariables(sb, strictMap);
            }
            if (!optionalMap.isEmpty()) {
                sb.append("verifyValidInstances([");
                setLambdaVariables(sb, optionalMap);
            }
        }
        if (typedFx) {
            String classType = input.substring(signatureEnds + 1).trim().substring(1);
            classType = classType.substring(0, classType.indexOf("=>"));
            validateReturn(sb, classType);
        }
    }


    /**
     * The current input and if the fx ends with {
     *
     * @param input The current fx header
     * @param sb    The script level string builder
     */
    private void reviewFxTyping(String input, StringBuilder sb, boolean typedFx) {
        HashMap<String, String> strictMap = new HashMap<>();
        HashMap<String, String> optionalMap = new HashMap<>();

        int end = input.indexOf(")");
        collectInputs(input.substring(0, end), sb, strictMap, optionalMap);
        sb.append(")");
        input = input.trim().substring(end + 1).trim();

        String classType = "";
        if (typedFx) {
            input = input.substring(1).trim();//REmvoe :
            int fxNameEnds = input.indexOf("=>");
            if (fxNameEnds != -1) {
                sb.append("=>");
                classType = input.substring(0, fxNameEnds).trim();
            } else {
                classType = input.substring(0, input.length() - 1).trim();
            }

            sb.append("{");
        } else {
            sb.append(input);
        }
        if (addAssertions()) {
            if (!strictMap.isEmpty()) {
                sb.append("assertValidInstances([");
                validateVariablesTypes(sb, strictMap);
                sb.append(";");
            }
            if (!optionalMap.isEmpty()) {
                sb.append("verifyValidInstances([");
                validateVariablesTypes(sb, optionalMap);
                sb.append(";");
            }
        }
        if (typedFx) {
            sb.append("return ");
            validateReturn(sb, classType);
            sb.append(" (function () {");
        }


    }

    private void validateReturn(StringBuilder sb, String classType) {
        if (addAssertions()) {
            String validationType;
            if (classType.startsWith("?")) {
                validationType = "_validateType()";
                classType = classType.substring(1);
            } else {
                validationType = "_assertType()";
            }
            sb.append(validationType).append(".setType(").append(prepareClassType(classType)).append(").evaluate =");
        }
    }

    public String preprocess(String input) {
        for (; ; ) {
            String output = preprocessAux(input);
            if (output.equals(input)) {
                return output;
            }
            input = output;
        }
    }

    public String preprocessAux(String input) {
        StringBuilder sb = new StringBuilder();

        Pattern optTypedFxHeaderPattern = Pattern.compile(optTypedFxHeader);
        Matcher fullScriptMatcher = optTypedFxHeaderPattern.matcher(input);
        while (fullScriptMatcher.find()) {
            int nextIndex = fullScriptMatcher.start();
            sb.append(input, 0, nextIndex);
            String currOptTypedFxHeader = fullScriptMatcher.group().trim();
            boolean openBracket = currOptTypedFxHeader.endsWith("{");
            boolean typedFx = currOptTypedFxHeader.matches(typedFxHeader);
            if (openBracket) {
                reviewFxTyping(currOptTypedFxHeader, sb, typedFx);
            } else {
                reviewLambdaTyping(currOptTypedFxHeader, sb, typedFx);
            }
            //Process rest of string
            input = input.substring(fullScriptMatcher.end());
            if (typedFx && openBracket) {
                input = addApply(sb, input);
            }
            fullScriptMatcher = optTypedFxHeaderPattern.matcher(input);
        }
        //Process end of string
        sb.append(input);
        return sb.toString();
    }

    private String addApply(StringBuilder sb, String input) {
        int bracket = 1;
        int i = 0;
        while (bracket > 0) {
            char currChar = input.charAt(i);
            if (currChar == '}') {
                --bracket;
            } else if (currChar == '{') {
                ++bracket;
            }
            sb.append(currChar);
            ++i;
        }
        sb.append(").apply(this,arguments);}");
        return input.substring(i);
    }


}
