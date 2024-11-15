/**
 * Sets Objects are powerful representation of Math Set
 * Given element x, and Sets A, B, you can use:
 *
 * Set variables:
 * ∅ the empty set.
 *
 * Set operators:
 * x ∈ A to check if element x exists in set A.
 * x ∉ A to check if element x does not exist in set A.
 * A ⊆ B to check if set A is contained within set B.
 * A ⊇ B to check if set B is contained within set A.
 * A == B to check if set A contains exactly same elements as set B.
 * A ∪ B to create a net set (A ∪ B).
 * A ∩ B to create a net set (A ∩ B).
 *
 * Set methods:
 * A.isEmpty() to check if set is empty
 * A.size() to get set size
 * A.one(shuffle: Boolean) gets one element.
 *   Shuffle indicates whether the set should be shuffled before choosing one.
 * A.some(count: Number,shuffle: Boolean) gets up to count elements.
 *   Shuffle indicates whether the set should be shuffled before choosing elements.
 * A.toBag(exp: ?[Function, String]) Creates a new bag with the exp applied for each element
 *   If exp is not defined, it will create a bag with elements
 *   Otherwise, if exp is a string the element attribute is extracted and added to the bag.
 *   Otherwise, the result of exp(element) is added to the bag
 * A.top(count:Number, f(x)):
 *   Creates a sorted list with at most count elements sorted by decreasing order of the result of f(x).
 * A.bottom(count:Number, f(x)):
 *   Creates a sorted list with at most count elements sorted by increasing order of the result of f(x).
 * A.sort(Number, f(x)):
 *   Creates a sorted list with by increasing order of the result of f(x).
 * A.maps(f(x), shuffle: Boolean) Creates new set with results f(x).
 *   Shuffle indicates whether the set should be shuffled before choosing one.
 * A.any(f(x)) Returns true if any element is true of f(x)
 * A.first(f(x), shuffle: Boolean) Returns the first found element which is true for f(x)
 *   Shuffle indicates whether the set should be shuffled before choosing.
 * A.reduce(f(x), defaultValue,shuffle:?Boolean)
 *   Reduces this set applying recursively f(x) to the element and the result.
 *   default value is the initial value
 *   Shuffle indicates whether the set should be shuffled before the reduce.
 * A.every(f(x)) Returns true if all the elements are true of f(x)
 * A.filter(f(x), shuffle: Boolean) Creates new set with only the elements which are true for f(x).
 *   Shuffle indicates whether the set should be shuffled before choosing one.
 * A.atMost(f(x), count:Number, shuffle: Boolean) Creates new set with only the elements which are true for f(x).
 *   Count indicates the maximum number to add to new set
 *   Shuffle indicates whether the set should be shuffled before choosing one.
 * A.each(f(x), shuffle: Boolean) Executes f(x) for each element. Return same set
 *   Shuffle indicates whether the f(x) should be done in shuffled order
 * A.append(x): Appends x to A set. Returns same set.
 * A.remove(x): Removes x from A set. Returns same set.
 * A.sum(attr?): Calculates the sum of element values using reduce with default value being 0.
 *   If attr is not undefined, then it is the sum of attr of all elements
 * A.avg(attr?): Calculates the average using sum and the size methods.
 *  If attr is not undefined, then it is the avg of attr of all elements
 */

//---------------
// Real examples
//---------------
println("hi")
Assertions.assertTrue(∅.isEmpty())
var oneToFive = Set(1,2,3,4,5)

var doubleOneToFive = Set(2,4,6,8,10)

Assertions.assertEquals(Set(1,2,3,4,5,6,8,10), oneToFive ∪ doubleOneToFive)
Assertions.assertEquals(Set(2,4), oneToFive ∩ doubleOneToFive)
var genDoubleOneToFive = oneToFive.maps((x)=>2*x);
print(genDoubleOneToFive)
Assertions.assertEquals(doubleOneToFive,genDoubleOneToFive)

var oneElement = oneToFive.one();

Assertions.assertTrue ( oneElement ∈ oneToFive)


var someElements = oneToFive.some(3);
Assertions.assertTrue ( someElements ⊆ oneToFive)
Assertions.assertTrue ( someElements .size() === 3)
Assertions.assertTrue(oneToFive.any((x):Boolean=>x==3));
var biggerThan2 = oneToFive.filter((x)=>x>2);
Assertions.assertTrue ( biggerThan2 ⊆ oneToFive)
Assertions.assertTrue ( biggerThan2 .size() === 3)

var biggerThan2Only2 = oneToFive.atMost((x)=>x>2,2);
Assertions.assertTrue ( biggerThan2Only2 ⊆ oneToFive)
Assertions.assertTrue ( biggerThan2Only2 ⊆ Set(3, 4,5))
Assertions.assertEquals ( biggerThan2Only2 .size() , 2)


var higher = doubleOneToFive.best((x)=>x);
Assertions.assertEquals(higher,10)
var lower = doubleOneToFive.worst((x)=>x);
Assertions.assertEquals(lower,2)

var a = Set(1, 2, 3)

var y = a.maps((x) => print(x))

println("y" + y)
println("length" + y.size())
Assertions.assertEquals(0, y.size())


var result = a.filter((x) => x > 1)

println("result" + result)
Assertions.assertEquals(2, result.size())
Assertions.assertTrue(2 ∈ result)
Assertions.assertTrue(1 ∉ result)

out = (x): Boolean => true

Assertions.assertTrue(out())


Assertions.assertEquals(Set(1,2,3),Set(1,2,3,3))
Assertions.assertEquals(2,Set(1,2,3).avg())
Assertions.assertEquals(6,Set(1,2,3).sum())
oneToTent = Set(1,2,3,4,5,6,7,8,9,10)

Assertions.assertEquals(Set(1,2,3),oneToTent.bottom(3,(a, b) =>  a - b))
Assertions.assertEquals(Set(7,8,9,10),oneToTent.top(4,(a, b) =>  a - b))
Assertions.assertEquals(Set(1,2),oneToTent.top(2,(a,b)=>b-a));
Assertions.assertEquals(10,oneToTent.best());
Assertions.assertEquals(1,oneToTent.worst());



a = oneToTent.one(true);
b = oneToTent.one(true);
c = oneToTent.one(true);
Assertions.assertTrue(a!==b || a!==c)
x = oneToTent.some(4,true)
y = oneToTent.some(4,true);

Assertions.assertEquals(List(1,2,3),Set(3,2,1,1).sort());


let complexSet = Set(
    {"name":"a","val":1},
    {"name":"b","val":2},
    {"name":"c","val":6});
Assertions.assertEquals(complexSet.sum("val"),9);
Assertions.assertEquals(complexSet.avg("val"),3);