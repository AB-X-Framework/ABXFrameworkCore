/**
 * Groowing select of moore neighbors
 * Ends after30 selections
 */
class MooreEdgeEnv extends ABMEnv {
    chooseOne;
    green;

    setup(specs: Object) {
        this.chooseOne = this.patches().one(true);
        this.level = 0;
        this.green = namedColor("green");
        this.max = specs.max;
    }

    jsMooreEdge() {
        let mooreEdge;
        for (let i = 0; i < 450; ++i) {
            // This example self indicate if moore should choose self
            mooreEdge = this.chooseOne.jsMooreEdge(i, true);
            for (const patch of mooreEdge) {
                patch.color = this.green;
            }
        }
        return mooreEdge.length;
    }

    mooreEdge() {
        let mooreEdge;
        for (let i = 0; i < 450; ++i) {
            // This example self indicate if moore should choose self
            mooreEdge = this.chooseOne.mooreEdge(i, true);
            for (const patch of mooreEdge) {
                patch.color = this.green;
            }
        }
        return mooreEdge.length;
    }

    eachMooreEdge() {
        let count;
        for (let i = 0; i < 450; ++i) {
            // This example self indicate if moore should choose self
            count = 0;
            this.chooseOne.eachMooreEdge(i, (patch) => {
                patch.color = this.green;
                ++count;
            }, true);
        }
        return count;
    }

    jsEachMooreEdge() {
        // This example self indicate if moore should choose self
        let count;
        for (let i = 0; i < 450; ++i) {
            count = 0;
            this.chooseOne.jsEachMooreEdge(i, (patch) => {
                patch.color = this.green;
                ++count;
            }, true);
        }
        return count;
    }
}

const mooreEdgeEnv = new MooreEdgeEnv().setupEnv({w: 1000, h: 1000, gridType: 'torus'});

tick();

let baseline = mooreEdgeEnv.eachMooreEdge();
println("eachMoore " + tick() + " " + baseline);

let count = mooreEdgeEnv.mooreEdge();
Assertions.assertEquals(baseline, count);
println("moore " + tick() + " " + count);

count = mooreEdgeEnv.jsEachMooreEdge();
Assertions.assertEquals(baseline, count);
println("jsEachMoore" + tick() + " " + count);

count = mooreEdgeEnv.jsMooreEdge();
Assertions.assertEquals(baseline, count);
println("jsMoore" + tick() + " " + count);
