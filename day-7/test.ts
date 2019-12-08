import test from "ava";
import { parseProgram } from "../shared/intcode";
import { findHighestCombo, amplify } from "./solution";
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

/*
  Here are some example programs:

Max thruster signal 139629729 (from phase setting sequence 9,8,7,6,5):

3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5
Max thruster signal 18216 (from phase setting sequence 9,7,8,5,6):

3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10
*/

test("part 2, initial program", t => {
  const program = parseProgram(
    "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5"
  );

  const { phaseSettings, thrust } = findHighestCombo(program, [5, 6, 7, 8, 9]);

  t.is(thrust, 139629729);
  t.deepEqual(phaseSettings, [9, 8, 7, 6, 5]);
});

test("part 2, second program", t => {
  const program = parseProgram(
    "3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10"
  );

  const { phaseSettings, thrust } = findHighestCombo(program, [5, 6, 7, 8, 9]);

  t.is(thrust, 18216);
  t.deepEqual(phaseSettings, [9, 7, 8, 5, 6]);
});

test.skip("part 2, the real program", t => {
  const program = parseProgram(readFileSync(`${__dirname}/input`).toString());

  const { phaseSettings, thrust } = findHighestCombo(program, [5, 6, 7, 8, 9]);

  t.is(thrust, 22476942);
  t.deepEqual(phaseSettings, [7, 9, 5, 8, 6]);
});
