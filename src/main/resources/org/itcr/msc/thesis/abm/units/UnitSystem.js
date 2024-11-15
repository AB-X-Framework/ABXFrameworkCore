/**
 * Class with a prefix.
 * It uses full name
 * km - kilometer
 * m - meter
 * h - hour
 * s - second
 */
class Prefix {
    /**
     * Name
     */
    name

    /**
     * Map of all bigger
     */
    biggerSet
    /**
     * Maps prefixName with scale
     */
    scaleMap

    /**
     * Prefix base unit
     */
    baseUnit

    constructor(baseUnit: BaseUnit, name: String) {
        this.baseUnit = baseUnit
        this.name = name;
        this.biggerSet = Set();
        this.scaleMap = {};
    }
}

/**
 * Class with a prefix and that prefix scale
 */
class ExpPrefix {
    /**
     * Base Unit
     */
    baseUnit

    /**
     * Prefix
     */
    prefix

    /**
     * Scale
     */
    exponent

    constructor(baseUnit: BaseUnit, prefix: Prefix, exponent?: Number) {
        this.baseUnit = baseUnit;
        this.prefix = prefix;
        this.exponent = typeof exponent === "undefined" ? 1 : exponent
    }

    /**
     * Checks if two values have same unit type and scale
     * @param other
     * @returns {boolean}
     */
    sameExpUnit(other: ExpPrefix): Boolean {
        return this.prefix.baseUnit === other.prefix.baseUnit && this.scale === other.scale;
    }

    /**
     * Checks if two prefixes are the same
     * @param otherExpPrefix expected to have same scale
     * @returns {boolean}
     */
    sameExpPrefix(otherExpPrefix: ExpPrefix): Boolean {
        return this.prefix === otherExpPrefix.prefix;
    }

    /**
     * Checks if the prefix is smaller than otherExpPrefix
     * @param otherExpPrefix
     * @returns {boolean}
     */
    smallerExpPrefixThan(otherExpPrefix: ExpPrefix): Boolean {
        return this.prefix.biggerSet.contains(otherExpPrefix.prefix.name);
    }

    /**
     * Multiple scales
     * @param expPrefix
     * @returns {ExpPrefix}
     */
    multiplyExp(expPrefix: ExpPrefix): ExpPrefix {
        return new ExpPrefix(this.baseUnit, this.prefix, this.exponent + expPrefix.exponent)
    }

    /**
     * Returns t
     * @returns {string}
     */
    toString(): String {
        if (this.exponent === 1) {
            return this.prefix.name;
        } else {
            if (this.exponent < 0) {
                if (this.exponent !== -1) {
                    return "/" + this.prefix.name + "^" + this.exponent;
                } else {
                    return "/" + this.prefix.name;
                }
            } else {
                return this.prefix.name + "^" + this.exponent;
            }
        }
    }

    /**
     * Returns [factor, scale]
     * @param expPrefix
     * @returns {number}
     */
    getScalingFactor(expPrefix: ExpPrefix): Number {
        const factor = this.prefix.scaleMap[expPrefix.prefix.name];
        return Math.pow(factor, this.exponent);
    }

    /**
     * Inverses this exponential
     * @returns {ExpPrefix}
     */
    inverse(): ExpPrefix {
        return new ExpPrefix(this.baseUnit, this.prefix, -this.exponent)
    }
}

/**
 * Handles list of exponential prefixes
 */
class CompExpPrefix {
    expPrefixesMap

    constructor(prefix: ExpPrefix| Object) {
        if (ExpPrefix.prototype.isPrototypeOf(prefix)) {
            this.expPrefixesMap = {};
            this.expPrefixesMap[prefix.baseUnit.name] = prefix;
        } else {
            this.expPrefixesMap = prefix;
        }
    }

    /**
     * Returns true if both units has same exponential unit
     * Even if prefixes varies
     * @param otherCompExpPrefix
     * @returns {boolean}
     */
    sameCompExpUnit(otherCompExpPrefix: CompExpPrefix): Boolean {
        if (Object.keys(this.expPrefixesMap).length !== Object.keys(otherCompExpPrefix.expPrefixesMap).length) {
            return false;
        }
        for (let baseUnitName of Object.keys(this.expPrefixesMap)) {
            const otherExpPrefix = otherCompExpPrefix.expPrefixesMap[baseUnitName];
            if (typeof otherExpPrefix === "undefined") {
                return false;
            }
            if (otherExpPrefix.exponent !== this.expPrefixesMap[baseUnitName].exponent) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns true if both units have same list of prefixes
     * @param otherCompExpPrefix should have the same exponential units
     * @returns {boolean}
     */
    sameCompExpPrefix(otherCompExpPrefix: CompExpPrefix): Boolean {
        for (let baseUnitName of Object.keys(this.expPrefixesMap)) {
            if (this.expPrefixesMap[baseUnitName].prefix !== otherCompExpPrefix.expPrefixesMap[baseUnitName].prefix) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns list composite prefixes with the highest values
     * @param otherCompExpPrefix should have the same exponential units
     * @returns  {CompExpPrefix}
     */
    getBiggestCompExpPrefix(otherCompExpPrefix: CompExpPrefix): CompExpPrefix {
        const biggestExpPrefixMap = {};
        for (let baseUnitName of Object.keys(this.expPrefixesMap)) {
            const expPrefixA = this.expPrefixesMap[baseUnitName];
            const expPrefixB = otherCompExpPrefix.expPrefixesMap[baseUnitName];
            if (expPrefixA.smallerExpPrefixThan(expPrefixB)) {
                biggestExpPrefixMap[baseUnitName] = expPrefixB;
            } else {
                biggestExpPrefixMap[baseUnitName] = expPrefixA;
            }
        }
        return new CompExpPrefix(biggestExpPrefixMap);
    }

    /**
     * Returns this composite with prefixes which matches the desired composite
     * @param otherCompExpPrefix could have more or less prefixes than this
     * @returns  {CompExpPrefix}
     */
    matchTo(otherCompExpPrefix: CompExpPrefix): CompExpPrefix {
        const matchingExpPrefixMap = {};
        for (let baseUnitName of Object.keys(this.expPrefixesMap)) {
            const expPrefixA = this.expPrefixesMap[baseUnitName];
            const expPrefixB = otherCompExpPrefix.expPrefixesMap[baseUnitName];
            if (typeof expPrefixB === "undefined") {
                matchingExpPrefixMap[baseUnitName] = expPrefixA;
            } else {
                matchingExpPrefixMap[baseUnitName] = new ExpPrefix(expPrefixA.baseUnit, expPrefixB.prefix, expPrefixA.exponent);

            }
        }
        return new CompExpPrefix(matchingExpPrefixMap);
    }

    /**
     * Provides scaling factor to change to otherCompExpPrefix
     * @param otherCompExpPrefix expects to have same exp unit
     * @returns {number}
     */
    getScalingFactor(otherCompExpPrefix: CompExpPrefix): Number {
        let scaleFactor = 1.0;
        for (let baseUnitName of Object.keys(this.expPrefixesMap)) {
            const expPrefixA = this.expPrefixesMap[baseUnitName];
            const expPrefixB = otherCompExpPrefix.expPrefixesMap[baseUnitName];
            scaleFactor *= expPrefixA.getScalingFactor(expPrefixB);
        }
        return scaleFactor;
    }

    /**
     * Inverses this composite exp prefix
     * @returns {CompExpPrefix}
     */
    inverse(): CompExpPrefix {
        const inverseExpPrefixMap = {};
        for (let baseUnitName of Object.keys(this.expPrefixesMap)) {
            const expPrefix = this.expPrefixesMap[baseUnitName];
            inverseExpPrefixMap[baseUnitName] = expPrefix.inverse();
        }
        return new CompExpPrefix(inverseExpPrefixMap);
    }

    /**
     * returns the multiplication of both CompExpPrefix
     * @param otherCompExpPrefix expects to have same exp prefix
     * @returns {CompExpPrefix}
     */
    multiply(otherCompExpPrefix: CompExpPrefix): CompExpPrefix {
        const multipliedExpPrefixMap = {};
        for (let baseUnitName of Object.keys(this.expPrefixesMap)) {
            const expPrefix = this.expPrefixesMap[baseUnitName];
            const otherExpPrefix = otherCompExpPrefix.expPrefixesMap[baseUnitName];
            if (typeof otherExpPrefix === "undefined") {
                multipliedExpPrefixMap[baseUnitName] = expPrefix;
            } else {
                const exponent = expPrefix.exponent + otherExpPrefix.exponent;
                if (exponent !== 0) {
                    multipliedExpPrefixMap[baseUnitName] = new ExpPrefix(expPrefix.baseUnit, expPrefix.prefix, exponent);
                }
            }
        }
        for (let baseUnitName in otherCompExpPrefix.expPrefixesMap) {
            const expPrefix = this.expPrefixesMap[baseUnitName];
            const otherExpPrefix = otherCompExpPrefix.expPrefixesMap[baseUnitName];
            if (typeof expPrefix === "undefined") {
                multipliedExpPrefixMap[baseUnitName] = otherExpPrefix;
            }
        }
        return new CompExpPrefix(multipliedExpPrefixMap)
    }

    toString(): String {
        let stringValue = "";
        let list = [];

        for (let baseUnitName of Object.keys(this.expPrefixesMap)) {
            list.push({"name": baseUnitName, "exp": this.expPrefixesMap[baseUnitName].exponent});
        }
        list.sort((a, b) => {
            return b.exp - a.exp;
        });
        for (let baseUnitName of list) {
            baseUnitName = baseUnitName.name;
            const expPrefix = this.expPrefixesMap[baseUnitName];
            stringValue += expPrefix.toString();
        }
        return stringValue;
    }

}


class BaseUnit {
    /**
     * Symbol
     */
    name;

    /**
     * List of prefixes
     */
    prefixes;

    constructor(name: String, prefixes: Array, global?: Boolean) {
        this.name = name;
        this.prefixes = [];
        const prefixLength = prefixes.length;
        let scale = 1;
        const magnitudes = {}
        for (let i = 0; i < prefixLength; ++i) {
            const prefix = prefixes[i];
            const newPrefix = new Prefix(this, prefix.name);
            magnitudes[newPrefix.name] = prefix.magnitude;
            this.prefixes.push(newPrefix);
            const namedUnit = new UnitSystem(new ExpPrefix(this, newPrefix), 1);
            this[prefix.name] = namedUnit;
            if (global) {
                window[prefix.name] = namedUnit;
            }
        }
        for (let i = 0; i < prefixLength; ++i) {
            const prefix = this.prefixes[i];
            scale = 1.0
            //Useful for printing
            prefix.scaleMap[prefix.name] = scale;
            for (let j = i - 1; j >= 0; --j) {
                const biggerPrefix = this.prefixes[j];
                prefix.biggerSet.append(biggerPrefix.name);
                scale /= magnitudes[biggerPrefix.name];
                prefix.scaleMap[biggerPrefix.name] = scale;
            }
            scale = magnitudes[prefix.name];
            for (let j = i + 1; j < prefixLength; ++j) {
                const smallerPrefix = this.prefixes[j];
                prefix.scaleMap[smallerPrefix.name] = scale;
                scale *= magnitudes[smallerPrefix.name];
            }
        }
    }
}


const UnitSystemOPs = Operators({
    "+"(a:UnitSystem, b:UnitSystem):UnitSystem {
        if (!a.sameCompExpUnit(b)) {
            throw "Different unit types.";
        }
        if (a.sameCompExpPrefix(b)) {
            return new UnitSystem(a.compExpPrefix, a.value + b.value);
        } else {
            const newCompExpPrefix = a.compExpPrefix.getBiggestCompExpPrefix(b.compExpPrefix);
            const newACompExpPrefix = a.compExpPrefix.matchTo(newCompExpPrefix);
            const newBCompExpPrefix = b.compExpPrefix.matchTo(newCompExpPrefix);
            const newValue = (a.value * a.compExpPrefix.getScalingFactor(newACompExpPrefix)) +
                (b.value * b.compExpPrefix.getScalingFactor(newBCompExpPrefix));
            return new UnitSystem(newCompExpPrefix, newValue);
        }
    },
    "-"(a:UnitSystem, b:UnitSystem):UnitSystem {
        if (!a.sameCompExpUnit(b)) {
            throw "Different unit types.";
        }
        if (a.sameCompExpPrefix(b)) {
            return new UnitSystem(a.compExpPrefix, a.value - b.value);
        } else {
            const newCompExpPrefix = a.compExpPrefix.getBiggestCompExpPrefix(b.compExpPrefix);
            const newACompExpPrefix = a.compExpPrefix.matchTo(newCompExpPrefix);
            const newBCompExpPrefix = b.compExpPrefix.matchTo(newCompExpPrefix);
            const newValue = (a.value * a.compExpPrefix.getScalingFactor(newACompExpPrefix)) -
                (b.value * b.compExpPrefix.getScalingFactor(newBCompExpPrefix));
            return new UnitSystem(newCompExpPrefix, newValue);
        }
    },
    "*"(a:UnitSystem, b:UnitSystem):UnitSystem {
        if (a.sameCompExpUnit(b) && a.sameCompExpPrefix(b)) {
            return new UnitSystem(a.compExpPrefix.multiply(b.compExpPrefix), a.value * b.value);
        } else {
            const newBCompExpPrefix = b.compExpPrefix.matchTo(a.compExpPrefix);
            const newValue = (a.value) *
                (b.value * b.compExpPrefix.getScalingFactor(newBCompExpPrefix));
            return new UnitSystem(a.compExpPrefix.multiply(newBCompExpPrefix), newValue);
        }
    },
    "/"(a:UnitSystem, b:UnitSystem):UnitSystem {
        return a * (b.inverse());
    },
    "<"(a:UnitSystem, b:UnitSystem):Boolean {
        if (!a.sameCompExpUnit(b)) {
            throw "Different unit types.";
        }
        if ( a.sameCompExpPrefix(b)) {
            return a.value < b.value;
        } else {
            return a.value < b.to(a).value;
        }
    },
    "=="(a:UnitSystem, b:UnitSystem):Boolean {
        if (!a.sameCompExpUnit(b)) {
            return false;
        }
        if ( a.sameCompExpPrefix(b)) {
            return a.value == b.value;
        } else {
            return a.value == b.to(a).value;
        }
    },
    ">"(a:UnitSystem, b:UnitSystem):Boolean {
        if (!a.sameCompExpUnit(b)) {
            throw "Different unit types.";
        }
        if ( a.sameCompExpPrefix(b)) {
            return a.value > b.value;
        } else {
            return a.value > b.to(a).value;
        }
    }

}, {
    right: Number, "*"(a, b: Number) {
        return new UnitSystem(a.compExpPrefix, a.value * b);
    }
}, {
    left: Number, "*"(a: Number, b) {
        return new UnitSystem(b.compExpPrefix, b.value * a);
    }
}, {
    right: Number, "/"(a, b: Number) {
        return new UnitSystem(a.compExpPrefix, a.value / b);
    }
}, {
    left: Number, "/"(a: Number, b) {
        return new UnitSystem(b.compExpPrefix.inverse(), a/ b.value);
    }
});

class UnitSystem extends UnitSystemOPs {
    /**
     * Prefix or magnitude
     */
    compExpPrefix;
    /**
     * Value for this prefix
     */
    value;

    constructor(prefix: ExpPrefix| CompExpPrefix, value: Number) {
        super();
        if (ExpPrefix.prototype.isPrototypeOf(prefix)) {
            this.compExpPrefix = new CompExpPrefix(prefix);
        } else {
            this.compExpPrefix = prefix;
        }
        this.value = value;
    }

    unit():UnitSystem{
        return new UnitSystem(this.compExpPrefix,1);
    }

    /**
     *
     * @param otherUnit
     * @returns {boolean}
     */
    sameCompExpUnit(otherUnit: UnitSystem): Boolean {
        return this.compExpPrefix.sameCompExpUnit(otherUnit.compExpPrefix);
    }

    /**
     *
     * @param other
     * @returns {Boolean|*}
     */
    sameCompExpPrefix(other: UnitSystem): Boolean {
        return this.compExpPrefix.sameCompExpPrefix(other.compExpPrefix);
    }

    /**
     * Raises to unit system
     * @param newCompExpPrefix
     * @returns {UnitSystem}
     */
    raiseToCompExpPrefix(newCompExpPrefix: CompExpPrefix): UnitSystem {
        const factor = this.compExpPrefix.getScalingFactor(newCompExpPrefix);
        const newValue = this.value * factor;
        return new UnitSystem(newCompExpPrefix, newValue);
    }

    /**
     * Returns with prefix
     * @param compExpPrefix
     * @returns {UnitSystem}
     */
    getWithPrefix(compExpPrefix: CompExpPrefix): UnitSystem {
        compExpPrefix = this.compExpPrefix.matchTo(compExpPrefix);
        return this.raiseToCompExpPrefix(compExpPrefix);
    }

    /**
     * Matches prefix unit System
     * @param prefix
     * @returns {string}
     */
    to(prefix: UnitSystem): UnitSystem {
        if (!UnitSystem.prototype.isPrototypeOf(prefix)) {
            throw "Invalid prefix " + prefix;
        }
        return this.getWithPrefix(prefix.compExpPrefix);
    }

    /**
     * Using current prefix
     * @returns {string}
     */
    toString(): String {
        return "" + this.value + this.compExpPrefix.toString();
    }

    toJSON():String{
        return this.toString();
    }

    /**
     * return 1/value
     * @returns {UnitSystem}
     */
    inverse(): UnitSystem {
        return new UnitSystem(this.compExpPrefix.inverse(), 1 / this.value);
    }
}




