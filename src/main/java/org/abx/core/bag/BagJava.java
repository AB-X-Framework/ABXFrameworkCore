package org.abx.core.bag;

import org.itcr.msc.thesis.abm.set.SetJava;

import java.util.HashMap;
import java.util.Map;

public class BagJava {

    private final HashMap<Object, Integer> elements;

    public BagJava() {
        this.elements = new HashMap<>();
    }

    public boolean contains(Object key) {
        if (key instanceof Byte) {
            key = ((Byte) key).intValue();
        }
        if (key instanceof Short) {
            key = ((Short) key).intValue();
        }
        if (!elements.containsKey(key)) {
            return false;
        }
        return elements.get(key) > 0;
    }

    /**
     * Amount of elements is ignored
     *
     * @return
     */
    public SetJava elemsToSet() {
        final SetJava set = new SetJava();
        for (Map.Entry<Object, Integer> bagEntry : elements.entrySet()) {
            if (bagEntry.getValue() > 0) {
                set.append(bagEntry.getKey());
            }
        }
        return set;
    }

    @Override
    public int hashCode() {
        return elements.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof BagJava)) {
            return false;
        }
        return ((BagJava) obj).elements.equals(elements);
    }

    /**
     * Adds element to bag
     * @param key
     */
    public void add(Object key) {
        if (contains(key)) {
            elements.put(key, elements.get(key) + 1);
        } else {
            elements.put(key, 1);
        }
    }

    /**
     * Removes one element from the bag
     * @param key
     */
    public void remove(Object key) {
        if (contains(key)) {
            elements.put(key, Math.max(0, elements.get(key) - 1));
        }
    }

    /**
     * Size counting all element
     * @return
     */
    public int size() {
        int size = 0;
        for (Integer elementCount : elements.values()) {
            size += elementCount;
        }
        return size;
    }

    public Object[] toArray() {
        Object[] retElements = new Object[size()];
        int counter = 0;
        for (Map.Entry<Object, Integer> bagEntry : elements.entrySet()) {
            Object key = bagEntry.getKey();
            for (int i = bagEntry.getValue(); i >0 ; --i) {
                retElements[counter++] = key;
            }
        }
        return retElements;
    }

    public boolean __containsMember(Object o) {
        return contains(o);
    }

    public boolean __doesNotContainMember(Object o) {
        return !__containsMember(o);
    }
}
