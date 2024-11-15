


var a = im;

Assertions.assertEquals(1,im.mag);
Assertions.assertEquals(1,im.i);
Assertions.assertEquals(Math.PI/2,im.angleRad);


Assertions.assertZero(0,im.r);


var perfect = 3+(4*im);

Assertions.assertEquals(5, perfect.mag);


var perfect = 3*im+4;
Assertions.assertEquals(5, perfect.mag);


Assertions.assertZero(1 + im*im);
Assertions.assertFloatEquals(0,2*im-(im+im));

Assertions.assertFloatEquals(-1 ===((im+im)-(1+2*im)));

print(2*im)
print(im+im)
print(im + im - 2*im);
print((im + im - 2*im));
Assertions.assertTrue(im + im == 2*im);
Assertions.assertFloatEquals(im ,Polar(1,Math.PI/2));

Assertions.assertEquals(im.toString(π),"1∠0.5π (rad)");

print(im.toString(π));