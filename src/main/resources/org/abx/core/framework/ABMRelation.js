class ABMRelation {
    #pen; //If using a pen
    visible; //If it should be drawn
    relation; //The relation name
    origin; //The origin entity
    dest; //The destination entity
    content; //Data for the relation
    inverse; //If direction is bidrectional
    label; //A text to draw if visible

    constructor(relation: String, origin: ABMEntity, dest: ABMEntity, content) {
        this.visible = false;
        this.relation = relation;
        this.origin = origin;
        this.dest = dest;
        this.content = content;
    }

    get pen(): ABMPen {
        if (typeof this.#pen === "undefined") {
            this.#pen = new ABMPen();
        }
        return this.#pen;
    }


}