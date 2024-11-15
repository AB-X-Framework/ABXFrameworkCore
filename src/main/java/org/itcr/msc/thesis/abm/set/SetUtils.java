package org.itcr.msc.thesis.abm.set;

import java.util.Set;

public class SetUtils {
    public SetJava createSet(Set elements){
        return new SetJava(elements);
    }
    public SetJava createSet(Object [] elements){
        return new SetJava(elements);
    }
}
