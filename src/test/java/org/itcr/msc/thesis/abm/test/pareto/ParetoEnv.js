include("{script}/Player.js")
class ParetoEnv extends ABMEnv{
    availableTiles;
    atTwentyPercent;
    players;
    
    constructor(){
         super(Tile);
    }

    sortByTiles():Array{
        const byTiles= this.agentSet[Player].sort((playerA:Player,playerB:Player):Number=>{
                return playerB.getRelationsCount(Player.Owns)-playerA.getRelationsCount(Player.Owns);
            });
        let totalTiles = 0;
        const values = [];
        byTiles.each((player:Player):void=>{
            totalTiles+=player.getRelationsCount(Player.Owns);
            values.push(totalTiles*100);
        });
        for (var i = values.length-1;i>=0;--i){
            values[i]=values[i]/totalTiles;
        }
        return values;
    }
    

    sortByCoins():Array{
        let totalCoins = 0;
        const values = [];
        const byCoins= this.agentSet[Player].sort((playerA:Player,playerB:Player):Number=>{
                return playerB.coins-playerA.coins;
            });
        byCoins.each((player:Player):void=>{
            totalCoins+=player.coins;
            values.push(totalCoins*100);
        });
        for (var i = values.length-1;i>=0;--i){
            values[i]=values[i]/totalCoins;
        }
        return values;
    }
    
    setup(specs){
        const self = this;
        const labels = [];
        const total = specs.players;
        this.atTwentyPercent = (total*.2)-1;
        for (let i = 0; i<= total;++i){
            labels.push(i);
        }
        this.availableTiles = specs.w*specs.h;
        const black = namedColor("black");
        
        for (let x = 0; x <specs.w; ++x) {
            for (let y = 0 ; y < specs.h; ++y) {
                this.patchAt(x,y).setup();
            }
        }
        this.agents = [];
        
        for (let i = 0; i <specs.players;++i){
            this.agents.push(this.spawn(Player).setup(this.agents.length+1));
        }
        const chart = this.addChart("Cumulative", {
            "Tiles":()=>{
                return self.sortByTiles();
            },"Coins":()=>{
                return self.sortByCoins();
            } 
        },"replace",()=>labels).
            setXLimits(0,100,10).
            setYLimits(0,100,10).
            setXAxis("Agents").
            setYAxis("%").
            addLine([0.2,0,0.2,1],black).
            addLine( [0,0.8,1,0.8],black);
        
        chart.getSeries("Tiles").setColor(namedColor("green").darker());
        chart.getSeries("Coins").setColor(namedColor("yellow"));

    }
    
    step():void{
        if (this.availableTiles === 0){
            this.sampleCharts();
            this.complete = true;
        }
        
    }
}