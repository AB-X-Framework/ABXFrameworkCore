include("{script}/ParetoEnv.js");

for (let i = 0; i < 1;++i){
    const env = new ParetoEnv();
    env.setupEnv( {w: 101, h: 101, players:100});
    while (env.envStep()) {
        //One step     
    }
    const paretoCoins = env.sortByCoins()[env.atTwentyPercent];
    const paretoTiles = env.sortByTiles()[env.atTwentyPercent];
    appendString("{script}/pareto.ab-x.csv",
            `${env.currStep},${paretoCoins},${paretoTiles}\n`);
}