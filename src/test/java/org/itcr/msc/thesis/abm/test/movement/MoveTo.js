/**
 * Walking some steps leaving a path
 */
enableSIDistance(true)
class WalkingAgent extends ABMAgent{
    setup(){
        this.counter = 0;
        this.aliveStrokeSteps = 100;
        this.color = namedColor("green");
        this.pen.width=4;
    }
    step(){
        if (this.counter === 5){
            this.color = this.pen.color =rgbColor(
                randomInt(256),
                randomInt(256),
                randomInt(256));
            this.counter=0;
            this.penUp();
        }else {
            this.penDown();
            ++this.counter;
        }
        //Move to random patch
        //this.moveTo(this.patches().one(true));
        this.moveTo(this.grid.w*random(),this.grid.h*random());
    }
}
const env = new ABMEnv();
env.setup = function (specs: Object) {
    this.patches().each((patch: ABMPatch): void => {
        patch.color = namedColor("black");
    });
    this.spawn(WalkingAgent).setup();
}
env.step =()=>sleep(10);
//Grid of 30 cm and 25 meters
env.setupEnv({w: 30*cm, h: 25*m, gridType: "torus"});
for (let i = 0; i<  100;++i){
    env.envStep();
}