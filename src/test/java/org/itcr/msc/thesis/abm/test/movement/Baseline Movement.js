/*As SI distance is enabled m is for meter
*/
enableSIDistance(true);

class TestAgent extends ABMAgent {
    type;
    setup(type: String){
        //true is to shuffle
        this.setLocation(this.patches().one(true));
        this.color = rgbColor(
                randomInt(256),
                randomInt(256),
                randomInt(256));
        this.type = type;
        this.size = 1.1;
        this.counter = 10;
        switch (type){
            //Move to nearby patch
            case "patch":{
               this.shape="square";    
               break;
            }
            //Choose destination and then move
            case "moveTo":{
               this.shape="triangle";    
               break;
            }
            //Jump to any place
            case "jump":{
               this.shape="circle";    
               break;
            }
            //Select direction and then move
            case "forward":{
               this.shape="delta";    
               break;
            }
        }
    }
    
    step(){
        const x = random(-1,1);
        const y = random(-1,1);
        switch(this.type){
            case "patch":{
                const xyData = this.location();
                const patch = this.patchAt(xyData.x+x*m,xyData.y+y*m);
                this.moveTo(patch);
                break;
            }
            case "moveTo":{
                const locData = this.location();
                this.moveTo(locData.x+x*m,locData.y+y*m);
                break;
            }
            case "forward":{
                if (this.counter ===10){
                    this.counter = 0;
                    this.setDirDeg(randomInt(0,360));
                }else{
                    ++this.counter;
                    this.fw(0.3*m);
                }
                break;
            }
            case "jump":{
                this.setLocation(this.patches().one(true));
                break;
            }
        }
    }
}


const env =new ABMEnv();
env.setup = function(specs: Object) {
    this.patches().each((patch:ABMPatch):void=>{
        if ((patch.xValue+patch.yValue)%2===0){
            patch.color=namedColor("lightGray");
        }else{
            patch.color=namedColor("pink");
        }
    });
    this.spawn(TestAgent).setup("patch",);
    this.spawn(TestAgent).setup("moveTo");
    this.spawn(TestAgent).setup("forward");
    this.spawn(TestAgent).setup("jump");
};

env.setupEnv( {w: 30*m, h: 20*m, gridType:"torus",seamless:true});
for (let i = 0; i<  100;++i){
    env.envStep();
}