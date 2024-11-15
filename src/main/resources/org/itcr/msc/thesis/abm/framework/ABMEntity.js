/**
 * A super class for both agents and patches
 */
class ABMEntity {
    outgoingRelations;//List of outgoing relations
    #incomingRelations;//List of incoming relations
    env; //The environment
    grid;//The grid
    id;//The ide

    //-----------------\\
    //- Setup section -\\
    //-----------------\\
    constructor(env: ABMEnv) {
        this.env = env;
        this.grid = env.grid;
        this.id = env.nextId();
    }

    //-------------------------------\\
    //- Expected overridden section -\\
    //-------------------------------\\
    step(delta?: UnitSystem | Number) {

    }

    /**
     * To be overridden by agent/patches
     */
    xy():Object {
    }

    /**
     * Location  using unit if any
     * To be overridden by agent/patches
     */
    location():Object{

    }

    //---------------------\\
    //- Relations section -\\
    //---------------------\\
    /**
     * Helper method to get all incoming relations
     * @param relation
     * @returns {*}
     */
    incoming(relation: String):Object {
        if (typeof this.#incomingRelations === "undefined") {
            this.#incomingRelations = {};
        }
        if (typeof this.#incomingRelations[relation] === "undefined") {
            this.#incomingRelations[relation] = {};
        }
        return this.#incomingRelations[relation]
    }

    /**
     * Gets outgoing relations
     * @param relation
     * @returns {*}
     */
    getRelationsMap(relation: String):Object  {
        if ( this.outgoingRelations === undefined) {
            this.outgoingRelations = {};
        }
        if ( this.outgoingRelations[relation] === undefined) {
            this.outgoingRelations[relation] = {};
        }
        return this.outgoingRelations[relation]
    }

    /**
     *
     * @param relation
     * @returns {number}
     */
    getRelationsCount(relation: String):Number  {
        if ( this.outgoingRelations === undefined) {
            return 0;
        }
        if ( this.outgoingRelations[relation] === undefined) {
            return 0;
        }
        return Object.keys(this.outgoingRelations[relation]).length;
    }

    /**
     * Returns list of relations of a type
     * @param relation
     * @returns {[]}
     */
    getRelationsList(relation: String):Array {
        const relationList = [];
        let counter = 0;
        const relations = this.getRelationsMap(relation);
        for (const entityId of Object.keys(relations)) {
            relationList[counter++]=relations[entityId];
        }
        return relationList;
    }

    /**
     * Creates a relation
     * @param relation
     * @param other
     * @param bidirectional
     * @returns {ABMRelation}
     */
    createRelation(relation: String, other: ABMEntity, bidirectional?: Boolean): ABMRelation {
        if (bidirectional === undefined) {
            bidirectional = false;
        }
        const thisOutgoing = this.getRelationsMap(relation);
        const otherIncoming = other.incoming(relation);
        if (thisOutgoing[other.id] !== undefined || otherIncoming[this.id] !== undefined) {
            throw "Only one link per relation allowed.";
        }
        if (bidirectional) {
            const otherOutgoing = other.getRelationsMap(relation);
            const thisIncoming = this.incoming(relation);
            if (thisIncoming[other.id] !== undefined || otherOutgoing[this.id] !== undefined) {
                throw "Only one link per relation allowed.";
            }
        }
        const content = {};
        const thisOutgoingRelation = new ABMRelation(relation, this, other, content);
        thisOutgoing[other.id] = thisOutgoingRelation;
        otherIncoming[this.id] = thisOutgoingRelation;
        if (bidirectional) {
            const otherOutgoing = other.getRelationsMap(relation);
            const otherOutgoingRelation = new ABMRelation(relation, other, this, content);
            otherOutgoing[this.id] = otherOutgoingRelation;
            this.incoming(relation)[other.id] = otherOutgoingRelation;
            thisOutgoingRelation.inverse = otherOutgoingRelation;
            otherOutgoingRelation.inverse = thisOutgoingRelation;
        }
        return thisOutgoingRelation;
    }

    /**
     * Looks for the origin and drop the relation
     * Drops a relation
     * @param relation
     */
    dropRelation(relation: ABMRelation): void {
        this.dropRelationWith(relation.relation, relation.dest);
    }

    /**
     * Drop the relation of this entity with the other entity
     * IF the relation is bidirectional also drop the relation of other entity with this entity
     * @param relation
     * @param other
     */
    dropRelationWith(relation: String, other: ABMEntity): void {
        const rel = this.getRelationsMap(relation);
        const outgoing = rel[other.id];
        if (outgoing === undefined) {
            //No relation
            return;
        }
        if (outgoing.inverse !== undefined) {
            delete this.#incomingRelations[relation][other.id];
            delete other.outgoingRelations[relation][this.id];
        }
        delete this.outgoingRelations[relation][other.id];
        delete other.#incomingRelations[relation][this.id];
    }

    /**
     * Gets the outgoing relation of this entity with the other entity
     * @param relation
     * @param other
     * @returns {*}
     */
    getRelationWith(relation: String, other: ABMEntity): ABMRelation {
        return this.getRelationsMap(relation)[other.id];
    }


    dropRelations():void {
        if (typeof this.outgoingRelations !== "undefined") {
            for (const relation of Object.keys(this.outgoingRelations)) {
                const outgoingRelation = this.outgoingRelations[relation];
                for (const destId of Object.keys(outgoingRelation)) {
                    this.dropRelation(outgoingRelation[destId]);
                }
            }
        }
    }

    /**
     * Drops all relations
     */
    dropAllRelations():void {
        this.dropRelations();
        if (typeof this.#incomingRelations !== "undefined") {
            for (const relation of Object.keys(this.#incomingRelations)) {
                const incomingRelation = this.#incomingRelations[relation];
                for (const originId of Object.keys(incomingRelation)) {
                    Assertions.assertEquals(this, incomingRelation[originId].dest)
                    Assertions.assertNotEquals(this, incomingRelation[originId].origin);
                    incomingRelation[originId].origin.dropRelation(incomingRelation[originId]);
                }
            }
        }
    }

    /**
     * Returns a map with the relation and the link
     * @param other
     * @returns {{}}
     */
    getRelationsWith(other: ABMAgent): Object {
        const links = {};
        if (typeof this.outgoingRelations === "undefined") {
            return links;
        }
        for (let relation of Object.keys(this.outgoingRelations)) {
            const outgoing = this.getRelationsMap(relation);
            if (outgoing[other.id] !== undefined) {
                links[relation] = outgoing[other.id];
            }
        }
        return links;
    }

    //-----------------\\
    //- Utils section -\\
    //-----------------\\

    /**
     * Returns patch at xy
     * @param x
     * @param y
     * @returns {ABMPatch|*}
     */
    patchAt(x: UnitSystem | Number, y: UnitSystem | Number): ABMPatch {
        return this.grid.patchAt(x, y);
    }

    /**
     * Returns distance to another entity
     * @param other
     * @returns {Number}
     */
    distanceTo(other?: ABMEntity):Number {
        return this.grid.vectorTo(this.xy(), other.xy()).mag;
    }

}