/**
 *
 */
class ABMChart {
    static validSampleTypes = Set("add", "addAll", "replace");
    name;
    samplers;
    series;
    samplerType;
    type;
    labels;
    stacked;
    yMax;
    yMin;
    xMax;
    xMin;
    xStep;
    lines;
    labelGen;
    xAxis;

    constructor(name: String, samplers: Object, samplerType: String, labelGen?: Function) {
        if (samplerType ∉  ABMChart.validSampleTypes  )   {
            throw `Invalid Chart sampler type ${samplerType}`;
        }
        this.name = name;
        this.type = "line";
        this.labels = [];
        this.samplers = samplers;
        this.series = {};
        for (const name of Object.keys(samplers)) {
            this.series[name] = new ABMChartSeries();
        }
        this.samplerType = samplerType;
        this.yMax = null;
        this.yMin = null;
        this.xMax = null;
        this.xMin = null;
        this.xStep = null;
        this.yStep = null;
        this.stacked = false;
        this.lines = [];
        this.xAxis = "Data";
        this.labelGen = labelGen;
    }


    /**
     * Sets Y limit
     * @param min
     * @param max
     * @param step
     * @returns {ABMTimeChart}
     */
    setYLimits(min?: Number, max?: Number, step?: Number): ABMChart {
        if (min !== undefined) {
            this.yMin = min;
        }
        if (max !== undefined) {
            this.yMax = max;
        }
        if (step !== undefined) {
            this.yStep = step;
        }
        return this;
    }

    /**
     *
     * @param stacked
     * @returns {ABMChart}
     */
    setStacked(stacked: Boolean): ABMChart {
        this.stacked = stacked;
        return this;
    }

    /**
     *
     * @param min
     * @param max
     * @param step
     * @returns {ABMTimeChart}
     */
    setXLimits(min?: Number, max?: Number, step?: Number): ABMChart {
        if (min !== undefined) {
            this.xMin = min;
        }
        if (max !== undefined) {
            this.xMax = max;
        }
        if (step !== undefined) {
            this.xStep = step;
        }
        return this;
    }

    add(name: String, value: Number | Object) {
        this.series[name].entries.push(value);
    }

    setType(name: String): ABMChart {
        this.type = name;
        return this;
    }

    setXAxis(xAxis: String): ABMChart {
        this.xAxis = xAxis;
        return this;
    }

    setYAxis(yAxis: String): ABMChart {
        this.yAxis = yAxis;
        return this;
    }

    triggerSample(): void {
        switch (this.samplerType) {
            case "add": {
                if (this.labelGen === undefined) {
                    for (const name of Object.keys(this.samplers)) {
                        this.add(name, this.samplers[name]());
                    }
                    this.labels.push(this.labels.length);
                } else {
                    const label =this.labelGen();
                    this.labels.push(label);
                    for (const name of Object.keys(this.samplers)) {
                        this.add(name, {x:label,y:this.samplers[name]()});
                    }
                    this.labels.push();
                }
                break;
            }
            case "replace": {
                for (const name of Object.keys(this.samplers)) {
                    this.series[name].entries=[];
                }
                //Now add all
            }
            case "addAll": {
                let newLabels = [];
                if (this.labelGen !== undefined) {
                    for (const label of this.labelGen()) {
                        newLabels.push(label);
                        this.labels.push(label);
                    }
                    let count;
                    for (const name of Object.keys(this.samplers)) {
                        count = 0;
                        for (const value of this.samplers[name]()) {
                            this.add(name, {x: newLabels[count], y: value});
                            ++count;
                        }
                    }
                } else {
                    let count;
                    for (const name of Object.keys(this.samplers)) {
                        count = 0;
                        for (const value of this.samplers[name]()) {
                            this.add(name, value);
                            ++count;
                        }
                    }
                    if (this.labelGen === undefined) {
                        while (count > 0) {
                            this.labels.push(this.labels.length);
                            --count;
                        }
                    }
                }
                break;
            }
        }
    }

    /**
     *
     * @param seriesName
     * @returns {*}
     */
    getSeries(seriesName) {
        return this.series[seriesName];
    }

    addLine(coords: Object, color: Object): ABMChart {
        this.lines.push({"coords": coords, "color": asRGBA(color)});
        return this;
    }

    getChartData(): Object {
        const yValues = {
            title: {
                display: true,
                text: this.yAxis
            },
            stacked: this.stacked
        };
        if (this.yMax !== null) {
            yValues.max = this.yMax;
        }
        if (this.yMin !== null) {
            yValues.min = this.yMin;
        }
        if (this.yStep !== null) {
            yValues.ticks = {
                "stepSize": this.yStep
            }
        }
        const xValues = {
            type: 'linear',
            title: {
                display: true,
                text: this.xAxis
            },
            maxRotation: 0,
            stacked: this.stacked
        }
        if (this.xMax !== null) {
            xValues.max = this.xMax;
        }
        if (this.xMin !== null) {
            xValues.min = this.xMin;
        }
        if (this.xStep !== null) {
            xValues.ticks = {
                "stepSize": this.xStep
            }
        }
        const datasets = [];
        for (const name of Object.keys(this.samplers)) {
            const series = this.series [name];
            const data = {
                "label": name,
                "fill": false,
                "data": series.entries
            };

            if (series.hasCustomColor()) {
                Object.assign(data, series.getColor());
            }
            datasets.push(data);
        }
        return {
            "type": this.type,
            "data": {
                "labels": this.labels,
                "datasets": datasets,
                "lines": this.lines
            },
            "options": {
                "animation": false,
                "plugins": {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: this.name
                    },
                    linesPlugin: {}
                },
                "scales": {
                    x: xValues,
                    y: yValues
                }
            }
        };
    }
}