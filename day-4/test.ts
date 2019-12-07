import test from "ava";
import { isPasswordValid, stringToDigits } from "./solution";
import R from "ramda";

test("this is a valid password", t => {
  t.is(isPasswordValid(stringToDigits("111111")), true);
});

test("0s is a valid password", t => {
  t.is(isPasswordValid(stringToDigits("000000")), true);
});

test("does not allow decrease in digits", t => {
  t.is(isPasswordValid(stringToDigits("223450")), false);
});

test("must have repepating digits", t => {
  t.is(isPasswordValid(stringToDigits("123789")), false);
});

test("147999", t => {
  t.is(isPasswordValid(stringToDigits("147999")), true);
});

test.skip("the real test", t => {
  const passwords: number[][] = R.map(
    R.pipe(R.toString, stringToDigits),
    R.range(147981, 691424)
  );

  const counts: { [key: string]: number } = R.countBy(
    R.pipe(isPasswordValid, (b: boolean) => (b ? "valid" : "invalid"))
  )(passwords);

  t.log(counts.valid);

  t.is(1, 1);
});
