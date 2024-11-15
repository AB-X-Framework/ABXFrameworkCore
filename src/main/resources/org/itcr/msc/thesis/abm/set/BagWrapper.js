/**
 * Bg Overloading operators
 */
const BagOps = Operators({
        "=="(a: BagClass, b: BagClass) {
            return a.content.equals(b.content);
        }
    }
);

/**
 * Bag class behavior
 */
class BagClass extends BagOps{
    content;

    constructor(content) {
        super();
        this.content = content;
    }

    /**
     * Size of bag
     * @returns {*}
     */
    size(): Number {
        return this.content.size();
    }

    /**
     * Adds element to bag
     * @param elem
     */
    add(elem):void{
        this.content.add(elem);
    }

    elemsToSet():SetClass {
        return new SetClass(this.content.elemsToSet());
    }

    /**
     * Reduces each element of the bag
     * fx could be executed over several instance of the same element
     * The amount of time the element is in the bag
     * @param fx
     * @param defaultValue
     */
    reduce(fx:Function,defaultValue){
        for (const elem of this.content.toArray()) {
            defaultValue = fx(elem,defaultValue)
        }
        return defaultValue;
    }

    /**
     * This is usually but not enforced to be a number
     * @returns {*}
     */
    sum(attr?: String) {
        return this.reduce((elem, currSum) => {
            if (attr === undefined) {
                return elem + currSum;
            }else {
                return elem[attr]+currSum;
            }
        }, 0);
    }

    /**
     * This is usually but not enforced to be a number
     * 0 if empty
     * @returns {*}
     */
    avg(attr?: String) {
        if (this.size() === 0) {
            return 0
        }
        return this.sum(attr) / this.size();
    }

    /**
     * Sorts using compareFx returns a list
     * @param compareFx
     */
    sort(compareFx?: Function): ListClass {
        let list = []
        let counter = 0;
        for (const elem of this.content.toArray()) {
            list[counter++]=elem;
        }
        if (typeof compareFx === "undefined") {
            arrayToList(list.sort());
        } else {
            arrayToList(list.sort(compareFx));
        }
        return arrayToList(list);
    }
}

/**
 * Action to create a bag
 * @returns {BagClass}
 * @constructor
 */
const Bag = function (): BagClass {
    return new BagClass(BagUtils.createBag(arguments));
}

const arrayToBag= function (array): BagClass {
    return new BagClass(BagUtils.createBag(array));
}