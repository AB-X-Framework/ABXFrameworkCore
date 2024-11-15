/**
 * This simulation specs
 */
include("{script}/ParetoEnv.js")
 
const env = new ParetoEnv();
env.setupEnv( {w: 10, h: 10, players:10});
setEnv(env);
setScale(50);