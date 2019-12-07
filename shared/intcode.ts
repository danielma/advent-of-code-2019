import R from "ramda";
import { parseIntBaseTen } from "../utils";

type InstructionExecutor = (
  inputs: number[],
  args: { inputs: Inputs }
) => { result?: number; outputs?: Outputs };
export type Instruction = {
  opCode: number;
  arity: number;
  execute: InstructionExecutor;
};

export type Program = number[];
type Outputs = number[];
type Inputs = number[];
type Computer = (program: Program, inputs?: Inputs) => State;

type State = {
  program: Program;
  cursor: number;
  inputs: Inputs;
  outputs: Outputs;
};

const getOpCode = R.pipe(
  R.toString,
  s => s.padStart(5, "0"),
  R.takeLast(2),
  parseIntBaseTen
);

export function factory(...instructions: Instruction[]): Computer {
  function step({ program, cursor, inputs, outputs }: State): State | null {
    const opCode = getOpCode(program[cursor]);

    if (opCode === 99) return null;

    const instruction = instructions.find(
      R.pipe(R.prop("opCode"), R.equals(opCode))
    );

    if (instruction) {
      const args = R.map(
        i => program[program[cursor + i]],
        R.range(1, 1 + instruction.arity)
      );
      const location = program[cursor + 1 + instruction.arity];

      const instructionResult = instruction.execute(args, {
        inputs: inputs,
      });

      if (instructionResult.result !== undefined) {
        program[location] = instructionResult.result;
      }

      if (instructionResult.outputs !== undefined) {
        outputs.push(...instructionResult.outputs);
      }

      return {
        cursor: cursor + instruction.arity + 2,
        program,
        inputs,
        outputs,
      };
    } else {
      return null;
    }
  }

  function _intCode(state: State): State {
    const result = step(state);

    if (result) {
      return _intCode(result);
    } else {
      return state;
    }
  }

  return function intCode(program: Program, inputs: Inputs = []): State {
    return _intCode({ program, cursor: 0, inputs, outputs: [] });
  };
}

const computeResult: (
  computer: (inputs: number[]) => number
) => InstructionExecutor = computer => {
  return inputs => {
    return { result: computer(inputs) };
  };
};
export const Add: Instruction = {
  opCode: 1,
  arity: 2,
  execute: computeResult(R.sum),
};

export const Multiply: Instruction = {
  opCode: 2,
  arity: 2,
  execute: computeResult(R.reduce((acc, n) => acc * n, 1)),
};
