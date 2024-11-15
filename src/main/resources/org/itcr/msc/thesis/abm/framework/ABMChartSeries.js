/**
 * Basic class which handles the series data
 */
class ABMChartSeries{
    entries;
    borderColor;
    backgroundColor;

    constructor(r) {
        this.entries = [];
        this.borderColor = null;
    }

    hasCustomColor():Boolean{
        return this.borderColor != null;
    }

    getColor(){
        return {"borderColor":this.borderColor,"backgroundColor":this.backgroundColor};
    }

    triggerSample(data){
        this.entries.push(data);
    }

    setColor(color){
        this.backgroundColor = imgClient.asRGB(color.darker());
        this.borderColor = imgClient.asRGB(color);
    }
}