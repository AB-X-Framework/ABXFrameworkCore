/**
 * Groowing select of moore neighbors
 * Ends after30 selections
 */
class MooreEnv extends ABMEnv {
    chosenOne;
    green;

    setup(specs: Object) {
        this.chosenOne = this.patches().one(true);
        this.level = 0;
        this.green = namedColor("green");
        this.max = specs.max;
    }

    jsVonNeumann() {
        // This example self indicate if moore should choose self
        const moore = this.chosenOne.jsVonNeumann(450, true);
        for (const patch of moore) {
            patch.color = this.green;
        }
        return moore.length;
    }

    VonNeumann() {
        // This example self indicate if moore should choose self
        const moore = this.chosenOne.VonNeumann(450, true);
        for (const patch of moore) {
            patch.color = this.green;
        }
        return moore.length;
    }

    eachVonNeumann() {
        // This example self indicate if moore should choose self
        let count = 0;
        this.chosenOne.eachVonNeumann(450, (patch) => {
            patch.color = this.green;
            ++count;
        }, true);
        return count;
    }

    jsEachVonNeumann() {
        // This example self indicate if moore should choose self
        let count = 0;
        this.chosenOne.jsEachVonNeumann(450, (patch) => {
            patch.color = this.green;
            ++count;
        }, true);
        return count;
    }
}

const VonNeumannEnv = new MooreEnv().setupEnv({w: 1000, h: 1000, gridType: 'torus'});

tick();
let baseline = VonNeumannEnv.eachVonNeumann();
println("eachVonNeumann "+tick()+" "+baseline);

let count = VonNeumannEnv.VonNeumann();
Assertions.assertEquals(baseline,count);
println("VonNeumann "+tick()+" "+count);

count = VonNeumannEnv.jsEachVonNeumann();
Assertions.assertEquals(baseline,count);
println("jsEachVonNeumann"+tick()+" "+count);

count = VonNeumannEnv.jsVonNeumann();
Assertions.assertEquals(baseline,count);
println("jsVonNeumann"+tick()+" "+count);
