/**
 * A class to store time chat behavior
 */
class ABMTimeChart {
    name;
    env;
    labels;
    type;
    yAxis;
    series;
    stacked;
    yMax;
    yMin;
    xMax;
    xMin;
    xStep;
    samplers;

    /**
     * Series has name and sampler
     * @param env
     * @param name
     * @param series
     */
    constructor(env: ABMEnv, name: String, series) {
        this.name = name;
        this.env = env;
        this.labels = [];
        this.yAxis = "value";
        this.type = "line";
        this.series = {};
        this.samplers = {};
        for (const seriesName of Object.keys(series)) {
            this.series[seriesName] = new ABMChartSeries();
            this.samplers[seriesName] = series[seriesName];
        }
        this.yMax = null;
        this.yMin = null;
        this.xMax = null;
        this.xMin = null;
        this.xStep = null;
        this.stacked = false;
    }

    /**
     * Sets Y limit
     * @param min
     * @param max
     * @returns {ABMTimeChart}
     */
    setYLimits(min?: Number, max?: Number): ABMTimeChart {
        if (min !== undefined) {
            this.yMin = min;
        }
        if (max !== undefined) {
            this.yMax = max;
        }
        return this;
    }

    /**
     *
     * @param min
     * @param max
     * @param step
     * @returns {ABMTimeChart}
     */
    setXLimits(min?: Number, max?: Number, step?: Number): ABMTimeChart {
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

    /**
     *
     * @param seriesName
     * @param sampler
     * @returns {ABMChartSeries}
     */
    addSeries(seriesName: String, sampler): ABMChartSeries {
        this.samplers[seriesName] = sampler;
        return this.series[seriesName] = new ABMChartSeries();
    }

    /**
     *
     * @param stacked
     * @returns {ABMTimeChart}
     */
    setStacked(stacked: Boolean): ABMTimeChart {
        this.stacked = stacked;
        return this;
    }

    /**
     *
     * @param seriesName
     * @returns {*}
     */
    getSeries(seriesName) {
        return this.series [seriesName];
    }

    /**
     *
     * @param name
     * @returns {ABMTimeChart}
     */
    setYAxis(name: String): ABMTimeChart {
        this.yAxis = name;
        return this;
    }

    /**
     *
     * @param name
     * @returns {ABMTimeChart}
     */
    setType(name: String): ABMTimeChart {
        this.type = name;
        return this;
    }

    /**
     *
     */
    triggerSample(): void {
        this.labels.push(this.env.currStep);
        for (const seriesName of Object.keys(this.series)) {
            this.series[seriesName].triggerSample(this.samplers[seriesName](this.env));
        }
    }

    getChartData(): Object {
        const datasets = [];
        for (const seriesName of Object.keys(this.series)) {
            const series = this.series[seriesName];
            const data = {
                "label": seriesName,
                "fill": false,
                "data": series.entries,
            };
            if (series.hasCustomColor()) {
                Object.assign(data, series.getColor());
            }
            datasets.push(data);
        }
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
        const xValues = {
            type: 'linear',
            title: {
                display: true,
                text: 'Step'
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

        return {
            "type": this.type,
            "data": {
                "labels": this.labels,
                "datasets": datasets
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
                    }
                },
                "scales": {
                    x: xValues,
                    y: yValues
                }
            }
        };
    }
}