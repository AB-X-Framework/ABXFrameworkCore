include("{script}/ParetoEnv.js");

addTest("Sort", ()=>{
    const env = new ParetoEnv();
    env.setupEnv( {w: 101, h: 101, players:1});
    
    
    const oneTo50 = Set();
    for (let i = 1; i <= 50;++i){
        oneTo50.append(i);
    }
    const patchesPrices = Set();
    env.patches().each((tile:Tile):void=>{
        patchesPrices.append(tile.rent);
    });
    Assertions.assertEquals(oneTo50, patchesPrices);
    
    const player = env.agentSet[Player].one();
    for (let i = 0;i< 200;++i){
        player.step();
    }
    Assertions.assertTrue(player.ownsTiles());
    const firstTile =player.cheapestTile();
    firstTile.dropAllRelations();
    const cheapest=[firstTile];
    while (player.ownsTiles()){
        const nextTile =player.cheapestTile();
        nextTile.dropAllRelations();
        for (const cheaper of cheapest){
            Assertions.assertTrue(nextTile.cost >= cheaper.cost,`${nextTile.cost} >= ${cheaper.cost}`);
        }
        cheapest.push(nextTile)
    }
    
    Assertions.assertFalse(player.ownsTiles());
    
});

