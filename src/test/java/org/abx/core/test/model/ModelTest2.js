class TestAgent extends ABMAgent {
    step(){
        this.fw(1*m);
        this.rotateDeg(-90);
    }
}

class TestEnv extends ABMEnv {
    setup(specs: Object) {
        this.createGrid(specs.w, specs.h, "torus");
        this.spawn(TestAgent);
    }

}
enableSIDistance(true);
setEnv(new TestEnv().setupEnv({w: 5*m, h: 3*m, gridType:"torus"}));


print(getEnv());
stepEnv();
print(getEnv());
stepEnv();
print(getEnv());
stepEnv();
print(getEnv());
stepEnv();
print(getEnv());
stepEnv();
print(getEnv());

