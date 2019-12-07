import test from "ava";
import { readFileSync } from "fs";
import { parseIntBaseTen } from "../utils";
import { intCode } from "./solution";

test("1", t => {
  t.deepEqual(intCode([1, 0, 0, 0, 99]), [2, 0, 0, 0, 99]);
});

test("2", t => {
  t.deepEqual(intCode([2, 3, 0, 3, 99]), [2, 3, 0, 6, 99]);
});

test("3", t => {
  t.deepEqual(intCode([2, 4, 4, 5, 99, 0]), [2, 4, 4, 5, 99, 9801]);
});

test("4", t => {
  t.deepEqual(intCode([1, 1, 1, 4, 99, 5, 6, 0, 99]), [
    30,
    1,
    1,
    4,
    2,
    5,
    6,
    0,
    99,
  ]);
});

test("basic test", t => {
  t.deepEqual(intCode([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]), [
    3500,
    9,
    10,
    70,
    2,
    3,
    11,
    0,
    99,
    30,
    40,
    50,
  ]);
});

test.skip("real input", t => {
  /*
  Once you have a working computer, the first step is to restore the gravity assist program (your puzzle input) to the "1202 program alarm" state it had just before the last computer caught fire. To do this, before running the program, replace position 1 with the value 12 and replace position 2 with the value 2. What value is left at position 0 after the program halts?
  */

  const input = readFileSync(`${__dirname}/input`)
    .toString()
    .split(",")
    .map(parseIntBaseTen);

  input[1] = 12;
  input[2] = 2;

  const result = intCode(input);

  t.log(result[0]);

  t.is(1, 1);
});

test.skip("find a thing that works", t => {
  const input = readFileSync(`${__dirname}/input`)
    .toString()
    .split(",")
    .map(parseIntBaseTen);

  const initial = input[0];
  const restInput = input.slice(3);

  const theOutputWeWant = 19690720;

  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      const i = [initial, x, y, ...restInput];
      const result = intCode(i);

      if (result[0] === theOutputWeWant) {
        t.log(`x = ${x} | y = ${y} | answer = ${100 * x + y}`);
        t.is(1, 1);

        return;
      }
    }
  }
});
