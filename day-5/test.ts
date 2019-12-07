import test from "ava";
import { intCode } from "./solution";
import { readFileSync } from "fs";
import { parseProgram } from "../shared/intcode";

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

test("with real input", t => {
  const input = parseProgram(readFileSync(`${__dirname}/input`).toString());

  const { outputs } = intCode(input, [1]);

  t.deepEqual(outputs, [0, 0, 0, 0, 0, 0, 0, 0, 0, 7157989]);
});

test("position mode: is the input 8?", t => {
  const program = parseProgram("3,9,8,9,10,9,4,9,99,-1,8");

  t.deepEqual(intCode(program, [7]).outputs, [0]);
  t.deepEqual(intCode(program, [8]).outputs, [1]);
  t.deepEqual(intCode(program, [9]).outputs, [0]);
});

test("position mode: is the input less than 8?", t => {
  const program = parseProgram("3,9,7,9,10,9,4,9,99,-1,8");

  t.deepEqual(intCode(program, [7]).outputs, [1]);
  t.deepEqual(intCode(program, [8]).outputs, [0]);
  t.deepEqual(intCode(program, [9]).outputs, [0]);
});

test("immediate mode: is the input 8?", t => {
  const program = parseProgram("3,3,1108,-1,8,3,4,3,99");

  t.deepEqual(intCode(program, [7]).outputs, [0]);
  t.deepEqual(intCode(program, [8]).outputs, [1]);
  t.deepEqual(intCode(program, [9]).outputs, [0]);
});

test("immediate mode: is the input less than 8?", t => {
  const program = parseProgram("3,3,1107,-1,8,3,4,3,99");

  t.deepEqual(intCode(program, [7]).outputs, [1]);
  t.deepEqual(intCode(program, [8]).outputs, [0]);
  t.deepEqual(intCode(program, [9]).outputs, [0]);
});

test("position mode: zero for zero", t => {
  const program = parseProgram("3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9");

  t.deepEqual(intCode(program, [-1]).outputs, [1]);
  t.deepEqual(intCode(program, [0]).outputs, [0]);
  t.deepEqual(intCode(program, [1]).outputs, [1]);
});

test("immediate mode: zero for zero", t => {
  const program = parseProgram("3,3,1105,-1,9,1101,0,0,12,4,12,99,1");

  t.deepEqual(intCode(program, [-1]).outputs, [1]);
  t.deepEqual(intCode(program, [0]).outputs, [0]);
  t.deepEqual(intCode(program, [1]).outputs, [1]);
});

test("999 if value blow 8, 1000 if value === 8, 1001 if value > 8", t => {
  const program = parseProgram(
    "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99"
  );

  t.deepEqual(intCode(program, [7]).outputs, [999]);
  t.deepEqual(intCode(program, [8]).outputs, [1000]);
  t.deepEqual(intCode(program, [9]).outputs, [1001]);
});

test("part 2, with real input", t => {
  const input = parseProgram(readFileSync(`${__dirname}/input`).toString());

  const { outputs } = intCode(input, [5]);

  t.deepEqual(outputs, [7873292]);
});
