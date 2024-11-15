x = "\n"
a =  Set(1, 2, 3);

print(`a = ${a}`)
// This is a line comment print(`a = ${a}`)
b =  Set(1, 2, 5);
print(`b = ${b}`)
// This is a line comment /*

Assertions.assertEquals/*`${a}`*/ ("ab"/*This is a comment*/,`${"a"}${'b'}`)

aUb=  Set(1, 2,3, 5) /*` //${a}`*/;
// This is a line comment "
print(`a ∪  b. Expected ${aUb}. Actual ${a ∪ b}`);
Assertions.assertTrue(aUb == (a ∪ b));

// This is a line comment '
aInterB=  Set(1, 2);
print(`a ∩ b. Expected ${aInterB}. Actual ${a ∩ /* more weird comments ***** */b}`);
Assertions.assertTrue(aInterB ==  (a ∩ b));

// This is a line comment ${ `
aLessB=  Set(3);
print(`a - b. Expected ${aLessB}. Actual ${a - b}`);
Assertions.assertTrue(aLessB ==  (a - b));

print(`a ⊆ b. Expecting false got ${a ⊆ b}`);
Assertions.assertFalse(a ⊆ b);

c =  Set(1);
print(`c = ${c}`)

print(`c ⊆ a. Expecting true got ${c ⊆ a}`);
Assertions.assertTrue(c ⊆ a);

print(`c ⊇ a. Expecting false got ${c ⊇ a}`);
Assertions.assertFalse(c ⊇ a);

print(`a ⊇ c. Expecting true got ${a ⊇ c}`);
Assertions.assertTrue(a ⊇ c);

print(`a ⊇ a. Expecting true got ${a ⊇ a}`);
Assertions.assertTrue(a ⊇ a);

print(`a ⊆ a. Expecting true got ${a ⊆ a}`);
Assertions.assertTrue(a ⊆ a);

print(`1000 ∈ c. Expecting false got ${1000 ∈ c}`);
Assertions.assertFalse(1000 ∈ c);

print(`1 ∈ c. Expecting true got ${1 ∈ c}`);
Assertions.assertTrue(1 ∈ c);

print(`1 ∈  c. Expecting true got ${1 ∈ c}`);
Assertions.assertTrue(1 ∈ c);


print(`1000 ∉ c. Expecting true got ${1000 ∉ c}`);
Assertions.assertTrue(1000 ∉ c);

print(`1 ∉ c. Expecting false got ${1 ∉ c}`);
Assertions.assertFalse(1 ∉ c);

print(`1 ∈  c. Expecting false got ${1 ∉ c}`);
Assertions.assertFalse(1 ∉ c);

