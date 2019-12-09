import test from "ava";
import { intCode } from "./solution";
import { parseProgram } from "../shared/intcode";
import { readFileSync } from "fs";

test("quine", t => {
  const program = parseProgram(
    "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99"
  );

  const result = intCode({ program });

  t.deepEqual(result.outputs, program);
});

test("16 digit number", t => {
  const program = parseProgram("1102,34915192,34915192,7,4,7,99,0");

  const { outputs } = intCode({ program });

  t.is(outputs.length, 1);
  t.is(outputs[0].toString().length, 16);
});

test("outputting its own property", t => {
  const program = parseProgram("104,1125899906842624,99");

  const { outputs } = intCode({ program });

  t.is(outputs.length, 1);
  t.is(outputs[0], 1125899906842624);
});

test.skip("a super basic 203 test", t => {
  const program = parseProgram("109,3,203,4,4,7,99,7");

  const result = intCode({ program, inputs: [100] });

  t.log(result);
  t.deepEqual(result.outputs, [100]);
});

test("real input (test mode)", t => {
  const program = parseProgram(readFileSync(`${__dirname}/input`).toString());

  const result = intCode({ program, inputs: [1] });

  t.deepEqual(result.outputs, [3063082071]);
});

test("real input (live mode)", t => {
  const program = parseProgram(readFileSync(`${__dirname}/input`).toString());

  const result = intCode({ program, inputs: [2] });

  t.deepEqual(result.outputs, [81348]);
});
