import test from "ava";
import { closestCrossing, manhattanDistance } from "./solution";

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
