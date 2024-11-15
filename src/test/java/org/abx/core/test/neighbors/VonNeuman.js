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

    jsVonNeuman() {
        // This example self indicate if moore should choose self
        const moore = this.chosenOne.jsVonNeuman(450, true);
        for (const patch of moore) {
            patch.color = this.green;
        }
        return moore.length;
    }

    VonNeuman() {
        // This example self indicate if moore should choose self
        const moore = this.chosenOne.VonNeuman(450, true);
        for (const patch of moore) {
            patch.color = this.green;
        }
        return moore.length;
    }

    eachVonNeuman() {
        // This example self indicate if moore should choose self
        let count = 0;
        this.chosenOne.eachVonNeuman(450, (patch) => {
            patch.color = this.green;
            ++count;
        }, true);
        return count;
    }

    jsEachVonNeuman() {
        // This example self indicate if moore should choose self
        let count = 0;
        this.chosenOne.jsEachVonNeuman(450, (patch) => {
            patch.color = this.green;
            ++count;
        }, true);
        return count;
    }
}

const VonNeumanEnv = new MooreEnv().setupEnv({w: 1000, h: 1000, gridType: 'torus'});

tick();
let baseline = VonNeumanEnv.eachVonNeuman();
println("eachVonNeuman "+tick()+" "+baseline);

let count = VonNeumanEnv.VonNeuman();
Assertions.assertEquals(baseline,count);
println("VonNeuman "+tick()+" "+count);

count = VonNeumanEnv.jsEachVonNeuman();
Assertions.assertEquals(baseline,count);
println("jsEachVonNeuman"+tick()+" "+count);

count = VonNeumanEnv.jsVonNeuman();
Assertions.assertEquals(baseline,count);
println("jsVonNeuman"+tick()+" "+count);
