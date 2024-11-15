allTests = [];
addTest =(name:String, testFunction:Function):void=>{
    allTests.push({
        "name":name,
        "fx":testFunction
    });
}


runTests=():void =>{
    success = 0;
    failures = 0;
    errors={};
    for (const test of allTests){
        const name = test.name;
        const fx =test.fx;
        try {
            print(`Test ${name}: `)
            fx();
            println("Success.");
            ++success;
        }catch(e){
            println("Failure: "+e+".");
            errors[name]=e;
            ++failures;
        }
    }
    println(`Total tests: ${allTests.length}`);
    println(`Total success: ${success}`);
    println(`Total failures: ${failures}`);
    ABMFrameworkCore.testingComplete(success,failures)

}