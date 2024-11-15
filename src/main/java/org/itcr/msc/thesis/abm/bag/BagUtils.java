package org.itcr.msc.thesis.abm.bag;

import java.util.Set;

public class BagUtils {
    public BagJava createBag(Set elements) {
        BagJava resultBag= new BagJava();
        for (Object element : elements) {
            resultBag.add(element);
        }
        return resultBag;
    }

    public BagJava createBag(Object[] elements) {
        BagJava resultBag = new BagJava();
        for (Object element : elements) {
            resultBag.add(element);
        }
        return resultBag;
    }


}
