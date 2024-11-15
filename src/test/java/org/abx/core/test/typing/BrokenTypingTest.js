var addOne = function(x

){
    assertIsInstanceOf(x,Number);
    return x+1;
}

addTwo=(x)=>x+2;

Assertions.assertEquals(2,addOne(1));
Assertions.assertEquals(3,addTwo(1));

var addOne = function(x:String

){
    assertIsInstanceOf(x,Number);
    return x+1;
}

addTwo=(x:Number)=>x+2;

Assertions.assertEquals(2,addOne(1));
Assertions.assertEquals(3,addTwo(1));
var data;
addThree=(x)=> data=x+3;

Assertions.assertEquals(4,addThree(1));

addThree=(x:Number)=> data=x+3;

Assertions.assertEquals(4,addThree(1));


addFour=(x)=> {
    return x+4;
}

Assertions.assertEquals(5,addFour(1));

addFour=(x:Number)=> {
    return x+4;
}

Assertions.assertEquals(5,addFour(1));


class AddFive  {
    content;

    constructor(contents) {
        this.content = contents+5;
    }
}
Assertions.assertEquals(6,new AddFive(1).content);

class AddFiveV2  {
    content;

    constructor(contents:Number) {
        this.content = contents+5;
    }
}
Assertions.assertEquals(6,new AddFiveV2(1).content);
