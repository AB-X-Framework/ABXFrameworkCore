/**
 * Groowing select of moore neighbors
 * Ends after30 selections
 */
class MooreEnv extends ABMEnv {
    chooseOne;
    green;

    setup(specs: Object) {
        this.chooseOne = this.patches().one(true);
        this.level = 0;
        this.green = namedColor("green");
        this.max = specs.max;
    }

    jsMoore() {
        // This example self indicate if moore should choose self
        const moore = this.chooseOne.jsMoore(450, true);
        for (const patch of moore) {
            patch.color = this.green;
        }
        return moore.length;
    }

    moore() {
        // This example self indicate if moore should choose self
        const moore = this.chooseOne.moore(450, true);
        for (const patch of moore) {
            patch.color = this.green;
        }
        return moore.length;
    }

    eachMoore() {
        // This example self indicate if moore should choose self
        var count = 0;
        this.chooseOne.eachMoore(450, (patch) => {
            patch.color = this.green;
            ++count;
        }, true);
        return count;
    }

    jsEachMoore() {
        // This example self indicate if moore should choose self
        let count = 0;
        this.chooseOne.jsEachMoore(450, (patch) => {
            patch.color = this.green;
            ++count;
        }, true);
        return count;
    }
}

const mooreEnv = new MooreEnv().setupEnv({w: 1000, h: 1000, gridType: 'torus'});

tick();

let baseline = mooreEnv.eachMoore();
println("eachMoore "+tick()+" "+baseline);

let count = mooreEnv.moore();
Assertions.assertEquals(baseline,count);
println("moore "+tick()+" "+count);

count = mooreEnv.jsEachMoore();
Assertions.assertEquals(baseline,count);
println("jsEachMoore"+tick()+" "+count);

count = mooreEnv.jsMoore();
Assertions.assertEquals(baseline,count);
println("jsMoore"+tick()+" "+count);
