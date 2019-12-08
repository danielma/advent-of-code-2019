import intCode, { Program, State } from "../shared/intcode";
import R from "ramda";

function _amplify(amplifiers: Partial<State>[], thrust = 0, index = 0): number {
  const amplifier = amplifiers[index];
  const inputs = [...amplifier.inputs, thrust];
  const nextState = intCode({
    ...amplifier,
    inputs,
  });

  const nextThrust = R.last(nextState.outputs);
  amplifiers[index] = nextState;

  if (nextState.paused || index < amplifiers.length - 1) {
    return _amplify(
      amplifiers,
      nextThrust,
      index === amplifiers.length - 1 ? 0 : index + 1
    );
  } else {
    return nextThrust;
  }
}

export function amplify(program: Program, phaseSettings: number[]): number {
  const amplifiers = phaseSettings.map(setting => ({
    program,
    inputs: [setting],
  }));

  return _amplify(amplifiers);
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
