import test from "ava";
import { countOrbits } from "./solution";
import { readFileSync } from "fs";

test("stupid basic orbit map", t => {
  const map = `COM)A
A)B`.trim();

  t.is(countOrbits(map), 3);
  // const { direct, indirect } = countOrbits(map);

  // t.is(direct, 2);
  // t.is(indirect, 1);
});

test("basic orbit map", t => {
  const map = `
COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
`.trim();

  // const { direct, indirect } = countOrbits(map);

  // t.is(direct + indirect, 42);
  t.is(countOrbits(map), 42);
});

test("real input", t => {
  const map = readFileSync(`${__dirname}/input`).toString();

  t.log(countOrbits(map));
  t.is(1, 2);
});
