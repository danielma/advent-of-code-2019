#!/usr/bin/env ts-node

/*
At the first Go / No Go poll, every Elf is Go until the Fuel Counter-Upper. They haven't determined the amount of fuel required yet.

Fuel required to launch a given module is based on its mass. Specifically, to find the fuel required for a module, take its mass, divide by three, round down, and subtract 2.

For example:

For a mass of 12, divide by 3 and round down to get 4, then subtract 2 to get 2.
For a mass of 14, dividing by 3 and rounding down still yields 4, so the fuel required is also 2.
For a mass of 1969, the fuel required is 654.
For a mass of 100756, the fuel required is 33583.
The Fuel Counter-Upper needs to know the total fuel requirement. To find it, individually calculate the fuel needed for the mass of each module (your puzzle input), then add together all the fuel values.

What is the sum of the fuel requirements for all of the modules on your spacecraft?
*/

import R from "ramda";

export function getFuel(mass: number): number {
  return Math.floor(mass / 3) - 2;
}

const inputs = `
122281
124795
58593
133744
67625
109032
50156
80746
130872
79490
126283
146564
73075
130170
139853
92599
96965
58149
94254
89074
52977
148092
92073
136765
144755
142487
54827
135588
91411
51597
70040
68880
117120
137115
72829
100048
65187
131464
95813
146891
128799
94568
67178
94903
67193
127613
115782
85360
129820
50989
63471
106724
145768
55169
77555
82978
87728
69141
95518
82985
83387
83089
64372
127931
99277
58930
99098
95621
147797
64102
118857
71014
84881
147294
72166
71348
149240
117963
89181
144770
102444
99103
72341
56076
128515
51319
147595
98431
141102
148617
84685
111427
82351
57021
63834
113059
119970
87078
120631
124942
`
  .trim()
  .split("\n");

// const total = R.sum(inputs.map(i => getFuel(parseInt(i, 10))));

// console.log(total);

/*
--- Part Two ---
During the second Go / No Go poll, the Elf in charge of the Rocket Equation Double-Checker stops the launch sequence. Apparently, you forgot to include additional fuel for the fuel you just added.

Fuel itself requires fuel just like a module - take its mass, divide by three, round down, and subtract 2. However, that fuel also requires fuel, and that fuel requires fuel, and so on. Any mass that would require negative fuel should instead be treated as if it requires zero fuel; the remaining mass, if any, is instead handled by wishing really hard, which has no mass and is outside the scope of this calculation.

So, for each module mass, calculate its fuel and add it to the total. Then, treat the fuel amount you just calculated as the input mass and repeat the process, continuing until a fuel requirement is zero or negative. For example:

A module of mass 14 requires 2 fuel. This fuel requires no further fuel (2 divided by 3 and rounded down is 0, which would call for a negative fuel), so the total fuel required is still just 2.
At first, a module of mass 1969 requires 654 fuel. Then, this fuel requires 216 more fuel (654 / 3 - 2). 216 then requires 70 more fuel, which requires 21 fuel, which requires 5 fuel, which requires no further fuel. So, the total fuel required for a module of mass 1969 is 654 + 216 + 70 + 21 + 5 = 966.
The fuel required by a module of mass 100756 and its fuel is: 33583 + 11192 + 3728 + 1240 + 411 + 135 + 43 + 12 + 2 = 50346.
What is the sum of the fuel requirements for all of the modules on your spacecraft when also taking into account the mass of the added fuel? (Calculate the fuel requirements for each module separately, then add them all up at the end.)
*/
