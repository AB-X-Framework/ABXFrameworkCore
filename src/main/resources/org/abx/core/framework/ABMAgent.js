/**
 * The class to handle agent behavior
 */
class ABMAgent extends ABMEntity {
    #drawingData;
    #pen;
    #isPenDown;
    aliveStrokeSteps;
    grid;
    dir;
    visible;
    alive;
    agentType;

    //-----------------\\
    //- Setup section -\\
    //-----------------\\

    /**
     *
     * @param env
     * @param agentType
     */
    constructor(env: ABMEnv, agentType: Function) {
        super(env);
        this.aliveStrokeSteps = -1;
        this.dir = Polar(1, 0);
        this.grid = env.grid;
        this.grid.add(this);
        this.visible = true;
        this.alive = true;
        this.#isPenDown = false;
        this.agentType = agentType;
        this.#drawingData = imgClient.createAgentDrawingData();
    }

    //--------------------\\
    //- Movement section -\\
    //--------------------\\
    /**
     * Sets random location
     * @returns {ABMPatch|*}
     */
    setRandomLocation(): ABMPatch {
        return this.grid.setRandomLocation(this);
    }


    setRandomPatch(): ABMPatch {
        return this.grid.setRandomPatch(this);
    }

    /**
     * Rotates arround xy
     * @param x
     * @param y
     * @param deg
     * @param agent
     */
    rotateAroundXY(x: UnitSystem | Number, y: UnitSystem | Number,
                   deg: Number|UnitSystem, agent?: Boolean) {
        if (deg instanceof UnitSystem){
            deg = deg.to(angle.deg).value;
        }
        if (agent) {
            this.rotateDeg(deg);
        }
        if (x instanceof UnitSystem) {
            x = x.to(this.grid.unit);
        }
        if (y instanceof UnitSystem) {
            y = y.to(this.grid.unit);
        }
        const xy = this.xy();
        let vector = this.grid.vectorTo({"x": x, "y": y},xy).rotateDeg(deg);
        this.moveTo(x+ vector.r, y + vector.i);
    }

    /**
     * Vector to entity
     */
    vectorTo(entity:ABMEntity):ComplexClass|Number{
        const thisXY = this.xy();
        const otherXY = entity.xy();
        return this.grid.vectorTo(thisXY,otherXY);
    }

    /**
     * Rotates around xy
     * @param entity
     * @param deg
     * @param agent
     */
    rotateAround(entity: ABMEntity, deg: Number|UnitSystem, agent?: Boolean) {
        const xy = entity.xy();
        this.rotateAroundXY(xy.x, xy.y, deg, agent);
    }

    /**
     * Sets current location
     * @param x
     * @param y
     * @returns {ABMPatch|*}
     */
    setLocation(x: UnitSystem | Number | ABMEntity, y?: UnitSystem | Number): ABMPatch {
        if (x instanceof ABMEntity) {
            if (y !== undefined){
                throw "Can not set location with first parameter being a Agent/Patch";
            }
            const xy = x.xy();
            return this.grid.setLocation(xy.x, xy.y, this);
        } else {
            return this.grid.setLocation(x, y, this);
        }
    }

    /**
     * Rotates rad
     * @param x
     */
    rotateRad(x: Number): void {
        this.dir = this.dir.rotateRad(x);
    }

    /**
     * Rotates deg
     * @param x
     */
    rotateDeg(x: Number): void {
        this.dir = this.dir.rotateDeg(x);
    }

    /**
     * Moves agents to xy
     * @param x
     * @param y
     */
    moveTo(x: UnitSystem | Number | ABMPatch , y?: UnitSystem | Number): void {
        if (x instanceof ABMPatch) {
            const xy = x.center;
            x = xy.x;
            y = xy.y;
        }
        if (this.#isPenDown) {
            const xy = this.xy();
            this.grid.checkUnit(x, y);
            if (x instanceof UnitSystem) {
                x = x.to(this.grid.unit).value;
                y = y.to(this.grid.unit).value;
            }
            const vector = this.grid.vectorTo(xy, {"x": x, "y": y});
            const stroke =
                new ABMStroke(this.#drawingData.layer, this.pen, this.aliveStrokeSteps, xy, vector);
            this.grid.addStroke(stroke);
        }
        this.grid.setLocation(x, y, this);
    }

    /**
     * Moves agent forward
     * @param ahead
     */
    fw(ahead: UnitSystem | Number): void {
        if (ahead instanceof  UnitSystem){
            ahead = ahead.to(this.grid.unit).value;
        }
        const xy = this.xy();
        const x = xy.x + ahead * this.dir.r;
        const y = xy.y + ahead * this.dir.i;
        this.moveTo(x, y);
    }

    walk(dist: Number | ComplexClass):void{
        const xy = this.xy();
        let x;
        let y;
        if (dist instanceof ComplexClass){
            this.dir = dist.normalize();
            x = xy.x + dist.r;
            y = xy.y + dist.i;
        } else {
            if (dist >= 0) {
                this.dir = Polar(1, 0);
            }else {
                this.dir = Polar(1, -π);
            }
            x = xy.x + dist;
            y = xy.y;
        }
        this.moveTo(x, y);
    }

    /**
     * Sets direction in degree
     * @param x
     */
    setDirDeg(x: Number): void {
        this.dir = Polar(1, toRad(x));
    }

    /**
     * Makes agent dir face an entity
     * @param ent
     */
    face(ent: ABMEntity): void {
        const initXY = this.xy();
        const destXY = ent.xy();
        this.dir = this.grid.face(initXY, destXY);
    }

    //---------------------\\
    //- Searching section -\\
    //---------------------\\
    /**
     * Find nearest agent
     * @param classType
     * @param maxDistance
     * @returns {ABMAgent|*}
     */
    nearestAgent(classType?: Function, maxDistance?: Number):ABMAgent|null{
        return this.grid.nearestAgent(this, classType, maxDistance);
    }

    /**
     * Finds all agents which are in radius
     * @param radius
     * @param classType
     * @returns {SetClass|*}
     */
    agentsInRadius(radius: UnitSystem| Number,classType?: Function){
        return this.grid.agentsInRadius(this, radius, classType);
    }

    /**
     * Finds all agents which are in radius
     * @param radius
     * @param classType
     * @returns {SetClass|*}
     */
    jsAgentsInRadius(radius: UnitSystem| Number,classType?: Function){
        return this.grid.jsAgentsInRadius(this, radius, classType);
    }


    /**
     * Finds all agents which are in radius
     * @param radius
     * @param fx
     * @param classType
     * @returns {SetClass|*}
     */
    eachAgentInRadius(radius: UnitSystem| Number,fx:Function, classType?: Function){
        return this.grid.eachAgentInRadius(this, radius,fx, classType);
    }

    /**
     * Find all patches which its center lies within the radius
     * @param radius
     * @returns {*}
     */
    patchesInRadius(radius: UnitSystem| Number){
        return this.grid.patchesInRadius(this, radius);
    }

    eachPatchInRadius(radius: UnitSystem| Number, fx:Function){
        return this.grid.eachPatchInRadius(this, radius,fx);
    }

    xy(): Object {
        return this.grid.xy(this);
    }

    location(): Object {
        return this.grid.location(this);
    }

    //----------------------------\\
    //- Agent management section -\\
    //----------------------------\\

    hatch(type?: Function): ABMAgent {
        let desiredType;
        if (type === undefined) {
            desiredType = this.agentType;
        } else {
            desiredType = type;
        }
        const hatchling = this.env.spawn(desiredType);
        const xy = this.xy();
        hatchling.setLocation(xy.x, xy.y);
        return hatchling;
    }

    die(): void {
        this.env.kill(this);
    }


    //-----------------------------\\
    //- Drawing utilities section -\\
    //-----------------------------\\

    get size(): Number {
        return this.#drawingData.size;
    }

    get layer(): String {
        return this.#drawingData.layer;
    }

    set layer(layer: String) {
        this.#drawingData.layer = layer;
    }

    set fontSize(size:Number){
        this.#drawingData.setFontSize(size);
    }

    set fontName(name:String){
        this.#drawingData.setFontName(name);
    }

    set fontStyle(style:String){
        this.#drawingData.setFontStyle(style);
    }

    get font(){
        return this.#drawingData.font;
    }

    penDown() {
        this.#isPenDown = true;
    }

    penUp() {
        this.#isPenDown = false;
    }


    set label(label: String) {
        this.#drawingData.label = label;
    }

    get label(): String {
        return this.#drawingData.label;
    }

    set color(color) {
        this.#drawingData.color = color;
    }

    get color() {
        return this.#drawingData.color;
    }

    set shape(shape) {
        this.#drawingData.shape = shape;
    }

    get shape() {
        return this.#drawingData.shape;
    }

    set size(size: Number|UnitSystem) {
        if (size instanceof UnitSystem){
            size = size.to(this.grid.unit).value;
        }
        this.#drawingData.size = size;
    }

    get drawingData() {
        this.#drawingData.angle = this.dir.angleDeg;
        return this.#drawingData;
    }

    /**
     * Gets the pen for the agent
     * @returns {*}
     */
    get pen(): ABMPen {
        if (typeof this.#pen === "undefined") {
            this.#pen = new ABMPen(this.#drawingData.color);
        }
        return this.#pen;
    }

    //----------------\\
    //- Util section -\\
    //----------------\\

    /**
     * Returns patch of this agent
     * @returns {ABMPatch|*}
     */
    patchOf(): ABMPatch {
        return this.grid.patchOf(this);
    }

    /**
     * Utility to draw
     * @returns {`Agent ${string}. Visible: ${string}. Alive ${string}. XY=${string}. Patch=${string}`}
     */
    toString(): String {
        const xy = this.xy();
        return `Agent ${this.id}. Class:${this.constructor.name}.  Alive ${this.alive}.\n`+
               `    Visible: ${this.visible}. `+
               `XY={x:${maxDecimals(xy.x,2)}, y:${maxDecimals(xy.x,2)}}. Patch=${this.patchOf()}`;
    }

    /**
     * Utility to get patches
     * @returns {SetClass|*}
     */
    patches() {
        return this.grid.patches();
    }

    str(): String {
        const angle = this.dir.angleDeg;
        if (angle < 45) {
            return ">"
        }
        if (angle < 135) {
            return "^"
        }
        if (angle < 225) {
            return "<"
        }
        if (angle < 315) {
            return "V"
        }
        return ">";
    }

}