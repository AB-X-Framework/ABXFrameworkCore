package org.abx.core.set;

import java.util.*;

public class SetJava {

    private Set<Object> set;

    public SetJava() {
        set = new HashSet<>();
    }

    public int size() {
        return set.size();
    }

    public Set<Object> set(boolean shuffle) {
        if (shuffle) {
            List<Object> list = new ArrayList<>(set);
            Collections.shuffle(list);
            return new LinkedHashSet<>(list);
        }else {
            return set;
        }
    };



    public SetJava(Set<Object> data) {
        set = data;
    }

    public SetJava(Object[] data) {
        set = new HashSet<>();
        Collections.addAll(set, data);
    }

    public void append(Object data) {
        set.add(data);
    }

    public void appendAll(SetJava data ) {
        set.addAll(data.set);
    }


    public void remove(Object data) {
        set.remove(data);
    }


    public String toString() {
        return set.toString();
    }

    public SetJava duplicate() {
        SetJava newSet= new SetJava();
        newSet.set.addAll(set);
        return newSet;

    }

    public SetJava subtraction(SetJava other) {
        SetJava result = new SetJava();
        result.set.addAll(set);
        result.set.removeAll(other.set);
        return result;
    }

    public Set some(int count, boolean shuffle) {
        Set result = new HashSet();
        for (Object o : set(shuffle)) {
            if (count == 0) {
                break;
            }
            --count;
            result.add(o);
        }
        return result;
    }

    public Object one(boolean shuffled) {
        if (shuffled) {
            List<Object> list = new ArrayList<>(set);
            Collections.shuffle(list);
            return list.get(0);
        }else {
            return set.iterator().next();
        }
    }

    public boolean isEmpty(){
        return set.isEmpty();
    }

    @Override
    public boolean equals(Object other) {
        if (other instanceof SetJava) {
            SetJava otherSet = (SetJava) other;
            return set.equals(otherSet.set);
        } else {
            return false;
        }
    }


    @Override
    public int hashCode() {
        return set.hashCode();
    }

    /**
     * Used with ∪ syntax
     *
     * @param other
     * @return
     */

    public SetJava __union(SetJava other) {
        SetJava result = new SetJava();
        result.set.addAll(set);
        result.set.addAll(other.set);
        return result;
    }

    public SetJava __intersection(SetJava other) {
        SetJava result = new SetJava();
        for (Object o : set) {
            if (other.set.contains(o)) {
                result.set.add(o);
            }
        }
        return result;
    }

    public boolean __isSubset(SetJava other) {
        for (Object o : set) {
            if (!other.set.contains(o)) {
                return false;
            }
        }
        return true;
    }

    public boolean __isSuperset(SetJava other) {
        return other.__isSubset(this);
    }


    public boolean __containsMember(Object o) {
        if (o instanceof Byte) {
            o = ((Byte) o).intValue();
        }
        if (o instanceof Short) {
            o = ((Short) o).intValue();
        }
        return set.contains(o);
    }

    public boolean __doesNotContainMember(Object o) {
        return !__containsMember(o);
    }

}
