/**
 * List utility wrapper around array
 */
const ListOps = Operators({
        "=="(a: ListClass, b: ListClass) {
            if (a.size() !== b.size()){
                return false;
            }
            for (let i = a.size()-1;i>=0;--i){
                if (a.content[i]!= b.content[i]){
                    return false;
                }
            }
            return true;
        }
    }
);


class ListClass extends ListOps{

    /**
     * and array
     * @param contents
     */
    constructor(contents) {
        super();
        this.content = contents;
    }


    /**
     * Appends an object to the set
     * @returns {SetClass} the same set
     * @param object
     */
    append(object: Object): ListClass {
        this.content.push(object);
        return this;
    }

    /**
     * Process each element with fx
     * @param fx
     * @param shuffle
     * @returns {SetClass}
     */
    each(fx): ListClass {
        for (const elem of this.content) {
            fx(elem);
        }
        return this;
    }


    /**
     * Appends all element from the other set to this set
     * @param set
     * @returns {SetClass}
     */
    appendAll(list: ListClass): ListClass {
        const self = parent;
        list.each((elem):void=>{
           self.append(elem);
        });
        return this;
    }

    /**
     * Gets the sid eof the set
     * @returns {*}
     */
    size = function (): Number {
        return this.content.length;
    }

    /**
     * Returns new set with values which are true for the funtion fx
     * @param fx
     * @param shuffle
     * @returns {SetClass}
     */
    filter(fx: Function): ListClass {
        const newList = [];
        for (const elem of this.content) {
            const result = fx(elem);
            if (result) {
                newList.push(elem)
            }
        }
        return arrayToList(newList);
    }

    /**
     * Check if list is empty
     * @returns {boolean}
     */
    isEmpty(): Boolean {
        return this.content.length===0;
    }

    /**
     * Reduces using fx and the default value.
     * @param fx First param is the elem and second is the current default value
     * @param defaultValue
     * @param shuffle
     */
    reduce(fx: Function, defaultValue) {
        for (const elem of this.content) {
            defaultValue = fx(elem, defaultValue)
        }
        return defaultValue;
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

    one():Object|null{
        const size = this.size();
        if (size === 0){
            return null;
        }else {
            return this.content[randomInt(this.size())];
        }
    };

    /**
     * Remove one instance if in list
     * @param object
     * @returns {ListClass}
     */
    remove(object):ListClass{
        let index= this.content.indexOf(object);
        if (index !== -1) {
            this.content.splice(index, 1);
        }
        return this;
    }

    /**
     * Remove all times object is in this list
     * @param object
     * @returns {ListClass}
     */
    removeAll(object):ListClass{
        let index= this.content.indexOf(object);
        while (index !== -1) {
            this.content.splice(index, 1);
             index= this.content.indexOf(object);
        }
        return this;
    }

    /**
     * Sorts using compareFx
     * @param compareFx
     */
    sort(compareFx?: Function): ListClass {
        if (typeof compareFx === "undefined") {
            content.sort();
        } else {
            content.sort(compareFx);
        }
        return this;
    }

    /**
     * Return size of list
     * @returns {*}
     */
    size():Number{
        return this.content.length;
    }

    /**
     * Reverse element of this list
     * @returns {ListClass}
     */
    reverse():ListClass{
        this.content.reverse();
        return this;
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
        if (this.content.length === 0) {
            return 0
        }
        return this.sum(attr) / this.content.length;
    }

    /**
     * Creates a new set with mapped values
     * @param fx
     * @param shuffle
     * @returns {SetClass}
     */

    maps(fx): ListClass {
        const newList = [];
        for (const elem of this.content) {
            const result = fx(elem);
            newList.push(result)
        }
        return arrayToList(newList);
    }

    /**
     * Set from this list
     * @returns {SetClass}
     */
    toSet():SetClass{
        return arrayToSet(this.content)
    }
    /**
     * Bag from this list
     * @returns {SetClass}
     */
    toBag():BagClass{
        return arrayToBag(this.content)
    }


    /**
     * True if a least any of the elements are true for fx
     * @param fx
     * @returns {boolean}
     */
    any(fx: Function):Boolean {
        for (const elem of this.content) {
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
        for (const elem of this.content) {
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
        for (const elem of this.content) {
            const result = fx(elem);
            if (result) {
                return elem;
            }
        }
        return true;
    }
}

const List = function():ListClass{
    const content = [];
    for (const elem of arguments){
        content.push(elem);
    }
    return arrayToList(content);
}

const arrayToList = function(array):ListClass{
    return new ListClass(array);
}