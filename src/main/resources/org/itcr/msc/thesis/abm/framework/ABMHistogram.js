/**
 * The ABM histogram
 */
class ABMHistogram {
    static validSampleTypes = Set("add", "addAll", "replace");
    name;
    env;
    sampler;
    samplerType;
    type;
    slots;
    samples;
    sortFx;
    sorted;
    min;
    max;
    yAxis;
    xAxis;
    legend;

    constructor(env: ABMEnv, name: String, sampler: Function, samplerType: String) {
        this.name = name;
        this.env = env;
        this.sampler = sampler;
        this.type = "bar";
        this.samplerType = samplerType;
        this.slots = 5;
        this.samples = [];
        this.sortFx = function (a, b) {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        };
        this.min = null;
        this.max = null;
        this.sorted = false;
        if (samplerType ∉  ABMHistogram.validSampleTypes ) {a
            throw `Invalid Histogram sampler ${samplerType}`;
        }
        this.xAxis = "Histogram";
        this.yAxis = "Count";
        this.legend = "Histogram";
    }

    setSlots(slots: Number): ABMHistogram {
        this.slots = slots;
        return this;
    }

    setLimits(min?: Number, max?: Number): ABMHistogram {
        if (typeof min !== "undefined") {
            this.min = min;
        }
        if (typeof max !== "undefined") {
            this.max = max;
        }
        return this;
    }

    setType(name: String): ABMHistogram {
        this.type = name;
        return this;
    }

    setXAxis(xAxis: String): ABMHistogram {
        this.xAxis = xAxis;
        return this;
    }

    setLegend(legend: String): ABMHistogram {
        this.legend = legend;
        return this;
    }

    setYAxis(yAxis: String): ABMHistogram {
        this.yAxis = yAxis;
        return this;
    }

    add(value: Number) {
        this.samples.push(value);
    }

    decimals(num: Number): String {
        return num.toLocaleString("en-US", {maximumFractionDigits: 2, minimumFractionDigits: 0});
    }

    getLimits() {
        let min, max;
        if (this.min === null) {
            min = this.samples[0];
        } else {
            min = this.min;
        }
        if (this.max === null) {
            max = this.samples[this.samples.length - 1];
        } else {
            max = this.max;
        }
        return [min, max];
    }

    createDataAndLabels() {
        if (this.samples.length===0){
            return [[0]["No data"]];
        }
        if (!this.sorted) {
            this.samples.sort(this.sortFx);
            this.sorted = true;
        }
        const data = [];
        const labels = [];
        let [min, max] = this.getLimits();
        let counter = 0;
        const len = this.samples.length - 1;
        for (; counter <= len; ++counter) {
            if (this.samples[counter] >= min) {
                break;
            }
        }
        const range = (max - min) / this.slots;
        let currSlot = min + range;
        let first = true;
        if (this.slots === 1) {
            labels.push(`${this.decimals(min)} ≤ x ≤ ${this.decimals(max)}`);
        } else {
            labels.push(`${this.decimals(min)} ≤ x ≤ ${this.decimals(currSlot)}`);
        }
        for (let i = 0; i < this.slots; ++i) {
            if (first) {
                first = false;
            } else {
                currSlot += range;
                labels.push(`≤ ${this.decimals(currSlot)}`);
            }
            let counted = 0;
            for (;counter <= len;++counter){
                if (this.samples[counter] > currSlot) {
                    --counter;
                    break;
                } else {
                    ++counted;
                }
            }
            data.push(counted);
        }
        return [data, labels];
    }

    triggerSample(): void {
        this.sorted = false;
        switch (this.samplerType) {
            case "add": {
                this.add(this.sampler(this.env));
                break;
            }
            case "addAll": {
                const values = this.sampler(this.env);
                for (const value of values) {
                    this.add(value);
                }
                break;
            }
            case "replace": {
                this.samples = [];
                const values = this.sampler(this.env);
                for (const value of values) {
                    this.add(value);
                }
                break;
            }

        }
    }

    getChartData(): Object {
        const [dataValue, labelsValue] = this.createDataAndLabels();
        const datasets = [];
        const data = {
            "label": this.legend,
            "fill": false,
            "data": dataValue
        };
        datasets.push(data);
        return {
            "type": this.type,
            "data": {
                "labels": labelsValue,
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
                    x: {
                        title: {
                            display: true,
                            text: this.xAxis
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: this.yAxis
                        },
                        min: 0
                    }
                }
            }
        };
    }
}