class InRadiousEnv extends ABMEnv {
    setup(specs): void {
        for (var i = 0; i < 30000; ++i) {
            this.spawn(ABMAgent).setRandomLocation();
        }
    }
}

const env = new InRadiousEnv();
env.setupEnv({"w": 400, "h": 400})
const agent = env.agents().one();

tick();

let baseline;
let count=0;

for (let i = 0; i < 10; ++i) {
    tick();
    count = 0;
    agent.eachAgentInRadius(120, (agent: ABMAgent) => {
        ++count;
    });
}
println("eachAgentInRadius " + tick() + " " + count);

for (let i = 0; i < 10; ++i) {
    tick();
    baseline = agent.agentsInRadius(120);
}
println("agentsInRadius " + tick() + " " + baseline.length);

for (let i = 0; i < 10; ++i) {
    tick();
    count = agent.jsAgentsInRadius(120);
}
println("jsAgentsInRadius " + tick() + " " + count.length);


