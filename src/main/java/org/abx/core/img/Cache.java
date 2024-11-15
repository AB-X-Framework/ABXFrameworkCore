package org.abx.core.img;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

public class Cache<K, V> {
    private final int maxSize;
    private final Map<K, V> cacheMap;

    public Cache(int maxSize) {
        this.maxSize = maxSize;
        this.cacheMap = new LinkedHashMap<K, V>(maxSize, 0.75f, true);
    }

    public V get(K key) {
        return cacheMap.get(key);
    }

    public boolean containsKey(K key) {
        return cacheMap.containsKey(key);
    }


    public void put(K key, V value) {
        if (cacheMap.size() >= maxSize) {
            removeLeastUsedElements();
        }
        cacheMap.put(key, value);
    }

    private void removeLeastUsedElements() {
        int elementsToRemove = maxSize / 2;
        int count = 0;
        Set<K> toRemove = new LinkedHashSet<K>();
        for (K key : cacheMap.keySet()) {
            if (count >= elementsToRemove) {
                break;
            }
            toRemove.add(key);
            count++;
        }
        for (K key : toRemove) {
            cacheMap.remove(key);
        }
    }
}
