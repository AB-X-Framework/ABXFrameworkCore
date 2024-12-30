class NeighborhoodPatch extends ABMPatch {
    alive;

    constructor(env: NeighborhoodEnv, x: Number, y: Number) {
        super(env,x,y);
        this.alive=false;
    }

    str(): String {
        return this.alive?"█":" ";
    }
}


class NeighborhoodEnv extends ABMEnv {
    patch;
    constructor() {
        super(NeighborhoodPatch);
    }

    setup(specs: Object) {
        this.patch=this.grid.patchAt(specs.x,specs.y);
    }

    step():void{
        print(this.currStep);
        switch (this.currStep){
            case 0: {
                this.patch.alive=true;
                break;
            }
            case 1:{
                this.patch.alive=false;
                break;
            }
            case 2:{
                arrayToSet(this.patch.moore(0,true)).each((patch:NeighborhoodPatch)=>patch.alive=true);
                break;
            }
            case 3:{
                this.patch.alive=false;
                arrayToSet(this.patch.moore(1)).each((patch:NeighborhoodPatch)=>patch.alive=true);
                break;
            }
            case 4:{
                this.patches().each((patch:NeighborhoodPatch)=>patch.alive=false)
                arrayToSet(this.patch.moore(2)).each((patch:NeighborhoodPatch)=>patch.alive=true);
                break;
            }
            case 5:{
                this.patches().each((patch:NeighborhoodPatch)=>patch.alive=false)
                arrayToSet(this.patch.VonNeumann(0,true)).each((patch:NeighborhoodPatch)=>patch.alive=true);
                break;
            }
            case 6:{
                this.patches().each((patch:NeighborhoodPatch)=>patch.alive=false)
                arrayToSet(this.patch.VonNeumann(1)).each((patch:NeighborhoodPatch)=>patch.alive=true);
                break;
            }
            case 7:{
                this.patches().each((patch:NeighborhoodPatch)=>patch.alive=false)
                arrayToSet(this.patch.VonNeumann(2)).each((patch:NeighborhoodPatch)=>patch.alive=true);
                break;
            }
            case 8:{
                this.patches().each((patch:NeighborhoodPatch)=>patch.alive=false)
                arrayToSet(this.patch.VonNeumann(3)).each((patch:NeighborhoodPatch)=>patch.alive=true);
                break;
            }
            default: {
                this.complete = true;
            }

        }
        print(getEnv().str());
    }
}

setEnv(new NeighborhoodEnv().setupEnv({w: 11, h: 11, gridType:"torus",x:5,y:5}));
simulate();

setEnv(new NeighborhoodEnv().setupEnv({w: 11, h: 11, gridType:"torus",x:0,y:0}));
simulate();

setEnv(new NeighborhoodEnv().setupEnv({w: 11, h: 11, gridType:"plane",x:0,y:0}));
simulate();

setEnv(new NeighborhoodEnv().setupEnv({w: 11, h: 11, gridType:"cylinder",x:0,y:0}));
simulate();