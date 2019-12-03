import test from "ava";
import { readFileSync } from "fs";
import R from "ramda";
import { fancyGetFuel, getFuel } from "./solution";

test("fuel for 12", t => {
  t.is(getFuel(12), 2);
});

test("fuel for 14", t => {
  t.is(getFuel(14), 2);
});

test("fuel for 1969", t => {
  t.is(getFuel(1969), 654);
});

test("fuel for 100756", t => {
  t.is(getFuel(100756), 33583);
});

test("fancyFuel for 14", t => {
  t.is(fancyGetFuel(14), 2);
});

test("fancyFuel for 1969", t => {
  t.is(fancyGetFuel(1969), 966);
});

test("fancyGetFuel for 100756", t => {
  t.is(fancyGetFuel(100756), 50346);
});

test("output", t => {
  const input = readFileSync(`${__dirname}/input`).toString();
  t.log(
    R.sum(
      input
        .trim()
        .split("\n")
        .map(i => parseInt(i, 10))
        .map(i => fancyGetFuel(i))
    )
  );
});
