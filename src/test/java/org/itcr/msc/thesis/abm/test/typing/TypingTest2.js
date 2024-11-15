class A {
    value;
    #hidden;

    constructor() {
        this.value = 5;
        this.#hidden = 6
    };

    getData(): Number {
        return this.value
    };

    getData2(): Number {
        return (function () :Number{
            return this.value;
        }).apply(this);
    }

    getData3(a:Number): Number {
        return (function ():Number {
            return (function () :Number{
                return a + this.value;
            }).apply(this);
        }).apply(this);
    }

    getHidden(): Number {
        return this.#hidden
    };

    getHidden2(): Number {
        return (function () :Number{
            return this.#hidden;
        }).apply(this);
    }
}

var a = new A();
Assertions.assertEquals(a.getData(), a.value);
Assertions.assertEquals(a.getData2(), a.value);
Assertions.assertEquals(a.getHidden(), a.getHidden2());
Assertions.assertEquals(a.getData3(1), 1 + a.value);

//--------------------------------------

a = ((x):Number => {
    return x + 1
})
a_ = ((x):Number => (():Number => {
    return x + 1
}).apply(this));

Assertions.assertEquals(a(1), a_(1));

//--------------------------------------

a = ((x):Number => x + 1);
a_ = ((x):Number => _assertType().setType(Number).evaluate = x + 1);

Assertions.assertEquals(a(1), a_(1));
//--------------------------------------

a = x => x + 1;
a_ = x => _assertType().setType(Number).evaluate = x + 1;

Assertions.assertEquals(a(1), a_(1));

//--------------------------------------

a = (x):Number => x + 1;
a_ = (x):Number => _assertType().setType(Number).evaluate = x + 1;

Assertions.assertEquals(a(1), a_(1));

//--------------------------------------

a = (x => x + 1);
a_ = (x=> _assertType().setType(Number).evaluate = x + 1);

Assertions.assertEquals(a(1), a_(1));
//--------------------------------------

a = (x => x + 1);
a_ = (x=> _assertType().setType(Number).setValue(x)._assertType.setType(Number).evaluate = x + 1);

Assertions.assertEquals(a(1), a_(1));
//--------------------------------------

A = {
    a: 1,
    data(x):Number {
        return this.a + x;
    },
    data_(x) :Number {
        return (function () {
            return this.a + x;
        }).apply(this);
    }
}
Assertions.assertEquals(A.data(1), A.data_(1));


//--------------------------------------

A = function () {
    const x = 1;
    this.y = 2;

    this.xy = function ():Number {
        return x + this.y;
    }
    this.xy_ = function () :Number{
        return (function ():Number {
            return x + this.y;
        }).apply(this);
    }
    var z = function ():Number {
        return x;
    }
    this.out = function ():Number {
        return this.xy() + z();
    }
    this.out_ = function ():Number {
        return (function ():Number {
            return this.xy() + z();
        }).apply(this);
    }
}
Assertions.assertEquals(new A().xy(), 3);
Assertions.assertEquals(new A().xy_(), 3);
Assertions.assertEquals(new A().out(), 4);
Assertions.assertEquals(new A().out_(), 4);


//--------------------------------------
const DekOps = Operators({
        "+"(a: Dek, b: Dek):Number {
            return a.val + b.val;
        },
        "-"(a: Dek, b: Dek) :Number{
            return (function () :Number{
                return a.val + b.val;
            }).apply(this);
        }
    }
);

/**
 * Wrapper for Java Set class
 */
class Dek extends DekOps {
    val;

    constructor(val:Number) {
        super();
        this.val = val;
    }
}

Assertions.assertEquals(new Dek(2) + new Dek(3), 5);
Assertions.assertEquals(new Dek(2) - new Dek(3), 5);