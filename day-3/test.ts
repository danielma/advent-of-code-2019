import test from "ava";
import {
  closestCrossing,
  manhattanDistance,
  combinedDistanceToShortestCrossing,
} from "./solution";
import { readFileSync } from "fs";

test("the first test", t => {
  const crossing = closestCrossing("R8,U5,L5,D3", "U7,R6,D4,L4");

  t.is(manhattanDistance(crossing), 6);
});

test("the second test", t => {
  const crossing = closestCrossing(
    "R75,D30,R83,U83,L12,D49,R71,U7,L72",
    "U62,R66,U55,R34,D71,R55,D58,R83"
  );

  t.is(manhattanDistance(crossing), 159);
});

test("the third test", t => {
  const crossing = closestCrossing(
    "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
    "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
  );

  t.is(manhattanDistance(crossing), 135);
});

test.skip("with puzzle input", t => {
  const input = readFileSync(`${__dirname}/input`).toString();

  const [wireA, wireB] = input.split("\n");

  const crossing = closestCrossing(wireA, wireB);

  t.log(manhattanDistance(crossing));

  t.is(1, 1);
});

test("part 2, the first test", t => {
  t.is(combinedDistanceToShortestCrossing("R8,U5,L5,D3", "U7,R6,D4,L4"), 30);
});

test("part 2, the second test", t => {
  t.is(
    combinedDistanceToShortestCrossing(
      "R75,D30,R83,U83,L12,D49,R71,U7,L72",
      "U62,R66,U55,R34,D71,R55,D58,R83"
    ),
    610
  );
});

test("part 2, the third test", t => {
  t.is(
    combinedDistanceToShortestCrossing(
      "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
      "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
    ),
    410
  );
});

test.skip("part 2, with puzzle input", t => {
  const input = readFileSync(`${__dirname}/input`).toString();

  const [wireA, wireB] = input.split("\n");

  const distance = combinedDistanceToShortestCrossing(wireA, wireB);

  t.log(distance);

  t.is(1, 1);
});
