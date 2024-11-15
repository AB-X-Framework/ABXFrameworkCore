class TestAgent extends ABMAgent {
    step(){
        const patch = this.patchOf();
        const xy = patch.center;
        this.moveTo(xy.x+m,xy.y);
    }
}

class TestEnv extends ABMEnv {
    setup(specs: Object) {
        this.spawn(TestAgent);
    }

}
enableSIDistance(true);
const env =new TestEnv();
env.setupEnv( {w: 5*m, h: 3*m, gridType:"torus"});
setEnv(env);


print(getEnv());


stepEnv();
print(getEnv());

stepEnv();
print(getEnv());
stepEnv();
print(getEnv());

