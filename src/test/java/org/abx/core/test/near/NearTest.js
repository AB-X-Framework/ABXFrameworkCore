class Influencer extends ABMAgent {
    setup():ABMAgent {
        this.setLocation(5, 5);
        return this;
    }
}

class Follower extends ABMAgent {
    setup():ABMAgent {
        this.setLocation(0, 0);
        return this;
    }
}

class Ignored extends ABMAgent {
    setup():ABMAgent {
        this.setLocation(1, 1);
        return this;
    }
}

class FEnv extends ABMEnv {
    setup(): void {
        this.influencer = this.spawn(Influencer).setup();
        this.follower = this.spawn(Follower).setup();
        this.ignored = this.spawn(Ignored).setup();
        this.spawn(Ignored).setup().setLocation(99,99);
    }
}
const env = new FEnv();
env.setupEnv({"w": 100, "h": 100})
Assertions.assertEquals(env.follower.nearestAgent(Influencer),env.influencer);
Assertions.assertNull(env.follower.nearestAgent(Influencer,2));
Assertions.assertEquals(env.follower.agentsInRadius(10,ABMAgent).length,2);
