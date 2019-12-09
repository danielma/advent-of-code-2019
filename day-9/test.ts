import test from "ava";
import { intCode } from "./solution";
import { parseProgram } from "../shared/intcode";

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
