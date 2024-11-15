window = this;

var ABMFrameworkCore;

print = function (value) {
    ABMFrameworkCore.print(value + "");
};


println = (x) => print(x + "\n");

namedColor = (x) => imgClient.namedColor(x);

namedColors = () => imgClient.namedColors();

asRGB = (color) => imgClient.asRGB(color);

asRGBA = (color) => imgClient.asRGBA(color);

rgbColor = (r: Number, g: Number, b: Number) => imgClient.rgbColor(r, g, b);

rgbaColor = (r: Number, g: Number, b: Number, a: Number) => imgClient.rgbaColor(r, g, b, a);

function randomInt(minOrMax: Number, max?: Number) {
    if (max === undefined) {
        const value= rnd.nextInt(minOrMax) ;
        return value;
    } else {
        const value= rnd.nextInt(max - minOrMax) + minOrMax;
        return value;
    }
}

function random(minOrMax?: Number, max?: Number): Number {
    if (minOrMax === undefined) {
        const value=  rnd.nextDouble();
        return value;
    } else {
        if (max === undefined) {
            const value=  rnd.nextDouble()* minOrMax;
            return value;
        } else {
            const value=  (rnd.nextDouble() * (max - minOrMax)) + minOrMax;
            return value;

        }
    }
}

clear = () => ABMFrameworkCore.clear();

randomNormal = function (mean?: Number, stdDev?: Number) {
    if (mean === undefined) {
        mean = 0;
    }
    if (stdDev === undefined) {
        stdDev = 1;
    }
    return normalGen.next(mean, stdDev);
}

var ε = 0.00000000001;
_assertions = Assertions.static;

Assertions = {
    assertZero(a, message): void {
        //Using equality
        if (Math.abs(a) > ε) {
            if (typeof message !== "undefined") {
                throw message;
            } else {
                throw `${a} is not zero`;
            }
        }
    },
    assertContainsText(container, content):void{
        if (!(container+"").includes(content)){
            throw (`Text ${container} does not include ${content}`);
        }
    },
    assertEquals(a, b, message):void {
        //Using equality
        if (a != b) {
            if (typeof message !== "undefined") {
                throw message;
            } else {
                throw `${a} is not equals to ${b}`
            }
        }
    },
    assertFloatEquals(a, b, message):void {
        //Using equality
        if ((a - b) > ε) {
            if (typeof message !== "undefined") {
                throw message;
            } else {
                throw `${a} is not equals to ${b}`
            }
        }
    },
    assertNull:_assertions.assertNull,
    assertNotEquals: _assertions.assertNotEquals,
    assertTrue: _assertions.assertTrue,
    assertFalse: _assertions.assertFalse
}
classTypeError = function (elem, classType) {
    classType = classType.toString();
    return `${elem} is not of ${classType.toString().substring(0, classType.indexOf('{'))}`
}
assertIsInstanceOf = function (elem, classType) {
    if (classType === undefined) {
        if (elem !== undefined) {
            throw `Expecting void but got ${elem}`;
        }
    } else if (classType instanceof Array) {
        let subClass;
        for (subClass of classType) {
            if (subClass === null) {
                if (elem === null) {
                    return;
                }
            } else if (subClass === undefined) {
                if (elem === undefined) {
                    return;
                }
            } else {
                if (Object(elem) instanceof subClass) {
                    return;
                }
            }
        }
        throw classTypeError(elem, classType);
    } else {
        if (!(Object(elem) instanceof classType)) {
            throw classTypeError(elem, classType);
        }
    }
}

assertValidInstances = function (pairs) {
    let keyValue;
    for (keyValue of pairs) {
        assertIsInstanceOf(keyValue[0], keyValue[1])
    }
    return {"out": true};
}

KnownShapes = () => new SetClass(imgClient.knownShapes());

verifyValidInstances = function (pairs) {
    let keyValue;
    for (keyValue of pairs) {
        if (typeof keyValue[0] === "undefined" || keyValue[0] === null) {
            continue;
        }
        assertIsInstanceOf(keyValue[0], keyValue[1])
    }
    return {"out": true};
}

createValidator = function () {
    const _validateType = {
        setType: function (theType) {
            this.type = theType;
            return this;
        },
        setValue: function (value) {
            verifyValidInstances([[value, this.type]]);
            return this;
        },
        set evaluate(value) {
            verifyValidInstances([[value, this.type]]);
            return value;
        }
    };

    const _assertType = {
        setType: function (theType) {
            this.type = theType;
            return this;
        },
        setValue: function (value) {
            assertValidInstances([[value, this.type]]);
            return this;
        },
        set evaluate(value) {
            assertValidInstances([[value, this.type]]);
            return value;
        }
    };
    _validateType._assertType = _assertType;
    _validateType._validateType = _validateType;
    _assertType._validateType = _validateType;
    _assertType._assertType = _assertType;
    return [_assertType, _validateType];
}

_assertType = function () {
    return createValidator()[0]
}

_validateType = function () {
    return createValidator()[1]
}

include = function (file) {
    ABMFrameworkCore.processFile(file);
}

readBinary = function (file) {
    return ABMFrameworkCore.readBinary(file);
}

readString = function (file):String {
    return ABMFrameworkCore.readString(file);
}

csvToString = (csv):String=>ABMFrameworkCore.csvToString(csv);

writeImg=(path,img):void=>{ABMFrameworkCore.writeImg(path,img)};

writeString=(path,img):void=>{ABMFrameworkCore.writeString(path,img)};

appendString=(path,img):void=>{ABMFrameworkCore.appendString(path,img)};

startVideoRecording=(file,fps):void=>{ABMFrameworkCore.startVideoRecording(file,fps)};

appendImg=(img):void=>{ABMFrameworkCore.appendImg(img)};

closeVideoStream=():void=>{ABMFrameworkCore.closeVideoStream()};

toCSV = function(content ){
    const javaCSV =  ABMFrameworkCore.toCSV(content);
    const jsCSV = [];
    for (const javaRow of javaCSV){
        const jsRow = [];
        jsCSV.push(jsRow)
        const length = javaRow.length;
        for (let i = 0; i<length; ++i){
            jsRow[i]=javaRow[i];
        }
    }
    return jsCSV;
}
toImg = (content ) =>ABMFrameworkCore.toImg(content);

createHttpClient =()=> ABMFrameworkCore.createHttpClient();

getBytes=(content)=>ABMFrameworkCore.getBytes(content);

streamFile=(filename)=>ABMFrameworkCore.streamFile(filename);

addShape=function (name:String, points):void{
    const path = imgClient.createPath();
    const first = points[0];
    path.moveTo(first[0],first[1]);
    for (const point of points){
        path.lineTo(point[0],point[1]);
    }
    imgClient.addShape(name,path);
}

__Pi_ = Math.PI;

toDeg = (x) => 180 * (x / π);
toRad = (x) => π * (x / 180);

sleep = (time: Number) => ABMFrameworkCore.sleep(time);

positiveModule = (x: Number, mod: Number): Number => {
    if (x >= mod) {
        return x % mod;
    } else if (x < 0) {
        //Cover weird JS case with small values like -6.38378239159465e-16
        return ((x % mod) + mod) % mod;
    } else {
        return x;
    }
}

function maxDecimals(value, dp){
    return +value.toFixed(dp);
}

tick = ()=>{
    const tick= ABMFrameworkCore.tick();
    const x = new Error();
    let line = x.stack.split('\n')[2].trim();
    return "Tick duration "+tick+" "+line+".";

}

Number.prototype.withMaxMag=function(mag){
    if (this < 0){
        return -Math.min(mag,-this);
    }else {
        return Math.min(mag,this);
    }
}

Number.prototype.normalize=function(){
    if (this === 0){
        throw "Cannot normalize 0";
    }else {
        return 1;
    }
}