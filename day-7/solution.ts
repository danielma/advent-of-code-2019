import intCode, { Program } from "../shared/intcode";
import R from "ramda";

export function amplify(program: Program, phaseSettings: number[]): number {
  return R.reduce(
    (result, phaseSetting) =>
      intCode(program, [phaseSetting, result]).outputs[0],
    0,
    phaseSettings
  );
}

// https://gist.github.com/CrossEye/f7c2f77f7db7a94af209
const permutations = (tokens: number[], subperms = [[]]) =>
  R.isEmpty(tokens)
    ? subperms
    : R.addIndex(R.chain)(
        (token, idx) =>
          permutations(
            R.remove(idx, 1, tokens),
            R.map(R.append(token), subperms)
          ),
        tokens
      );

const everyPossiblePhaser: number[][] = permutations([0, 1, 2, 3, 4]);

export function findHighestCombo(
  program: Program
): { phaseSettings: number[]; thrust: number } {
  let phaseSettings = [];

  const highestThrust = everyPossiblePhaser.reduce((previous, current) => {
    const thrust = amplify(program, current);

    if (thrust > previous) {
      phaseSettings = current;
      return thrust;
    } else {
      return previous;
    }
  }, 0);

  return { phaseSettings, thrust: highestThrust };
}
