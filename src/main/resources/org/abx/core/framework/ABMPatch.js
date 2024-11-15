/**
 * A class to store the ABM patch
 */
class ABMPatch extends ABMEntity {
    patchXY; //The xy in obj format
    center; //The center in 0.5x0.5
    _xy;
    agents; //The agents for this patch
    xValue; //X in number format
    yValue; //T in number format
    #color; //Color of patch
    modified; //If color changed of patch

    //-----------------\\
    //- Setup section -\\
    //-----------------\\
    /**
     *
     * @param env
     * @param x
     * @param y
     */
    constructor(env: ABMEnv, x: UnitSystem | Number, y: UnitSystem | Number) {
        super(env);
        this.patchXY = {x: x, y: y};
        this.center = {};
        this._xy= {};
        this.size = 1;
        if (x instanceof UnitSystem) {
            this.xValue = x.value;
            this.center.x = new UnitSystem(x.compExpPrefix, x.value + 0.5);
            this._xy.x= this.center.x.value;
            this.yValue = y.value
            this.center.y = new UnitSystem(y.compExpPrefix, y.value + 0.5);
            this._xy.y= this.center.y.value;
        } else {
            this.xValue = x;
            this._xy.x=  this.center.x = x + 0.5;
            this.yValue = y;
            this._xy.y= this.center.y = y + 0.5;
        }
        this.agents = Set();
        this.#color = namedColor("white");
    }

    //----------------------------\\
    //- Agent management section -\\
    //----------------------------\\

    add(agent: ABMAgent): void {
        this.agents.append(agent);
    }

    /**
     * Returns agents of this patch
     * @param classType
     * @returns {SetClass|*}
     */
    getAgents(classType?: Function): SetClass {
        if (classType === undefined) {
            return this.agents;
        } else {
            const listOfAgents = Set();
            this.agents.each((agent: ABMAgent) => {
                if (agent instanceof classType) {
                    listOfAgents.append(agent);
                }
            });
            return listOfAgents;
        }
    }

    /**
     * Remove agent from this patch
     * @param agent
     */
    remove(agent: ABMAgent): void {
        this.agents.remove(agent);
    }

    /**
     * Checks if not agent on this patch
     * @returns {boolean}
     */
    isEmpty(): Boolean {
        return this.agents.size() === 0;
    }

    size(): Number {
        return this.agents.size();
    }

    one(): ABMAgent {
        return this.agents.one();
    }

    //-------------------\\
    //- Drawing section -\\
    //-------------------\\
    set color(color) {
        if (this.#color != color) {
            this.modified = true;
            this.#color = color;
        }
    }

    get color() {
        return this.#color;
    }

    //---------------------\\
    //- Searching section -\\
    //---------------------\\
    /**
    * Moore Edge
     */
    mooreEdge(length: Number) {
        if (length !== Math.floor(length)) {
            throw "Moore Edge can only be calculated with Integers";
        }
        return this.grid.mooreEdge(this.xValue, this.yValue, length);
    }

    /**
    * Each more edge
     */
    eachMooreEdge(length: Number, fx: Function) {
        if (length !== Math.floor(length)) {
            throw "Moore Edge can only be calculated with Integers";
        }
        return this.grid.eachMooreEdge(this.xValue, this.yValue, length,fx);
    }

    /**
     * Return the edge for moore neighborhood
     * @param length
     * @returns {[]}
     */
    jsMooreEdge(length: Number) {
        if (length !== Math.floor(length)) {
            throw "Moore Edge can only be calculated with Integers";
        }
        const results = [];
        let counter = 0;
        const yValueInit = this.yValue - length;
        const yValueEnd = this.yValue + length;
        for (let x = this.xValue - length; x <= this.xValue + length; ++x) {
            if (this.grid.checkXY(x, yValueInit)) {
                const [xImpl, yImpl] = this.grid.validateXYImpl(x, yValueInit);
                results[counter++] = this.grid.patchAtImpl(xImpl, yImpl);
            }
            if (this.grid.checkXY(x, yValueEnd)) {
                const [xImpl, yImpl] = this.grid.validateXYImpl(x, yValueEnd);
                results[counter++] = this.grid.patchAtImpl(xImpl, yImpl);
            }
        }
        const xValueInit = (this.xValue - length);
        const xValueEnd = (this.xValue + length);
        for (let y = this.yValue - length + 1; y < this.yValue + length; ++y) {
            if (this.grid.checkXY(xValueInit, y)) {
                const [Impl, yImpl] = this.grid.validateXYImpl(xValueInit, y);
                results[counter++] = this.grid.patchAtImpl(Impl, yImpl);
            }
            if (this.grid.checkXY(xValueEnd, y)) {
                const [Impl, yImpl] = this.grid.validateXYImpl(xValueEnd, y);
                results[counter++] = this.grid.patchAtImpl(Impl, yImpl);
            }
        }
        return results;
    }


    /**
     * Return the edge for moore neighborhood
     * @param length
     * @param fx
     * @returns {[]}
     */
    jsEachMooreEdge(length: Number, fx:Function):void {
        if (length !== Math.floor(length)) {
            throw "Moore Edge can only be calculated with Integers";
        }
        const yValueInit = this.yValue - length;
        const yValueEnd = this.yValue + length;
        for (let x = this.xValue - length; x <= this.xValue + length; ++x) {
            if (this.grid.checkXY(x, yValueInit)) {
                const [xImpl, yImpl] = this.grid.validateXYImpl(x, yValueInit);
                fx( this.grid.patchAtImpl(xImpl, yImpl));
            }
            if (this.grid.checkXY(x, yValueEnd)) {
                const [xImpl, yImpl] = this.grid.validateXYImpl(x, yValueEnd);
                fx( this.grid.patchAtImpl(xImpl, yImpl));
            }
        }
        const xValueInit = (this.xValue - length);
        const xValueEnd = (this.xValue + length);
        for (let y = this.yValue - length + 1; y < this.yValue + length; ++y) {
            if (this.grid.checkXY(xValueInit, y)) {
                const [xImpl, yImpl] = this.grid.validateXYImpl(xValueInit, y);
                fx( this.grid.patchAtImpl(xImpl, yImpl));
            }
            if (this.grid.checkXY(xValueEnd, y)) {
                const [xImpl, yImpl] = this.grid.validateXYImpl(xValueEnd, y);
                fx( this.grid.patchAtImpl(xImpl, yImpl));
            }
        }
    }

    /**
     * Return the moore neighborhood
     * @param length
     * @param self
     * @returns {[]}
     */
    moore(length: Number, self?: Boolean) {
        if (length !== Math.floor(length)) {
            throw "Moore can only be calculated with Integers";
        }
        return this.grid.moore(this.xValue, this.yValue, length, !self);
    }

    /**
     *
     * @param length
     * @param fx
     * @param self
     * @returns {[]|*|number}
     */
    eachMoore(length: Number, fx: Function, self?: Boolean) {
        if (length !== Math.floor(length)) {
            throw "Moore can only be calculated with Integers";
        }
        return this.grid.eachMoore(this.xValue, this.yValue, length, !self, fx);
    }


    /**
     * Return the moore neighborhood
     * @param length
     * @param self
     * @returns {[]}
     */
    jsMoore(length: Number, self?: Boolean) {
        if (length !== Math.floor(length)) {
            throw "Moore can only be calculated with Integers";
        }
        const notSelf = !self;
        const results = [];
        let counter = 0;
        for (let x = this.xValue - length; x <= this.xValue + length; ++x) {
            for (let y = this.yValue - length; y <= this.yValue + length; ++y) {
                if (this.grid.checkXY(x, y)) {
                    const [xImpl, yImpl] = this.grid.validateXYImpl(x, y);
                    const patchToAdd = this.grid.patchAtImpl(xImpl, yImpl);
                    if (notSelf && (patchToAdd === this)) {
                        continue;
                    }
                    results[counter++] = patchToAdd;
                }
            }
        }
        return results;
    }

    /**
     * Return the moore neighborhood
     * @param length
     * @param fx
     * @param self
     * @returns {[]}
     */
    jsEachMoore(length: Number, fx: Function, self?: Boolean) {
        if (length !== Math.floor(length)) {
            throw "Moore can only be calculated with Integers";
        }
        const notSelf = !self;
        const results = [];
        for (let x = this.xValue - length; x <= this.xValue + length; ++x) {
            for (let y = this.yValue - length; y <= this.yValue + length; ++y) {
                if (this.grid.checkXY(x, y)) {
                    const [xImpl, yImpl] = this.grid.validateXYImpl(x, y);
                    const patchToAdd = this.grid.patchAtImpl(xImpl, yImpl);
                    if (notSelf && (patchToAdd === this)) {
                        continue;
                    }
                    fx(patchToAdd);
                }
            }
        }
        return results;
    }


    /**
     * Return the Von Newman neighborhood
     * @param length
     * @param self
     * @returns {[]}
     */
    VonNeuman(length: Number, self?: Boolean) {
        if (length !== Math.floor(length)) {
            throw "Moore can only be calculated with Integers";
        }
        return this.grid.VonNeuman(this.xValue, this.yValue, length, !self);
    }
    /**
     * Return the Von Newman neighborhood
     * @param length
     * @param self
     * @returns {[]}
     */
    eachVonNeuman(length: Number, fx:Function, self?: Boolean):void {
        if (length !== Math.floor(length)) {
            throw "Moore can only be calculated with Integers";
        }
        return this.grid.eachVonNeuman(this.xValue, this.yValue, length, !self,fx);
    }


    /**
     * Return the Von Newman neighborhood
     * @param length
     * @param self
     * @returns {[]}
     */
    jsVonNeuman(length: Number, self?: Boolean) {
        if (length !== Math.floor(length)) {
            throw "Von Newman can only be calculated with Integers";
        }
        const notSelf = !self;
        const results = [];
        let counter = 0;
        for (let x = -length; x <= length; ++x) {
            const VonNeumanValue = length - (Math.abs(x));
            for (let y = -VonNeumanValue; y <= VonNeumanValue; ++y) {
                if (this.grid.checkXY(this.xValue + x, this.yValue + y)) {
                    const [xImpl, yImpl] = this.grid.validateXY(this.xValue + x, this.yValue + y);
                    const patchToAdd = this.grid.patchAtImpl(xImpl, yImpl);
                    if (notSelf && (patchToAdd === this)) {
                        continue;
                    }
                    results[counter++] = patchToAdd;
                }
            }
        }
        return results;
    }

    /**
     * Return the Von Newman neighborhood
     * @param length
     * @param fx
     * @param self
     * @returns {[]}
     */
    jsEachVonNeuman(length: Number, fx: Function, self?: Boolean):void{
        if (length !== Math.floor(length)) {
            throw "Von Newman can only be calculated with Integers";
        }
        const notSelf = !self;
        for (let x = -length; x <= length; ++x) {
            const VonNeumanValue = length - (Math.abs(x));
            for (let y = -VonNeumanValue; y <= VonNeumanValue; ++y) {
                if (this.grid.checkXY(this.xValue + x, this.yValue + y)) {
                    const [xImpl, yImpl] = this.grid.validateXY(this.xValue + x, this.yValue + y);
                    const patchToAdd = this.grid.patchAtImpl(xImpl, yImpl);
                    if (notSelf && (patchToAdd === this)) {
                        continue;
                    }
                    fx(patchToAdd);
                }
            }
        }
    }


    //-----------------\\
    //- Utils section -\\
    //-----------------\\

    //XY in abs values
    xy() {
        return this._xy;
    }

    location(){
        return this.patchXY;
    }
    toString(): String {
        return `(${this.xValue}, ${this.yValue})`;
    }

    str(): String {
        if (this.isEmpty()) {
            return " ";
        } else {
            return this.one().str();
        }

    }
}