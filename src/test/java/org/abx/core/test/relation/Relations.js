/**
 * Relations between agents
 * after and agent dies, all relations are removed
 * @type {ABMEnv}
 */
const env = new ABMEnv();
env.setup = function (): void {
    this.survive = this.spawn(ABMAgent);
    this.willDie = this.spawn(ABMAgent);
    this.unfriendly = this.spawn(ABMAgent);
    this.survive.createRelation("friendship", this.willDie, true).content.power = 100;
    this.survive.createRelation("friendship", this.unfriendly, true).content.power = 1;
    this.unfriendly.createRelation("hate", this.willDie).content.power = 1;
    this.empty = this.spawn(ABMAgent);
}

env.step = function (): void {
    println("Before doom");
    println("Empty expecting 0 link with willDie");
    Assertions.assertEquals(0,Object.keys(this.empty.getRelationsWith(this.willDie)).length);
    println("Empty expecting 0 friendship relations");
    Assertions.assertEquals(0,Object.keys(this.empty.getRelationsList("friendship")).length);

    println("Surviving expecting 100 power relation with willDie")
    Assertions.assertEquals(100,this.survive.getRelationWith("friendship",this.willDie).content.power);
    println("Bidirectional. willDie  expecting 100 power relation with Surviving")
    Assertions.assertEquals(100,this.willDie.getRelationWith("friendship",this.survive).content.power);

    println("Surviving expecting 1 link with willDie")
    Assertions.assertEquals(1,Object.keys(this.survive.getRelationsWith(this.willDie)).length);
    println("Surviving expecting 2 relations");
    Assertions.assertEquals(2,Object.keys(this.survive.getRelationsList("friendship")).length);
    println("Unfriendly expecting 1 relation");
    Assertions.assertEquals(1,Object.keys(this.unfriendly.getRelationsList("hate")).length);
    println("Doom time");
    this.willDie.die();
    println("Surviving expecting 1 relations");
    Assertions.assertEquals(1,Object.keys(this.survive.getRelationsList("friendship")).length);
    println("Unfriendly expecting 0 relation");
    Assertions.assertEquals(0,Object.keys(this.unfriendly.getRelationsList("hate")).length);
    this.complete = true;
}
env.setupEnv({});
setEnv(env);
stepEnv();
Assertions.assertTrue(env.complete)