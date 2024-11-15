class Tile extends ABMPatch{
    static Owner = "owner";
    static MaxRent = 50;
    static CostRenRatio = 3;
    static idX= 0;
    
    cost;
    rent;
    setup(){
        this.rent = randomInt( Tile.MaxRent)+1;
        this.cost = this.rent*Tile.CostRenRatio;
        const color = Math.round((this.rent*255)/Tile.MaxRent);
        this.color = rgbColor(color,color,color);
        this.idx = ++Tile.idX;
    }
    
    hasOwner():Boolean{
        return this.getRelationsCount(Tile.Owner) !== 0;
    }
    
    getOwner():Player{
        return this.getRelationsList(Tile.Owner)[0].dest;
    }
}