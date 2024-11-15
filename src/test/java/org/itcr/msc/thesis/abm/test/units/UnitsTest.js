enableSIDistance();

print(distance.km);
let myDist = 2 * distance.km;
print(myDist);
let addDistance = distance.m * 100;
print(addDistance);
let newDistance = myDist + addDistance;
print(newDistance);

Assertions.assertEquals("2.1km",newDistance.to(distance.km).toString());
Assertions.assertEquals("2100m",newDistance.to(distance.m).toString());
Assertions.assertEquals("210000cm",newDistance.to(distance.cm).toString());



a=distance.m-distance.m;

println(a);
b=distance.m*distance.m;
println(b);