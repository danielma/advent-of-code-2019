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

export function findHighestCombo(
  program: Program,
  uniquePhaserSettings = [0, 1, 2, 3, 4]
): { phaseSettings: number[]; thrust: number } {
  const everyPossiblePhaser: number[][] = permutations(uniquePhaserSettings);

  const [phaseSettings, thrust] = everyPossiblePhaser.reduce(
    ([previousSettings, previousThrust], current) => {
      const thrust = amplify(program, current);

      return thrust > previousThrust
        ? [current, thrust]
        : [previousSettings, previousThrust];
    },
    [[], 0]
  );

  return { phaseSettings, thrust };
}
