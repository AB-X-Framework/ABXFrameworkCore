
let a = List(1,2,3);
let b= arrayToList([1,2,3]);

Assertions.assertEquals(a,b);

Assertions.assertEquals(1, a.worst());
Assertions.assertEquals(3, a.best());

const worst = {"name":"z","val":1};
let complexList = List(worst,
    {"name":"d","val":2},
    {"name":"c","val":3});

Assertions.assertEquals(worst, complexList.worst("val"));

Assertions.assertEquals("c", complexList.best(elem=>elem.val).name);

b.append(5);
a.append(5);
Assertions.assertEquals(List(1,2,3,5),a);
Assertions.assertEquals(List(1,2,3,5),b);

b.append(5);
Assertions.assertEquals(List(1,2,3,5,5),b);

b.remove(5);
Assertions.assertEquals(List(1,2,3,5),b);

b.append(5);
Assertions.assertEquals(List(1,2,3,5,5),b);

b.removeAll(5);
Assertions.assertEquals(List(1,2,3),b);

b.append(5);
Assertions.assertEquals(Set(1,2,3,5),b.toSet());

b.append(5);
Assertions.assertEquals(Bag(1,2,3,5,5),b.toBag());
Assertions.assertEquals(Set(1,2,3,5),b.toSet());


Assertions.assertTrue(b.any(elem=>elem>2));
Assertions.assertFalse(b.any(elem=>elem>20));
Assertions.assertEquals(List(1,2,3).sum(),6);
Assertions.assertEquals(List(1,2,3).avg(),2);


Assertions.assertEquals(List(3,4,5),List(1,2,3).maps(x=>x+2));
Assertions.assertEquals(List(3,4),List(3,4,5,6,5675).filter(x=>x<5));


let counter=0;
List(1,2,3).each(x=>{counter+=x});
Assertions.assertEquals(6,counter);
complexList = List(
    {"name":"a","val":1},
    {"name":"b","val":2},
    {"name":"c","val":6});
Assertions.assertEquals(complexList.sum("val"),9);
Assertions.assertEquals(complexList.avg("val"),3);