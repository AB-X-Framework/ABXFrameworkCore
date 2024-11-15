class ABMVertex extends ABMEntity{
    valid;
    vertexType;
    constructor(env: ABMEnv, vertexType: Function) {
        super(env);
        this.vertexType = vertexType;
        this.valid = true;
    }

    destroy(){
        env.destroyVertex(this);
    }
}