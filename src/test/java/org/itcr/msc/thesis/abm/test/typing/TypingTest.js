var addOne = function (x
) {
    assertIsInstanceOf(x, Number);
    return x + 1;
}

addTwo = (x) => x + 2;

Assertions.assertEquals(2, addOne(1));
Assertions.assertEquals(3, addTwo(1));

var addOne = function (x: Number
) {
    assertIsInstanceOf(x, Number);
    return x + 1;
}

addTwo = (x: Number) => x + 2;

Assertions.assertEquals(2, addOne(1));
Assertions.assertEquals(3, addTwo(1));
var data;
addThree = (x) => data = x + 3;

Assertions.assertEquals(4, addThree(1));

addThree = (x: Number) => data = x + 3;

Assertions.assertEquals(4, addThree(1));


addFour = (x) => {
    return x + 4;
}

Assertions.assertEquals(5, addFour(1));

addFour = (x: Number) => {
    return x + 4;
}

Assertions.assertEquals(5, addFour(1));


class AddFive {
    content;

    constructor(contents) {
        this.content = contents + 5;
    }

    addSix(x:Number):Number{
        return x+6;
    }


}

Assertions.assertEquals(6, new AddFive(1).content);

class AddFiveV2 {
    content;

    constructor(contents: Number) {
        this.content = contents + 5;
    }
}

Assertions.assertEquals(6, new AddFiveV2(1).content);


var foo = function (x, y) {
    return 1;
}

var a=(x) => 1;


var z=
    (x,y)=>{const out = __100(x,y);
    assertValidInstances([[out,Number]]); return out}; __100=(x,y)  => 2*x+y;
Assertions.assertEquals(21, z(10,1))

var xy =(x,y): Number => 2*x+y
Assertions.assertEquals(23, xy(5,13))

var xyz =(x,y): Number => {const w= 4;return 2*x+y}
Assertions.assertEquals(66, xyz(30,6))

var result = new AddFive(2).addSix(2);
Assertions.assertEquals(8,result)

z=new function(){ this.a=function(x){return x+1;} }
Assertions.assertEquals(3,z.a(2))


z2=new function(){ this.a=function(x):Number {return x+1;}}
Assertions.assertEquals(3,z2.a(2))

var mul2 = function(x):Number{
    return x*2;
}
Assertions.assertEquals(6,mul2(3))

z2.xx=function(a){
    return a+24;
}
Assertions.assertEquals(27,z2.xx(3))

z2.xx2=function(a):Number{
    return a+24;
}
Assertions.assertEquals(27,z2.xx2(3))

var x = function():Number|undefined{

}
x();

var y = function():String|Number{
    return 1
}
y();

var z = function():String|Number|undefined{
}
z();


print(` ${(()=> {return "hi"})()}`)

a = ():void=>{return;}
a()