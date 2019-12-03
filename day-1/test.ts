import test from "ava";
import { getFuel } from "./solution";

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
