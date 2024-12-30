/**
 * The ABM Grid class
 */
var imgClient;

class ABMGrid {
    env; //The ABM environment

    w; //The width could be number of a prefixed unit. If using prefix, it should be same as h
    h;//The width could be number of a prefixed unit. If using prefix, it should be same as hw
    wValue;//Scalar
    hValue;//Scalar
    wHalf;//Scalar
    hHalf;//Scalar
    unit;//The unit
    gridType; //The grid type plane, torus or cylinder

    patchesMatrix; //Matrix of patches
    patchesSet; //A set with all patches

    agentStatus;//Id of agents plus it xy coordinates in the grid
    vertexStatus;//Id of agents plus it xy coordinates in the grid
    strokes;//Array of strokes
    patchClass;//Class (Function) of patches
    currScale;//Helper for draw image

    //-----------------\\
    //- Setup section -\\
    //-----------------\\

    /**
     * Default constructor
     * expected w and h the same prefix of both numbers
     * @param env
     * @param patchClass
     * @param w
     * @param h
     * @param gridType
     * @param seamless
     */
    constructor(env: ABMEnv, patchClass: Function,
                w: UnitSystem | Number, h: UnitSystem | Number,
                gridType: String, seamless: Boolean) {
        const validTypes = Set("plane", "cylinder", "torus");
        Assertions.assertTrue(gridType ∈ validTypes, `Type expected to be valid types ${validTypes}. Give ${gridType}`
    )
        ;
        this.env = env;
        this.currScale = 0;
        this.strokes = []
        this.patchClass = patchClass;
        this.checkUnit(w, h);
        this.w = w;
        this.h = h;
        if (w instanceof UnitSystem) {
            this.wValue = w.value;
            this.hValue = h.value;
            this.unit = w.unit();
        } else {
            this.hValue = h;
            this.wValue = w;
            this.unit = 1;
        }
        this.wHalf = this.wValue / 2;
        this.hHalf = this.hValue / 2;
        this.gridType = gridType;
        this.verticalLimit = this.gridType !== "torus";
        this.horizontalLimit = this.gridType === "plane";
        this.patchesMatrix = ABMFrameworkCore.createGrid
            (this.wValue, this.hValue, this.horizontalLimit, this.verticalLimit);
        this.agentStatus = {};
        this.vertexStatus = {};
        imgClient.setLimits(this.horizontalLimit, this.verticalLimit);
        imgClient.setSeamless(seamless);
    }

    /**
     * Check with w and h are the same type. both number or both prefixed units.
     * If prefixed unit the prefix should be same
     * @param w
     * @param h
     */
    checkUnit(w: UnitSystem | Number, h: UnitSystem | Number) {
        if (w instanceof UnitSystem) {
            if (!(h instanceof UnitSystem)) {
                throw "Both width/x and height/y should have same unit";
            } else if (!w.unit().sameCompExpUnit(h.unit())) {
                throw "Both width/x and height/y should have same unit";
            }
        } else {
            if (h instanceof UnitSystem) {
                throw "Both width/x and height/y should have same unit";
            }
        }
    }

    //----------------------------\\
    //- Patch management section -\\
    //----------------------------\\

    /**
     * Setup which creates patches
     */
    createPatches(): void {
        this.patchesSet = Set();
        for (let y = this.hValue - 1; y >= 0; --y) {
            for (let x = this.wValue - 1; x >= 0; --x) {
                const patch = new this.patchClass(this.env, x * this.unit, y * this.unit);
                this.patchesMatrix.patches[y][x] = patch;
                this.patchesSet.append(patch);
            }
        }
    }

    /**
     * Return all grid patches
     * @returns {*}
     */
    patches(): SetClass {
        return this.patchesSet;
    }

    /**
     * Checks if this xy are part of grid
     * @param x
     * @param y
     * @returns {boolean}
     */
    checkXY(x: Number, y: Number): Boolean {
        if (this.horizontalLimit && (x >= this.wValue || x < 0)) {
            return false;
        }
        if (this.verticalLimit && (y >= this.hValue || y < 0)) {
            return false;
        }
        return true;
    }

    checkX(x: Number): Boolean {
        if (this.horizontalLimit && (x >= this.wValue || x < 0)) {
            return false;
        }
        return true;
    }


    checkY(y: Number): Boolean {
        if (this.verticalLimit && (y >= this.hValue || y < 0)) {
            return false;
        }
        return true;
    }

    /**
     * Expects x and y to be ints
     * @param x
     * @param y
     * @returns {Number[]}
     */
    validateXYImpl(x: Number, y: Number) {
        return [positiveModule(x, this.wValue), positiveModule(y, this.hValue)];
    }

    /**
     * Expects x and y to be ints
     * @param x
     * @param y
     * @returns {Number[]}
     */
    validateXImpl(x: Number) {
        return positiveModule(x, this.wValue);
    }


    validateYImpl(y: Number) {
        return positiveModule(y, this.hValue);
    }

    /**
     * Return desired xy could have float
     * @param x
     * @param y
     * @returns {Number[]}
     */
    validateXY(x: Number, y: Number) {
        if (this.horizontalLimit) {
            if (x >= this.wValue) {
                x = this.wValue - 0.0001;
            } else if (x < 0) {
                x = 0;
            }
        } else {
            x = positiveModule(x, this.wValue);
        }
        if (this.verticalLimit) {
            if (y >= this.hValue) {
                y = this.hValue - 0.0001;
            } else if (y < 0) {
                y = 0;
            }
        } else {
            y = positiveModule(y, this.hValue);
        }
        return [x, y];
    }

    /**
     * Returns a patch in the x, y coordinates check for wrapping
     * @param x
     * @param y
     * @returns {ABMPatch}
     */
    patchAt(x: UnitSystem | Number, y: UnitSystem | Number): ABMPatch {
        if (x instanceof UnitSystem) {
            x = x.to(this.unit);
        }
        if (y instanceof UnitSystem) {
            y = y.to(this.unit);
        }
        let xValue;
        let yValue;
        if (x instanceof UnitSystem) {
            xValue = x.value;
        } else {
            xValue = x;
        }
        if (y instanceof UnitSystem) {
            yValue = y.value;
        } else {
            yValue = y;
        }
        [xValue, yValue] = this.validateXY(xValue, yValue);
        return this.patchAtImpl(Math.floor(xValue), Math.floor(yValue));
    }

    /**
     * Returns patch in the grid
     * @param x Expects x and y to be in the grid
     * @param y Expects x and y to be in the grid
     * @returns {*}
     */
    patchAtImpl(x: Number, y: Number): ABMPatch {
        return this.patchesMatrix.patches[y][x];
    }

    //----------------------------\\
    //- Agent management section -\\
    //----------------------------\\

    /**
     * Adds agent in the 0,0
     * @param agent
     */
    add(agent: ABMAgent): void {
        const x = 0.5;
        const y = 0.5;
        const patch = this.patchAtImpl(0, 0);
        this.agentStatus[agent.id] = {"patch": patch, "xy": {"x": x, "y": y}, "agent": agent};
        patch.add(agent);
    }

    /**
     * Adds agent in the 0,0
     * @param agent
     */
    addVertex(vertex: ABMVertex): void {
        const x = 0.5;
        const y = 0.5;
        const patch = this.patchAtImpl(0, 0);
        this.vertexStatus[vertex.id] = {"patch": patch, "xy": {"x": x, "y": y}, "vertex": vertex};
        patch.add(vertex);
    }
    /**
     * Remove agent from the grid
     * @param agent
     */
    remove(agent: ABMAgent) {
        const agentPatch = this.agentStatus[agent.id].patch;
        agentPatch.remove(agent);
        delete this.agentStatus[agent.id];
    }

    /**
     * Adds stroke which have a time limit
     * @param stroke
     */
    addStroke(stroke: ABMStroke) {
        this.strokes.unshift(stroke);
    }

    /**
     * Sets agent location in the grid
     * @param x
     * @param y
     * @param agent
     * @returns {*}
     */
    setLocation(x: UnitSystem | Number, y: UnitSystem | Number, agent: ABMAgent): ABMPatch {
        this.checkUnit(x, y);
        if (x instanceof UnitSystem) {
            x = x.to(this.unit);
            y = y.to(this.unit);
        }
        const initPatch = this.agentStatus[agent.id].patch;
        initPatch.remove(agent);
        let xValue;
        let yValue;
        if (x instanceof UnitSystem) {
            xValue = x.value;
        } else {
            xValue = x;
        }
        if (y instanceof UnitSystem) {
            yValue = y.value;
        } else {
            yValue = y;
        }
        [xValue, yValue] = this.validateXY(xValue, yValue);
        if (x instanceof UnitSystem) {
            x.value = xValue;
        } else {
            x = xValue;
        }
        if (y instanceof UnitSystem) {
            y.value = yValue;
        } else {
            y = yValue;
        }
        const newPatch = this.patchesMatrix.patches[Math.floor(yValue)][Math.floor(xValue)];
        this.agentStatus[agent.id] = {"patch": newPatch, "xy": {"x": xValue, "y": yValue}, "agent": agent};
        newPatch.add(agent);
        return newPatch;
    }

    /**
     * Sets a random location
     * @param agent
     * @returns {ABMPatch}
     */
    setRandomLocation(agent: ABMAgent): ABMPatch {
        const x = this.w * random();
        const y = this.h * random();
        return this.setLocation(x, y, agent);
    }

    setRandomPatch(agent: ABMAgent): ABMPatch {
        const x = randomInt(this.w)+0.5;
        const y =  randomInt(this.h)+0.5;
        return this.setLocation(x, y, agent);
    }

    /**
     * Gets patch of the agent
     * @param agent
     * @returns {*}
     */
    patchOf(agent: ABMAgent): ABMPatch {
        return this.agentStatus[agent.id].patch;
    }

    /**
     * XY coordinates of the agent
     * @param entity
     * @returns {any}
     */
    xy(agent: ABMAgent): Object {
        const result = Object.assign({}, this.agentStatus[agent.id].xy);
        return result;
    }


    /**
     * XY with unit of the agent
     * @param agent
     * @returns {any}
     */
    location(agent: ABMAgent): Object {
        const xy =   this.agentStatus[agent.id].xy;
        const result = {
            "x": this.unit*xy.x,
            "y": this.unit*xy.y
        };
        return result;
    }
    /**
     * Direction from init to end
     * Expected to have same prefix
     * @param xyInit
     * @param xyDest
     * @returns {ComplexClass}
     */
    vectorTo(xyInit, xyDest): ComplexClass {
        let dirX = xyDest.x - xyInit.x;
        let dirY = xyDest.y - xyInit.y;
        this.checkUnit(dirX, dirY);
        if (dirX instanceof UnitSystem) {
            if (!dirX.sameCompExpUnit(this.unit)) {
                throw `Different prefix ${dirX.compExpPrefix} not same as ${this.unit.compExpPrefix}`;
            }
            dirX = dirX.value;
            dirY = dirY.value;
        }
        if (!this.horizontalLimit) {
            if (Math.abs(dirX) > this.wHalf) {
                if (dirX < 0) {
                    dirX = this.wValue + dirX;
                } else {
                    dirX = dirX - this.wValue;
                }
            }
        }
        if (!this.verticalLimit) {
            if (Math.abs(dirY) > this.hHalf) {
                if (dirY < 0) {
                    dirY = this.hValue + dirY;
                } else {
                    dirY = dirY - this.hValue;
                }
            }
        }
        return Complex(dirX, dirY)
    }

    /**
     * Direction of the facing vector
     * @param xyInit
     * @param xyDest
     * @returns {ComplexClass}
     */
    face(xyInit, xyDest): ComplexClass {
        const vector = this.vectorTo(xyInit, xyDest);
        return vector.normalize();
    }

    //---------------------\\
    //- Searching section -\\
    //---------------------\\
    /**
     * Helper method to find nearest agent
     * @param cacheElement
     * @returns {null}
     */
    #nearestInCache(cacheElement): ABMAgent {
        let nearestDistance = Number.MAX_SAFE_INTEGER;
        let nearestElement = null;
        for (const elemId of Object.keys(cacheElement)) {
            const elem = cacheElement[elemId];
            if (elem.dist < nearestDistance) {
                nearestDistance = elem.dist;
                nearestElement = elem.agent;
            }
        }
        return nearestElement;
    }

    /**
     * Helper method to find nearest agent
     * @param targetAgent
     * @param xy
     * @param patches
     * @param classType
     * @param cache
     */
    #addAgentsToCache(targetAgent: ABMAgent, xy, patch: ABMPatch, classType?: Function, cache): void {
        const agents = patch.getAgents(classType);
        agents.each((agent: ABMAgent): void => {
            if (agent === targetAgent) {
                return;
            }
            const distance = this.vectorTo(xy, agent.xy()).mag;
            const intDist = Math.ceil(distance);
            if (cache[intDist] === undefined) {
                cache[intDist] = [];
            }
            cache[intDist][agent.id] = {"agent": agent, "dist": distance}
            this.cache = cache;
        });

    }

    /**
     *
     * @param x
     * @param y
     * @param length
     * @param self
     * @returns {[]|*}
     */
    moore(x: Number, y: Number, length: Number, notSelf: Boolean) {
        return this.patchesMatrix.moore(x, y, length, notSelf);
    }

    /**
     *
     * @param x
     * @param y
     * @param length
     * @param notSelf
     * @param fx
     * @returns {[]|*}
     */
    eachMoore(x: Number, y: Number, length: Number, notSelf: Boolean, fx: Function) {
        return this.patchesMatrix.eachMoore(x, y, length, notSelf, fx);
    }


    /**
     *
     * @param x
     * @param y
     * @param length
     * @param fx
     * @returns {[]|*}
     */
    mooreEdge(x: Number, y: Number, length: Number) {
        return this.patchesMatrix.mooreEdge(x, y, length);
    }

    /**
     *
     * @param x
     * @param y
     * @param length
     * @param fx
     * @returns {[]|*}
     */
    eachMooreEdge(x: Number, y: Number, length: Number, fx: Function): void {
        this.patchesMatrix.eachMooreEdge(x, y, length, fx);
    }

    /**
     *
     * @param x
     * @param y
     * @param length
     * @param notSelf
     * @returns {[]|*}
     */
    VonNeumann(x: Number, y: Number, length: Number, notSelf: Boolean) {
        return this.patchesMatrix.VonNeumann(x, y, length, notSelf);
    }


    /**
     *
     * @param x
     * @param y
     * @param length
     * @param notSelf
     * @returns {[]|*}
     */
    eachVonNeuman(x: Number, y: Number, length: Number, notSelf: Boolean, fx: Function): void {
        this.patchesMatrix.eachVonNeuman(x, y, length, notSelf, fx);
    }

    /**
     * Helper method to find nearest agent
     * @param agent The original agent
     * @param xy The XY of the agent
     * @param patch The patch to be processed
     * @param distance The working distance
     * @param maxDistance The max distance if any
     * @param cache the current cache
     * @param classType The searching agent class if any
     * @returns {ABMAgent|null}
     */
    #nearestAgentAux(agent: ABMAgent, xy, patch: ABMPatch, distance: Number, maxDistance?: Number,
                     cache, classType?: Function): ABMAgent | null {
        if (distance > this.wValue && distance > this.hValue) {
            //No one found
            return null;
        }
        if (maxDistance !== undefined && distance > maxDistance) {
            //No one found
            return null;
        }
        if (cache[distance] !== undefined) {
            return this.#nearestInCache(cache[distance]);
        }
        ++distance;
        patch.eachMooreEdge(Math.ceil(distance), (mePatch: ABMPatch) => {
            this.#addAgentsToCache(agent, xy, mePatch, classType, cache);
        });

        return this.#nearestAgentAux(agent, xy, patch, distance, maxDistance, cache, classType);
    }

    /**
     * Method to quickly find the nearest agent
     * @param agent
     * @param classType
     * @param maxDistance
     * @returns {ABMAgent}
     */
    nearestAgent(agent: ABMAgent, classType?: Function, maxDistance?: Number): ABMAgent | null {
        const patch = agent.patchOf();
        const xy = agent.xy();
        const cache = {};
        patch.eachMoore(1, (mPatch: ABMPatch) => {
            this.#addAgentsToCache(agent, xy, mPatch, classType, cache);
        }, true);

        if (cache[0] !== undefined) {
            return this.#nearestInCache(cache[0]);
        }
        return this.#nearestAgentAux(agent, xy, patch, 1, maxDistance,
            cache, classType);
    }

    /**
     * Method to get all patches which center is equal or less than the radius
     * @param agent
     * @param radius
     * @returns {[]}
     */
    patchesInRadius(agent: ABMAgent, radius: UnitSystem | Number) {
        if (radius instanceof UnitSystem) {
            radius = radius.to(this.unit).value;
        }
        const xy = agent.xy();
        if (xy.x instanceof UnitSystem) {
            xy.x = xy.x.to(this.unit).value;
            xy.y = xy.y.to(this.unit).value;
        }
        return this.patchesMatrix.patchesInRadius(xy.x, xy.y, radius);
    }

    /**
     *
     * @param agent
     * @param radius
     * @param fx
     * @returns {[]|*}
     */
    eachPatchInRadius(agent: ABMAgent, radius: UnitSystem | Number, fx: Function) {
        if (radius instanceof UnitSystem) {
            radius = radius.to(this.unit).value;
        }
        const xy = agent.xy();
        if (xy.x instanceof UnitSystem) {
            xy.x = xy.x.to(this.unit).value;
            xy.y = xy.y.to(this.unit).value;
        }
        return this.patchesMatrix.eachPatchInRadius(xy.x, xy.y, radius, fx);
    }

    agentsInRadius(agent: ABMAgent, radius: UnitSystem | Number, classType?: Function) {
        let counter = 0;
        let agents = [];
        let addToAgents = (agent: ABMAgent): void => {
            agents[counter++] = agent;
        };
        this.eachAgentInRadius(agent, radius, addToAgents, classType);
        return agents;
    }

    eachAgentInRadius(agent: ABMAgent, radius: UnitSystem | Number,
                      fx: Function, classType?: Function): void {
        if (radius instanceof UnitSystem) {
            radius = radius.to(this.unit).value;
        }
        let self = this;
        let xy = agent.xy();
        let x = xy.x;
        let y = xy.y;
        let radSqr = radius * radius;
        let fullIn = (patch: ABMPatch): void => {
            patch.agents.each((patchAgent: ABMAgent): void => {
                if (agent !== patchAgent &&
                    (classType === undefined || (patchAgent instanceof classType))) {
                    fx(patchAgent);
                }
            });
        };
        let check = (patch: ABMPatch): void => {
            patch.agents.each((patchAgent: ABMAgent): void => {
                if (agent !== patchAgent &&
                    (classType === undefined || (patchAgent instanceof classType))) {
                    let pXY = patchAgent.xy();
                    let deltaX = Math.abs(pXY.x - x);
                    if (deltaX > self.wHalf && !this.horizontalLimit) {
                        deltaX = self.wValue - deltaX;
                    }
                    let deltaY = Math.abs(pXY.y - y);
                    if (deltaY > self.hHalf && !this.verticalLimit) {
                        deltaY = self.hValue - deltaY;
                    }
                    if (deltaX * deltaX + deltaY * deltaY <= radSqr) {
                        fx(patchAgent);
                    }
                }
            });
        }
        this.patchesMatrix.impPatches(x, y, radius, fullIn, check);
    }

    /**
     * Find agents which are located less than the radius from the original agent
     * @param agent
     * @param radius
     * @param classType
     * @returns {[]}
     */
    jsAgentsInRadius(agent: ABMAgent, radius: UnitSystem | Number, classType?: Function) {
        if (radius instanceof UnitSystem) {
            radius = radius.to(this.unit).value;
        }
        const min_radius = radius - 1;
        const max_radius = radius * 1.42;
        const patch = agent.patchOf();
        const results = [];
        let counter = 0;
        const length = Math.ceil(radius);
        const xValue = patch.xValue;
        const yValue = patch.yValue;
        for (let x = -length; x <= length; ++x) {
            let xImpl = xValue + x;
            if (!this.checkX(xImpl)) {
                continue;
            }
            const absX = Math.abs(x);
            xImpl = this.validateXImpl(xImpl);
            for (let y = -length; y <= length; ++y) {
                const absY = Math.abs(y);
                let yImpl = yValue + y;
                if (this.checkY(yImpl)) {
                    yImpl = this.validateYImpl(yImpl);
                    const patchToAdd = this.patchAtImpl(xImpl, yImpl);
                    //First case Von Newman
                    if (absX + absY <= min_radius) {
                        patchToAdd.agents.each((patchAgent: ABMAgent): void => {
                            if (agent !== patchAgent &&
                                (classType === undefined || (patchAgent instanceof classType))) {
                                results[counter++] = patchAgent;
                            }
                        });
                    } else if (absX + absY < max_radius) {
                        patchToAdd.agents.each((patchAgent: ABMAgent): void => {
                            if (agent !== patchAgent &&
                                (classType === undefined || (patchAgent instanceof classType))) {
                                const distToAgent = agent.distanceTo(patchAgent);
                                if (distToAgent <= radius) {
                                    results[counter++] = patchAgent;
                                }
                            }
                        });
                    }
                }
            }
        }
        return results;
    }

    //-------------------\\
    //- Drawing section -\\
    //-------------------\\
    /**
     * Draw the patches
     * @param newScale
     * @param wPixels
     * @param hPixels
     */
    drawPatches(newScale: Boolean, wPixels: Number, hPixels: Number): void {
        let patches = imgClient.patches();
        wPixels -= this.currScale;
        hPixels -= this.currScale;
        for (let x = this.wValue - 1; x >= 0; --x, wPixels -= this.currScale) {
            for (let y = 0, hMoving = hPixels; y < this.hValue; ++y, hMoving -= this.currScale) {
                const patch = this.patchesMatrix.patches[y][x];
                if (newScale || patch.modified) {
                    patches.setColor(patch.color);
                    patches.fillRect(wPixels, hMoving, this.currScale, this.currScale);
                }
            }
        }
    }


    /**
     * Draw relation arrows
     * @param agent
     * @param wPixels
     * @param hPixels
     */
    drawEntityRelations(agent: ABMAgent, wPixels: Number, hPixels: Number) {
        const origin = agent.xy();
        for (const relName of Object.keys(agent.outgoingRelations)) {
            const relations = agent.getRelationsMap(relName);
            for (const destId of Object.keys(relations)) {
                const link = relations[destId];
                if (!link.visible) {
                    continue;
                }
                const dest = link.dest;
                const end = dest.xy();
                let vector = this.vectorTo(origin, end);
                let offset = vector.withMag(agent.size);
                if (link.label !== undefined) {
                    let drawX = (origin.x + vector.r / 2) * this.currScale;
                    let drawY = (origin.y + vector.i / 2) * this.currScale;
                    imgClient.drawString(agent.drawingData, link.label, drawX, hPixels - drawY);
                    let changed = false;
                    if (!this.horizontalLimit) {
                        if (drawX < 0) {
                            drawX += wPixels;
                            changed = true;
                        } else if (drawX > wPixels) {
                            drawX -= wPixels;
                            changed = true;
                        }
                    }
                    if (!this.verticalLimit) {
                        if (drawY < 0) {
                            drawY += hPixels;
                            changed = true;
                        } else if (drawY > wPixels) {
                            drawY -= hPixels;
                            changed = true;
                        }
                    }
                    if (changed) {
                        imgClient.drawString(agent.drawingData, link.label, drawX, hPixels - drawY);
                    }
                }
                const lineOrigin = {x: origin.x + offset.r, y: origin.y + offset.i};
                let mag = vector.mag;
                mag = Math.max(0, mag - (agent.size + dest.size));
                vector = vector.withMag(mag);
                const stroke =
                    new ABMStroke(agent.layer, agent.pen, 1, lineOrigin, vector);
                stroke.setScale(this.currScale, hPixels);
                imgClient.drawStroke(agent.layer, stroke.color, stroke.width, stroke.scaled);
                let x = (lineOrigin.x + vector.r) * this.currScale;
                let y = hPixels - ((lineOrigin.y + vector.i) * this.currScale);
                if (!this.horizontalLimit) {
                    if (x < 0) {
                        x += wPixels;
                    } else if (x > wPixels) {
                        x -= wPixels;
                    }
                }
                if (!this.verticalLimit) {
                    if (y < 0) {
                        y += hPixels;
                    } else if (y > wPixels) {
                        y -= hPixels;
                    }
                }
                imgClient.drawAgent(imgClient.createArrow(agent.font, agent.layer, vector.angleDeg, agent.color, agent.size / 2), x, y);
            }
        }
    }

    /**
     * Draw agents
     * @param wPixels
     * @param hPixels
     * @param layers
     */
    drawAgents(wPixels: Number, hPixels: Number, layers): void {
        for (const agentId of Object.keys(this.agentStatus)) {
            const agentStatus = this.agentStatus[agentId];
            const agent = agentStatus.agent;
            if (agent.visible && layers.includes(agent.layer)) {
                const xy = agentStatus.xy;
                let x = xy.x;
                let y = xy.y;
                x = x * this.currScale;
                y = hPixels - (y * this.currScale);
                imgClient.drawAgent(agent.drawingData, x, y);
                if (agent.outgoingRelations !== undefined) {
                    this.drawEntityRelations(agent, wPixels, hPixels);
                }

            }
        }
    }


    /**
     * Draw agents
     * @param wPixels
     * @param hPixels
     * @param layers
     */
    drawVertices(wPixels: Number, hPixels: Number, layers): void {
        for (const vertexId of Object.keys(this.vertexStatus)) {
            const vertexStatus = this.vertexStatus[vertexId];
            const agent = vertexStatus.vertex;
            if (agent.visible && layers.includes(agent.layer)) {
                const xy = vertexStatus.xy;
                let x = xy.x;
                let y = xy.y;
                x = x * this.currScale;
                y = hPixels - (y * this.currScale);
                imgClient.drawAgent(agent.drawingData, x, y);
                if (agent.outgoingRelations !== undefined) {
                    this.drawEntityRelations(agent, wPixels, hPixels);
                }
            }
        }
    }


    /**
     * Draw strokes
     * @param scale
     * @param hPixels
     * @param layers
     */
    drawStrokes(scale: Number, hPixels: Number, layers): void {
        for (let i = this.strokes.length - 1; i >= 0; --i) {
            const stroke = this.strokes[i];
            if (!layers.includes(stroke.layer)) {
                continue;
            }
            stroke.setScale(scale, hPixels);
            imgClient.drawStroke(stroke.layer, stroke.color, stroke.width, stroke.scaled);
        }
    }

    /**
     * Helper from get img
     * @param scale
     * @param layers
     */
    baselineImg(scale: Number, layers) {
        const newScale = this.currScale !== scale;
        this.currScale = scale;
        let wPixels = this.wValue * this.currScale;
        let hPixels = this.hValue * this.currScale;
        //Creates or clear img
        imgClient.newImg(this.currScale, wPixels, hPixels);
        this.drawPatches(newScale, wPixels, hPixels);
        this.drawAgents(wPixels, hPixels, layers);
        this.drawVertices(wPixels, hPixels, layers);
        this.drawStrokes(this.currScale, hPixels, layers);

    }

    /**
     * Gets bytes[] of image
     * @param format
     * @param scale
     * @param layers
     * @returns {Object|*}
     */
    img(format: String, scale: Number, layers): Object {
        this.baselineImg(scale, layers);
        return imgClient.getImg(format);
    }

    /**
     * Gets buffered img
     * @param scale
     * @param layers
     * @returns {Object|*}
     */
    getImg(scale: Number, layers): Object {
        this.baselineImg(scale, layers);
        return imgClient.getImg();
    }

    //-----------------\\
    //- Utils section -\\
    //-----------------\\

    /**
     * Basic grid as text
     * @returns {string}
     */
    str(): String {
        let newline = "|";
        for (let x = 0; x < this.wValue; ++x) {
            newline += "-";
        }
        newline += "|\n";
        for (let y = this.hValue - 1; y >= 0; --y) {
            newline += "|";
            if (typeof this.patchesMatrix.patches[y] === "undefined") {
                for (let x = 0; x < this.wValue; ++x) {
                    newline += " ";
                }
            } else {
                for (let x = 0; x < this.wValue; ++x) {
                    let patch = this.patchesMatrix.patches[y][x];
                    if (typeof patch === "undefined") {
                        newline += " ";
                    } else {
                        newline += patch.str();
                    }
                }
            }
            newline += "|\n";
        }
        newline += "|";
        for (let x = 0; x < this.wValue; ++x) {
            newline += "-";
        }
        newline += "|";
        return newline;
    }

    /**
     * Size in patches of the grid
     * @returns {*[]}
     */
    getSize(): Object {
        return [this.wValue, this.hValue];
    }

    /**
     * Decrease lifespan of strokes
     */
    processStrokes() {
        for (let i = this.strokes.length - 1; i >= 0; --i) {
            const stroke = this.strokes[i];
            --stroke.aliveStrokeSteps;
            if (stroke.aliveStrokeSteps === 0) {
                this.strokes.splice(i, 1);
                continue;
            }
        }
    }
}

