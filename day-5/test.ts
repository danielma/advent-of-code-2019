import test from "ava";
import { intCode } from "./solution";

test("program with inputs and outputs", t => {
  const { program, outputs } = intCode([3, 0, 4, 0, 99], [50]);

  t.deepEqual(program, [50, 0, 4, 0, 99]);
  t.deepEqual(outputs, [50]);
});

test("program with more outputs", t => {
  const { program, outputs } = intCode([4, 1, 4, 0, 99]);

  t.deepEqual(program, [4, 1, 4, 0, 99]);
  t.deepEqual(outputs, [1, 4]);
});
