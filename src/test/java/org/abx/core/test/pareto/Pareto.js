/**
 * This simulation specs
 */
include("{script}/ParetoEnv.js");
 
const env = new ParetoEnv();
env.setupEnv( {w: 101, h: 101, players:100});
setEnv(env);
setScale(5);