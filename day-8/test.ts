import test from "ava";
import { dataToLayers } from "./solution";
import { readFileSync } from "fs";
import R from "ramda";

test("initial test", t => {
  const layers = dataToLayers("123456789012", { width: 3, height: 2 });

  t.deepEqual(layers, [
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9, 0, 1, 2],
  ]);
});

test("real input", t => {
  const layers = dataToLayers(readFileSync(`${__dirname}/input`).toString(), {
    width: 25,
    height: 6,
  });

  // To make sure the image wasn't corrupted during transmission,
  // the Elves would like you to find the layer that contains the
  // fewest 0 digits.
  // On that layer, what is the number of 1 digits multiplied by
  // the number of 2 digits?
  const zeroDigitCountsToIndex = layers.reduce((obj, layer, index) => {
    const count = layer.filter(R.equals(0)).length;
    obj[count] = index;

    return obj;
  }, {});

  let rowWithLeastZeros: number[] = [];

  for (let i = 0; i < layers.length; i++) {
    if (zeroDigitCountsToIndex[i] !== undefined) {
      rowWithLeastZeros = layers[zeroDigitCountsToIndex[i]];

      break;
    }
  }

  const numberOfOnes = rowWithLeastZeros.filter(R.equals(1)).length;
  const numberOfTwos = rowWithLeastZeros.filter(R.equals(2)).length;

  t.is(2210, numberOfOnes * numberOfTwos);
});
