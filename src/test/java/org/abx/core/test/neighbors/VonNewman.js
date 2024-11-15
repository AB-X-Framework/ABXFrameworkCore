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

    jsVonNewman() {
        // This example self indicate if moore should choose self
        const moore = this.chosenOne.jsVonNewman(450, true);
        for (const patch of moore) {
            patch.color = this.green;
        }
        return moore.length;
    }

    vonNewman() {
        // This example self indicate if moore should choose self
        const moore = this.chosenOne.vonNewman(450, true);
        for (const patch of moore) {
            patch.color = this.green;
        }
        return moore.length;
    }

    eachVonNewman() {
        // This example self indicate if moore should choose self
        let count = 0;
        this.chosenOne.eachVonNewman(450, (patch) => {
            patch.color = this.green;
            ++count;
        }, true);
        return count;
    }

    jsEachVonNewman() {
        // This example self indicate if moore should choose self
        let count = 0;
        this.chosenOne.jsEachVonNewman(450, (patch) => {
            patch.color = this.green;
            ++count;
        }, true);
        return count;
    }
}

const vonNewmanEnv = new MooreEnv().setupEnv({w: 1000, h: 1000, gridType: 'torus'});

tick();
let baseline = vonNewmanEnv.eachVonNewman();
println("eachVonNewman "+tick()+" "+baseline);

let count = vonNewmanEnv.vonNewman();
Assertions.assertEquals(baseline,count);
println("vonNewman "+tick()+" "+count);

count = vonNewmanEnv.jsEachVonNewman();
Assertions.assertEquals(baseline,count);
println("jsEachVonNewman"+tick()+" "+count);

count = vonNewmanEnv.jsVonNewman();
Assertions.assertEquals(baseline,count);
println("jsVonNewman"+tick()+" "+count);
