/*
You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.

However, they do remember a few key facts about the password:

It is a six-digit number.
The value is within the range given in your puzzle input.
Two adjacent digits are the same (like 22 in 122345).
Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
Other than the range rule, the following are true:

111111 meets these criteria (double 11, never decreases).
223450 does not meet these criteria (decreasing pair of digits 50).
123789 does not meet these criteria (no double).
How many different passwords within the range given in your puzzle input meet these criteria?

Your puzzle input is 147981-691423.
*/

import R from "ramda";
import { parseIntBaseTen } from "../utils";

const isSixDigits = R.pipe(R.length, R.equals(6));

const hasTwoAdjacentMatchingDigits = R.reduce(
  (acc: number | boolean, digit: number) =>
    acc === true ? true : digit === acc ? true : digit,
  false
);

const digitsNeverDecrease = R.reduce(
  (lastDigit: number | boolean, digit: number) =>
    lastDigit !== false && lastDigit <= digit && digit,
  0
);

export const stringToDigits = R.pipe(R.split(""), R.map(parseIntBaseTen));

export function isPasswordValid(digits: number[]): boolean {
  return (
    isSixDigits(digits) === true &&
    hasTwoAdjacentMatchingDigits(digits) === true &&
    digitsNeverDecrease(digits) !== false
  );
}

/*
An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.

Given this additional criterion, but still ignoring the range rule, the following are now true:

112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).
How many different passwords within the range given in your puzzle input meet all of the criteria?

Your puzzle input is still 147981-691423.
*/

function hasTwoIsolatedAdjacentMatchingDigits(digits: number[]): boolean {
  for (let i = 0; i < digits.length; i++) {
    const twoDigitsAgo = digits[i - 2];
    const lastDigit = digits[i - 1];
    const digit = digits[i];
    const nextDigit = digits[i + 1];

    if (digit === lastDigit && digit !== twoDigitsAgo && digit !== nextDigit) {
      return true;
    }
  }

  return false;
}

export function isPasswordValidPartTwo(input: string): boolean {
  const digits = stringToDigits(input);

  return (
    isSixDigits(digits) &&
    hasTwoIsolatedAdjacentMatchingDigits(digits) &&
    digitsNeverDecrease(digits) !== false
  );
}
