const env = new ABMEnv().setupEnv({w: 1000, h: 1000, gridType: 'torus'});
const agent = env.spawn(ABMAgent);
const green = namedColor("green");
agent.setRandomLocation();

tick();
let count = 0;
let baseline = agent.eachPatchInRadius(450, (patch) => {
    ++count;
    patch.color = green
});
println("eachPatchInRadius " + tick() + " " + baseline);


let patches = agent.patchesInRadius(450);
Assertions.assertEquals(patches.length,count)
for (const patch of patches) {
    patch.color = green;
}
println("patchesInRadius " + tick() + " " + baseline);