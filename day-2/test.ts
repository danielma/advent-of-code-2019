import test from "ava";
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
