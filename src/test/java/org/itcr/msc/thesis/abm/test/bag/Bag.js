/**
 * A bag can have one or more instances of the same element
 * Given element x, and Bags A, B, you can use:
 *
 * Bag operators:
 * x ∈ A to check if element x exists in bag A.
 * x ∉ A to check if element x does not exist in bag A.
 * A == B to check if bag A and B contains exactly same elements  (including duplicates).
 *
 * Bag methods
 * A.append(x) appends element x to bag A. Modifies bag A
 * A.sum(attr?): Calculates the sum of element values using reduce with default value being 0 (including duplicates).
 *   If attr is not undefined, then it is the sum of attr of all elements
 * A.avg(attr?): Calculates the average using sum and the size methods (including duplicates).
 *  If attr is not undefined, then it is the avg of attr of all elements
 * A.add(x) to add element x to bag A
 * A.remove(x) to remove element x from bag A
 * A.size() to get the amount of all elements in A (including duplicates).
 * A.equals(B) to check if bag A and B contains exactly same elements  (including duplicates).
 * A.elemsToSet() returns a set with list of all elements in A (removes duplicates)
 */

let bag = Bag(1,2,3,4,5,5);
Assertions.assertEquals(6,bag.size())
Assertions.assertTrue(2 ∈ bag);
Assertions.assertTrue(7 ∉ bag);

let bag2 = Bag(5,2,3,4,5,1);
Assertions.assertTrue(bag == bag2)
Assertions.assertEquals(bag,bag2);

let set = Set(1,2,3,4,5)
Assertions.assertEquals(bag.elemsToSet(),set)
Assertions.assertEquals(20,bag.sum())

let newBag = Bag(2,2,4,4);

Assertions.assertEquals(3,newBag.avg())

let userSet=Set({"name":"Luis","money":100},{"name":"Ignatio","money":100})
Assertions.assertEquals(200,userSet.toBag("money").sum())
Assertions.assertEquals(100,userSet.toBag((x)=>x.money).avg())


Assertions.assertEquals(List(1,1,2,3),Bag(3,2,1,1).sort());

let complexBag = List(
    {"name":"a","val":1},
    {"name":"b","val":2},
    {"name":"c","val":6});
Assertions.assertEquals(complexBag.sum("val"),9);
Assertions.assertEquals(complexBag.avg("val"),3);