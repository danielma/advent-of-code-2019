import test from "ava";
import { countOrbits, transfersFrom } from "./solution";
import { readFileSync } from "fs";

test("stupid basic orbit map", t => {
  const map = `COM)A
A)B`.trim();

  t.is(countOrbits(map), 3);
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

  t.is(countOrbits(map), 42);
});

test("real input", t => {
  const map = readFileSync(`${__dirname}/input`).toString();

  t.is(countOrbits(map), 117672);
});

test("part 2, basic test", t => {
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
K)YOU
I)SAN`.trim();

  t.is(transfersFrom("YOU", "SAN", map), 4);
});

test("part 2, real input", t => {
  const map = readFileSync(`${__dirname}/input`).toString();

  t.is(transfersFrom("YOU", "SAN", map), 277);
});
