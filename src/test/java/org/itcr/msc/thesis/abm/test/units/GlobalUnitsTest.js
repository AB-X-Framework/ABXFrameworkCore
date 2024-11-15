enableSIDistance(true);

print(km);
let myDist = 2 * km;
print(myDist);
let addDistance = m * 100;
print(addDistance);
let newDistance = myDist + addDistance;
print(newDistance);

Assertions.assertEquals("2.1km",newDistance.to(km).toString());
Assertions.assertEquals("2100m",newDistance.to(m).toString());
Assertions.assertEquals("210000cm",newDistance.to(cm).toString());

print((km*km));
Assertions.assertEquals("1km^2",(km*km).toString());

print((20*m)*(30*m));
Assertions.assertEquals("600m^2",((20*m)*(30*m)).toString());


var m2 = (100*cm)*(1*m);
print(m2.to(m));
Assertions.assertEquals("10000cm^2",m2.to(cm).toString());
Assertions.assertEquals("1m^2",m2.to(m).toString());


enableSITime(true);
var speed = (newDistance/s)
print(speed.to(km/s))
Assertions.assertEquals("2.1km/s",speed.to(km/s).toString());

var dist = speed*ms;
print(dist.to(m))
Assertions.assertEquals("2.1m",dist.to(m).toString());

Assertions.assertEquals(100*m+899*m+99*cm+10*mm,km)