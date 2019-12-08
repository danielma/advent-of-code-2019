import test from "ava";
import { parseProgram } from "../shared/intcode";
import { findHighestCombo } from "./solution";
import { readFileSync } from "fs";

test("initial program", t => {
  const program = parseProgram(
    "3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0"
  );

  const { phaseSettings, thrust } = findHighestCombo(program);

  t.is(thrust, 43210);
  t.deepEqual(phaseSettings, [4, 3, 2, 1, 0]);
});

test("second program", t => {
  const program = parseProgram(
    "3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0"
  );

  const { phaseSettings, thrust } = findHighestCombo(program);

  t.is(thrust, 54321);
  t.deepEqual(phaseSettings, [0, 1, 2, 3, 4]);
});

test("third program", t => {
  const program = parseProgram(
    "3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0"
  );

  const { phaseSettings, thrust } = findHighestCombo(program);

  t.is(thrust, 65210);
  t.deepEqual(phaseSettings, [1, 0, 4, 3, 2]);
});

test.skip("the real program", t => {
  const program = parseProgram(readFileSync(`${__dirname}/input`).toString());

  const { phaseSettings, thrust } = findHighestCombo(program);

  t.is(thrust, 77500);
  t.deepEqual(phaseSettings, [0, 3, 2, 4, 1]);
});
