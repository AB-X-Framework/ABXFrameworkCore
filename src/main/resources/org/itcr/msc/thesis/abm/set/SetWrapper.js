var SetUtils;
var Operators;


/**
 * Set Overloading operators
 */
const SetOPs = Operators({
        "-"(a: SetClass, b: SetClass) {
            return new SetClass(a.content.subtraction(b.content));
        },
        "=="(a: SetClass, b: SetClass) {
            return a.content.equals(b.content);
        }
    }
);

/**
 * Wrapper for Java Set class
 */
class SetClass extends SetOPs {
    content;

    constructor(contents) {
        super();
        this.content = contents;
    }

    toString(): String {
        let text = "[";
        let first = true;
        for (const elem of this.content.set(false)) {
            if (first) {
                first = false;
            } else {
                text += ",";
            }
            text += elem;
        }
        text += "]";
        return text;
    }

    /**
     * Confirm object is contained in set
     * @param object
     * @returns {*}
     */
    contains(object): Boolean {
        return this.content.__containsMember(object);
    }

    /**
     * Appends an object to the set
     * @returns {SetClass} the same set
     * @param object
     */
    append(object: Object): SetClass {
        this.content.append(object);
        return this;
    }

    /**
     * Appends all element from the other set to this set
     * @param set
     * @returns {SetClass}
     */
    appendAll(set: SetClass): SetClass {
        this.content.appendAll(set.content);
        return this;
    }

    /**
     * Removes one object from the set
     * @param object
     */
    remove(object): SetClass {
        this.content.remove(object);
        return this;
    }

    /**
     * Transform this object to a JSON
     * @returns {string}
     */
    toJSON(): String {
        return this.content.toString();
    }

    /**
     * Creates a new set with mapped values
     * @param fx
     * @param shuffle
     * @returns {SetClass}
     */
    maps(fx, shuffle?: Boolean): SetClass {
        const newSet = Set();
        if (typeof shuffle === "undefined") {
            shuffle = false;
        }
        for (const elem of this.content.set(shuffle)) {
            const result = fx(elem);
            if (typeof result === "undefined") {
                continue;
            }
            newSet.append(result)
        }
        return newSet;
    }

    /**
     * Process each element with fx
     * @param fx
     * @param shuffle
     * @returns {SetClass}
     */
    each(fx, shuffle?: Boolean): SetClass {
        if (typeof shuffle === "undefined") {
            shuffle = false;
        }
        for (const elem of this.content.set(shuffle)) {
            fx(elem);
        }
        return this;
    }

    duplicate():SetClass{
        return new SetClass(this.content.duplicate());
    }


    /**
     * Gets the sid eof the set
     * @returns {*}
     */
    size = function (): Number {
        return this.content.size();
    }


    /**
     * Returns new set with values which are true for the funtion fx
     * @param fx
     * @param shuffle
     * @returns {SetClass}
     */
    filter(fx: Function, shuffle?: Boolean): SetClass {
        if (typeof shuffle === "undefined") {
            shuffle = false;
        }
        const newSet = Set();
        for (const elem of this.content.set(shuffle)) {
            const result = fx(elem);
            if (result) {
                newSet.append(elem)
            }

        }
        return newSet;
    }

    /**
     * Return one element of the set
     * @returns {*|jQuery}
     */
    one(shuffle?: Boolean) {
        if (typeof shuffle === "undefined") {
            shuffle = false;
        }
        return this.content.one(shuffle);
    }

    /**
     * Returns a most count from the set
     * @param count
     * @param shuffle
     * @returns {SetClass}
     */
    some(count: Number,shuffle?: Boolean): SetClass {
        if (typeof shuffle === "undefined") {
            shuffle = false;
        }
        const newSet = Set();
        for (const elem of this.content.some(count,shuffle)) {
            newSet.append(elem);
        }
        return newSet;
    }

    /**
     * True if a least any of the elements are true for fx
     * @param fx
     * @returns {boolean}
     */
    any(fx: Function):Boolean {
        for (const elem of this.content.set(false)) {
            const result = fx(elem);
            if (result) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if all the elements are true for fx
     * @param fx
     * @returns {boolean}
     */
    every(fx: Function): Boolean {
        for (const elem of this.content.set) {
            const result = fx(elem);
            if (!result) {
                return false;
            }
        }
        return true;
    }

    /**
     * Return the first element which is true for fx
     * @param fx
     * @returns {boolean}
     */
    first(fx: Function): Boolean {
        for (const elem of this.content.set) {
            const result = fx(elem);
            if (result) {
                return elem;
            }
        }
        return true;
    }

    /**
     * Returns a most count from the set which matches fx
     * @param fx
     * @param count
     * @param shuffle
     * @returns {SetClass}
     */
    atMost(fx: Function, count: Number, shuffle?:Boolean): SetClass {
        const newSet = Set();
        if (typeof shuffle === "undefined"){
            shuffle=false;
        }
        for (const elem of this.content.set(shuffle)) {
            if (count === 0) {
                break;
            }
            const result = fx(elem);
            if (result) {
                newSet.append(elem);
                --count;
            }
        }
        return newSet;
    }

    /**
     * Reduces using fx and the default value.
     * @param fx First param is the elem and second is the current default value
     * @param defaultValue
     * @param shuffle
     */
    reduce(fx: Function, defaultValue,shuffle?:Boolean) {
        if (typeof shuffle === "undefined"){
            shuffle=false;
        }
        for (const elem of this.content.set(shuffle)) {
            defaultValue = fx(elem, defaultValue)
        }
        return defaultValue;
    }

    /**
     * Checks if set is empty
     * @returns {Boolean|*}
     */
    isEmpty(): Boolean {
        return this.content.isEmpty();
    }

    /**
     * Find the best element scored by fx (function or attribute)
     * @param fx if null identify is used
     * @returns {*}
     */
    best(fx?: Function| String) {
        if (typeof fx === "undefined") {
            fx = (x) => x;
        }
        if (typeof fx === "string") {
            const attr = fx;
            fx = (x) => x[attr];
        }
        return this.reduce((elem, bestSoFar) => {
            const newScore = fx(elem);
            if (newScore > bestSoFar.score) {
                return {"score": newScore, "elem": elem};
            } else {
                return bestSoFar;
            }
        }, {"score": Number.NEGATIVE_INFINITY, "elem": null}).elem;
    }

    /**
     * Find the worst element scored by fx
     * @param fx function or attribute
     * @returns {*}
     */
    worst(fx?: Function|String) {
        if (typeof fx === "undefined") {
            fx = (x) => x;
        }
        if (typeof fx === "string") {
            const attr = fx;
            fx = (x) => x[attr];
        }
        return this.best((x) => -fx(x));
    }

    /**
     * If fx is empty it will create a bag with only elements
     * If fx is string it will create a bag with the attributes of
     * If fx is a function it will create a bag with the result of the fx over the elements
     * @param fx
     * @returns {BagClass}
     */
    toBag(fx?: Function| String) {
        if (typeof fx === "undefined") {
            return Bag(this.content.set);
        } else if (typeof fx === "string") {
            const bag = Bag();
            this.maps((elem) => bag.add(elem[fx]));
            return bag;
        } else {
            const bag = Bag();
            this.maps((elem) => bag.add(fx(elem)));
            return bag;
        }
    }

    /**
     * Returns a set with the top scored elements by fx
     * @param count the max amount of elements, could be lower if set has fewer elements
     * @param fx is null it will use the standard sorting
     */
    top(count: Number, fx?: Function):SetClass {
        const sorted = this.sort(fx).reverse();
        const max = Math.min(sorted.size(), count);
        const result = Set();
        for (let i = 0; i < max; ++i) {
            result.append(sorted.content[i]);
        }
        return result;
    }

    /**
     * Returns a set with the worst scored elements by fx
     * @param count the max amount of elmetns, could be lower if set has fewer elements
     * @param fx is null it will use the standard sorting
     */
    bottom(count: Number, fx?: Function): SetClass {
        const sorted = this.sort(fx);
        const max = Math.min(sorted.size(), count);
        const result = Set();
        for (let i = 0; i < max; ++i) {
            result.append(sorted.content[i]);
        }
        return result;
    }

    /**
     * This is usually but not enforced to be a number
     * @returns The sum
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
     * @returns The average
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
        for (const elem of this.content.set(false)) {
            list.push(elem);
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
 * InfixOverloadingOperators
 */
const InfixOverloadingOperators = Operators({}, {
    right: SetClass,
    "+"(a, b: SetClass) {
        const result = eval(`a.content.${a.infix}(b.content)`);
        if (a.resultAsSet) {
            return new SetClass(result);
        } else {
            return result;
        }
    }
});

/**
 * Proxy object containing the infix operation
 */
class InfixContainer extends InfixOverloadingOperators {
    content;
    infix;
    resultAsSet;

    constructor(infix, contents, resultAsSet) {
        super();
        this.infix = infix;
        this.resultAsSet = resultAsSet;
        this.content = contents.content;
    }
}

processInfix = function (infix: String, resultAsSet) {
    SetClass.prototype[`_${infix}`] = function () {
        return new InfixContainer(infix, this, resultAsSet);
    }
}

/**
 * ReverseInfixOverloadingOperators
 */
const ReverseInfixOverloadingOperators = Operators({}, {
    right: SetClass,
    "+"(a, b: SetClass) {
        return eval(`b.content.${a.reverseInfix}(a.content)`);
    }
}, {
    right: BagClass,
    "+"(a, b: BagClass) {
        return eval(`b.content.${a.reverseInfix}(a.content)`);
    }
});

/**
 * Proxy object containing the reverse infix operation
 */
class ReverseInfixContainer extends ReverseInfixOverloadingOperators {
    content;
    reverseInfix;

    constructor(reverseInfix, content) {
        super();
        this.reverseInfix = reverseInfix;
        this.content = content;
    }
}

processReverseInfix = function (infix: String) {
    Object.prototype[`_${infix}`] = function () {
        return new ReverseInfixContainer(infix, this);
    }
}

/**
 * Set start method
 * @returns {SetClass}
 * @constructor
 */
const Set = function (): SetClass {
    return new SetClass(SetUtils.createSet(arguments));
}

/**
 * Set from an array
 * @param array
 * @returns {SetClass}
 */
const arrayToSet = function (array): SetClass {
    return new SetClass(SetUtils.createSet(array));
}
