package org.abx.core.syntax;

import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

public class StringProcessor {

    enum TextType {
        lineComment(true),
        blockComment(true),
        code(true),
        quote(false),
        doubleQuote(false),
        backquote(false),
        backquoteCode(true);

        private boolean isCode;

        TextType(boolean code) {
            isCode = code;
        }

    }

    private int counter;
    private StringBuilder currString;
    private final HashMap<String, String> strings;

    public StringProcessor() {
        strings = new HashMap<>();

    }

    private void addString(StringBuilder result) {
        String newString = currString.toString();
        if (!strings.containsKey(newString)) {
            String newName = " __str_" + counter++ + "_ ";
            strings.put(newString, newName);
            result.append(newName);
        } else {

            result.append(strings.get(newString));
        }
        currString = new StringBuilder();
    }

    public String preprocess(String input) {
        StringBuilder result = new StringBuilder();
        TextType currentType = TextType.code;
        char[] chars = input.toCharArray();
        int size = chars.length;
        int brackets = 0;
        currString = new StringBuilder();
        Stack<TextType> previousType = new Stack<>();
        previousType.push(TextType.code);
        for (int i = 0; i < size; ++i) {
            char c = chars[i];
            if (currentType == TextType.lineComment) {
                currString.append(c);
                if (c == '\n') {
                    addString(result);
                    currentType = TextType.code;
                }
                continue;
            } else if (currentType == TextType.blockComment) {
                currString.append(c);
                if (c == '*'){
                    char next = chars[i + 1];
                    if (next == '/') {
                        currString.append(next);
                        addString(result);
                        ++i;
                        currentType = previousType.peek();
                    }
                }
                continue;
            }
            switch (c) {
                case '/': {
                    if (currentType.isCode) {
                        char next = chars[i + 1];
                        if (next == '/') {
                            ++i;
                            currString.append("//");
                            currentType = TextType.lineComment;
                        } else if (next == '*') {
                            ++i;
                            currString.append("/*");
                            currentType = TextType.blockComment;
                        } else {
                            result.append(c);
                        }
                    } else {

                        currString.append(c);
                    }
                }
                break;
                case '"': {
                    currString.append(c);
                    if (currentType.isCode) {
                        currentType = TextType.doubleQuote;
                    } else if (currentType == TextType.doubleQuote) {
                        addString(result);
                        currentType = previousType.peek();
                    }
                }
                break;
                case '\'': {
                    currString.append(c);
                    if (currentType.isCode) {
                        currentType = TextType.quote;
                    } else if (currentType == TextType.quote) {
                        addString(result);
                        currentType = previousType.peek();
                    }
                }
                break;
                case '{': {
                    if (currentType == TextType.backquoteCode) {
                        result.append(c);
                        ++brackets;
                    } else {
                        if (currentType.isCode) {
                            result.append(c);
                        } else {
                            currString.append(c);
                        }
                    }
                }
                break;
                case '}': {
                    if (currentType == TextType.backquoteCode) {
                        --brackets;
                        if (brackets == 0) {
                            currString.append(c);
                            currentType = TextType.backquote;
                        } else {
                            result.append(c);
                        }

                    } else {
                        if (currentType.isCode) {
                            result.append(c);
                        } else {
                            currString.append(c);
                        }
                    }
                }
                break;
                case '$': {
                    if (currentType == TextType.backquote) {
                        currString.append(c);
                        char nextChar = chars[i + 1];
                        currString.append(nextChar);
                        ++i;
                        if (nextChar == '{') {
                            addString(result);
                            currentType = TextType.backquoteCode;
                            brackets = 1;
                        }
                    } else {
                        if (currentType == TextType.code) {
                            result.append(c);
                        } else {
                            currString.append(c);
                        }
                    }
                }
                break;
                case '`': {
                    currString.append(c);
                    if (currentType.isCode) {
                        currentType = TextType.backquote;
                        previousType.push(TextType.backquote);
                    } else if (currentType == TextType.backquote) {
                        addString(result);

                        previousType.pop();
                        currentType = previousType.peek();
                    }
                }
                break;
                default: {
                    if (currentType.isCode) {
                        result.append(c);
                    } else {
                        currString.append(c);
                    }
                }

            }
        }
        return result.toString();
    }

    public String postprocess(String input) {
        for (Map.Entry<String, String> entry : strings.entrySet()) {
            input = input.replace(entry.getValue(), entry.getKey());
        }

        return input;
    }
}
