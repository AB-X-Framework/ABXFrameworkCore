include("{script}/Tile.js");

class Player extends ABMAgent{
    static Owns = "owns";
    static RoundCoins = 75;
    idx;
    coins;
    
    setup(id):Player{
        this.idx = id;
        this.coins = 1;
        this.size = 1;
        this.color = rgbColor(
                30 +randomInt(225),
                30 +randomInt(225),
                30 +randomInt(225));
        this.setRandomPatch();
        return this;
    }
    
    step() {
        this.coins += Player.RoundCoins;
        const tile = this.setRandomPatch();
        
        if (tile.hasOwner()){
            const owner = tile.getOwner();
            if (owner !== this){
            //println("Player "+this.idx +" owner "+tile.getOwner().idx+" tile "+tile.idx+" coins "+
            //owner.coins+" rent "+tile.rent+ " "+tile.cost +" "+this.coins)
                if (tile.rent <= this.coins){
                    owner.coins+=tile.rent;
                    this.coins-=tile.rent;
                }else {
                    const remainingDebt = tile.rent - this.coins;
                    owner.coins+=this.coins;
                    this.coins=0; 
                    this.settle(owner, remainingDebt);
                }
            }
        } else {
            if (tile.cost <= this.coins){
                //println("Player "+this.idx+" buying "+tile.idx+ " cost "+tile.cost)
                this.coins -= tile.cost;
                --this.env.availableTiles;
                tile.color = this.color;
                this.createRelation(Player.Owns, tile);
                tile.createRelation(Tile.Owner, this);
            }
        }
        this.improve();
    }
    
    settle(newOwner:Player, rent:Number):void{
        //println("Settle "+this.idx+" "+newOwner.idx+" "+rent);
        if (this.ownsTiles()){
            const ownedRel = this.getRelationsList(Player.Owns).sort(
                (tileA: ABMRelation,tileB:ABMRelation):Number=>
                    (tileA.dest.cost/*+(tileA.dest.idx/10000000)*/) -
                    (tileB.dest.cost/*+(tileB.dest.idx/10000000)*/)
            );
            const ownedTiles = []
            for (const rel of ownedRel){
                ownedTiles.push(rel.dest);
            }
            let max;
            let min;
            let amount = 0;
            const tilesCount = ownedTiles.length;
            for (max = 0; max < tilesCount; ++max) {
                amount += ownedTiles[max].cost;
                if (amount >= rent) {
                    ++max;
                    break;
                }
            }
            for (min = 0; min < max; ++min) {
                let newAmount = amount - ownedTiles[min].cost;
                if (newAmount > rent) {
                    amount = newAmount;
                } else {
                    break;
                }
            }
            for (let i = min; i < max; ++i) {
                const lostTile = ownedTiles[i];
                lostTile.dropAllRelations();
                newOwner.createRelation(Player.Owns,lostTile);
                lostTile.createRelation(Tile.Owner, newOwner);
                lostTile.color = newOwner.color;
            }
        }
    }
    
    improve():void{
        if (this.ownsTiles()){
            const cheapestTile = this.cheapestTile();
            if (cheapestTile.cost <= this.coins){
                //println("Player "+this.idx+" improving tile "+cheapestTile.idx+" coins "+this.coins+" cost "+cheapestTile.cost);
                this.coins-=cheapestTile.cost;
                cheapestTile.cost *=2;
                cheapestTile.rent *=2;
                //Try again
                this.improve();
            }
        }
    }
    
    ownsTiles():Boolean{
        return this.getRelationsCount(Player.Owns) > 0;   
    }
    
    cheapestTile():Tile{
        
        return arrayToList(this.getRelationsList(Player.Owns)).worst((relation:ABMRelation):Number=>{
            ////println(relation.dest.cost-(relation.dest.idx/1000))
            return relation.dest.cost;//+(relation.dest.idx/10000000);
        }).dest;
    }

}