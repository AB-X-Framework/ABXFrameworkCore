/**
 * The environment class
 * @type {null}
 */
let currEnv = null;
let currDelta = 1;
var ABMFrameworkCore;

class ABMEnv {
    currId; //The counter for id of next agent
    grid; //The environment grid
    #complete; //If this environment has achieved completion
    paused; //If this environment is paused
    teardownDone; //If this environment has executed teardown
    vertexSet; //The matrix of agents by class tpe
    agentSet; //The matrix of agents by class tpe
    patchClass; //The class of the patches
    currDelta; //THe delta defined in the setup specs
    currStep; //The current step
    timeCharts; //List of time charts
    histograms; //List of histograms charts
    custCharts; //List of histograms charts
    charts; //List of all charts including time and histograms


    //-----------------\\
    //- Setup section -\\
    //-----------------\\

    /**
     * The environment constructor
     * @param patchClass
     */
    constructor(patchClass?: Function) {
        this.agentSet = [];
        this.vertexSet =[];
        this.currStep = -1;
        this.agentSet[ABMAgent] = Set();
        this.timeCharts = {};
        this.charts = {};
        this.histograms = {};
        this.custCharts={};
        this.paused = false;
        this.#complete = false;
        this.currId = 0;
        if (typeof patchClass === "undefined") {
            this.patchClass = ABMPatch;
        } else {
            this.patchClass = patchClass;
        }
    }

    /**
     * Greate the grid
     * @param w
     * @param h
     * @param gridType
     * @param seamless
     * @param layers
     */
    createGrid(w?: UnitSystem | Number, h?: UnitSystem | Number,
               gridType?: String, seamless?: Boolean, layers): void {
        if (w === undefined) {
            w = 1;
        }
        if (h === undefined) {
            h = 1;
        }
        if (gridType === undefined) {
            gridType = "plane";
        }
        if (seamless === undefined) {
            seamless = false;
        }
        if (layers === undefined){
            layers = '["baseline"]';
        }else {
            layers = JSON.stringify(layers);
        }

        ABMFrameworkCore.layersUpdated(layers);
        imgClient.setLayers(layers)
        this.grid = new ABMGrid(this, this.patchClass, w, h, gridType, seamless);
        this.grid.createPatches();
    }

    setupEnv(specs): ABMEnv {
        this.teardownDone = false;
        this.currStep = 0;
        this.currDelta = specs.delta;
        this.createGrid(specs.w, specs.h, specs.gridType, specs.seamless, specs.layers);
        this.setup(specs);
        setScale(1);
        ABMFrameworkCore.currStep(this.currStep);
        this.patches();
        for (const chartName of Object.keys(this.timeCharts)) {
            this.timeCharts[chartName].triggerSample();
        }
        return this;
    }

    envStep():Boolean {
        if (this.paused) {
            return false;
        }
        if (this.#complete) {
            if (!this.teardownDone) {
                this.teardownDone = true;
                this.teardown();
            }
            return false;
        } else {
            this.grid.processStrokes();
            ABMFrameworkCore.currStep(++this.currStep);
            this.agentSet[ABMAgent].duplicate().each((agent) => {
                if (agent.alive){
                    agent.step(this.currDelta);
                }
            },true);
            this.step(this.currDelta);
            for (const chartName of Object.keys(this.timeCharts)) {
                this.timeCharts[chartName].triggerSample();
            }
            return true;
        }
    }

    //--------------------\\
    //- Charting section -\\
    //--------------------\\

    /**
     * Adds new chart specs
     * @param name
     * @param samplers
     */
    addTimeChart(name: String, samplers): ABMTimeChart {
        const timeChart = this.charts[name] = this.timeCharts[name] = new ABMTimeChart(this, name, samplers);
        ABMFrameworkCore.chartAdded(name);
        return timeChart;
    }

    /**
     * Adds a histogram
     * @param name
     * @param sampler
     * @param samplerType
     * @returns {ABMHistogram}
     */
    addHistogram(name: String, sampler:Function, samplerType: String): ABMHistogram {
        const histogram = this.charts[name] = this.histograms[name] = new ABMHistogram(this, name, sampler, samplerType);
        ABMFrameworkCore.chartAdded(name);
        return histogram;
    }

    addChart(name:String,samplers:Object, samplerType: String, labelGen?:Function): ABMChart {
        const custChart = this.charts[name] = this.custCharts[name]  =
            new ABMChart(name,samplers,samplerType,labelGen);
        ABMFrameworkCore.chartAdded(name);
        return custChart;
    }

    /**
     * Needs to be triggered manually
     */
    sampleHistograms():void {
        for (const chartName of Object.keys(this.histograms)) {
            this.histograms[chartName].triggerSample();
        }
    }

    /**
     * Needs to be triggered manually
     */
    sampleCharts():void{
        for (const chartName of Object.keys(this.custCharts)) {
            this.custCharts[chartName].triggerSample();
        }
    }

    /**
     * Gets chart data by name
     * @param name
     * @returns {*}
     */
    getChart(name: String) {
        return this.charts[name];
    }

    /**
     * Gets the chart data
     * @param name
     * @returns {Object|*}
     */
    getChartData(name: String): Object {
        return this.charts[name].getChartData();
    }

    //----------------------------\\
    //- Agent management section -\\
    //----------------------------\\

    /**
     * Utility for spawn and kill
     * @param clazz
     * @returns {[]}
     */
    getClasses(clazz:Function):Array{
        const classes = [];
        classes.push(clazz);
        while (clazz !== ABMAgent){
            clazz = Object.getPrototypeOf(clazz);
            classes.push(clazz);
        }
        return classes;
    }

    /**
     * Removes agent
     * @param agent
     */
    kill(agent:ABMAgent):void{
        agent.alive=false;
        for (const clazz of this.getClasses(agent.constructor)){
            this.agentSet[clazz].remove(agent);
        }
        this.grid.remove(agent);
        agent.dropAllRelations();
    }

    /**
     * Removes agent
     * @param agent
     */
    destroyVertex(vertex:ABMVertex):void{
        vertex.valid=false;
        for (const clazz of this.getClasses(vertex.constructor)){
            this.agentSet[clazz].remove(vertex);
        }
        vertex.dropAllRelations();
    }

    /**
     * Spans a new agent and add it to grid
     * @param agentType
     * @returns {*}
     */
    spawn(agentType: Function): ABMAgent {
        const agent = new agentType(this, agentType);
        for (const clazz of this.getClasses(agentType)){
            if ( this.agentSet[clazz] === undefined) {
                this.agentSet[clazz] = Set();
            }
            this.agentSet[clazz].append(agent);
        }
        return agent;
    }

    /**
     * Creates a vertex
     * @param vertexType
     * @returns {*}
     */
    createVertex(vertexType?: Function):ABMVertex{
        const agent = new vertexType(this, vertexType);
        for (const clazz of this.getClasses(vertexType)){
            if ( this.vertexSet[clazz] === undefined) {
                this.vertexSet[clazz] = Set();
            }
            this.vertexSet[clazz].append(agent);
        }
        return agent;
    }

    /**
     * List of agents by class
     * @param agentType
     * @returns {*}
     */
    agents(agentType?: Function): SetClass {
        if (typeof agentType === "undefined") {
            agentType = ABMAgent;
        }
        return this.agentSet [agentType];
    }

    //------------------------------\\
    //- Patches management section -\\
    //------------------------------\\
    /**
     * Returns list of patches
     * @returns {SetClass|*}
     */
    patches(): SetClass {
        return this.grid.patches();
    }

    /**
     * Return a patch at xy
     * @param x
     * @param y
     * @returns {ABMPatch|*}
     */
    patchAt(x: Number, y: Number): ABMPatch {
        return this.grid.patchAt(x, y);
    }

    //-----------------------\\
    //- Image utils section -\\
    //-----------------------\\

    img(format: String, scale: Number, layers): Object {
        return this.grid.img(format, scale, layers);
    }

    getImg(scale: Number, layers): Object {
        return this.grid.getImg(scale, layers);
    }

    //-----------------\\
    //- Utils section -\\
    //-----------------\\
    /**
     * Pauses this environment
     * @param paused
     */
    setPaused(paused: Boolean): void {
        if (this.complete) {
            return;
        }
        this.paused = paused;
        if (this.paused) {
            ABMFrameworkCore.simulationStatusUpdated("Env Paused");
        } else {
            ABMFrameworkCore.simulationStatusUpdated("Env Ready");
        }
    }

    /**
     * Expected to be overridden
     * @param specs
     */
    setup(specs: Object): void {
    }

    /**
     * Expected to be overridden
     * Delta is not enforced
     * @param specs
     */
    step(delta): void {
    }

    /**
     * Expected to be overridden
     * Executed at if model reached a completion
     */
    teardown(): void {
    }

    /**
     * Return next agent id
     * @returns {number}
     */
    nextId(): Number {
        return this.currId++;
    }



    /**
     * The the size of the grid in this env
     * @returns {Object|number|*}
     */
    getSize(): Object {
        return this.grid.getSize();
    }

    /**
     * Indicates if this env is compelte
     * @returns {*}
     */
    get complete(): Boolean {
        return this.#complete;
    }

    /**
     * Indicates this env is done
     * @param complete
     */
    set complete(complete: Boolean) {
        this.#complete = complete;
        ABMFrameworkCore.simulationStatusUpdated("Complete");
    }

    /**
     * A basic text representation of this environment
     * @returns {*}
     */
    str(): String {
        return this.grid.str();
    }
}


// --------------------\\
// - Global functions -\\
// --------------------\\
/**
 * Sets global environment
 * @param theEnv
 */
setEnv = function (theEnv: ABMEnv): void {
    ABMFrameworkCore.simulationStatusUpdated("Env Set");
    currEnv = theEnv;
};

/**
 * Gets global environemt
 * @returns {null}
 */
getEnv = function (): ABMEnv {
    return currEnv;
};

/**
 * Check if global env is set
 * @returns {boolean}
 */
isEnvSet = function (): Boolean {
    return currEnv != null;
}

/**
 * Request the listeners to use this scale
 * @param scale
 * @returns {*}
 */
setScale = (scale: Number) => ABMFrameworkCore.scaleUpdated(scale);

/**
 * Get the current environment step
 * @returns {number|*}
 */
getCurrStep = function ():Number {
    if (isEnvSet()) {
        return getEnv().currStep;
    } else {
        return -1
    }
}

/**
 * Triggers a step and returns if the step was executed
 * @returns {boolean}
 */
stepEnv = function (): Boolean {
    if (isEnvSet()) {
        return currEnv.envStep();
    }else {
        println("Step: Environment not set.");
        return false;
    }
};

/**
 * Checks if env is complete expect env to be set
 * @returns Boolean
 */
isComplete = function (): Boolean {
    return currEnv.complete
};

/**
 * Helper to run steps until it gets a complete message
 * @returns {number}
 */
simulate = function (): Number {
    let stepToFinish = 0;
    while (stepEnv()) {
        ++stepToFinish
    }
    return stepToFinish;
}
