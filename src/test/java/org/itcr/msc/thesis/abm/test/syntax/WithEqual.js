var counter = 0;
function functionName(n:Number = 1){
    Assertions.assertEquals(n,1);
    ++counter;
};

namedFunction =function(n:Number = 1){
    Assertions.assertEquals(n,1);
    ++counter;
};

incognito=(n:Number=1)=>{
    Assertions.assertEquals(n,1);
    ++counter;
};


functionName();
namedFunction();
incognito();
Assertions.assertEquals(counter,3);


function isZero(element: Number):Boolean{
    return element === 0 ;
}