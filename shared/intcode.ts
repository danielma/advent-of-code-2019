import R from "ramda";
import { parseIntBaseTen } from "../utils";

export function parseProgram(stringProgram: string): Program {
  return stringProgram.split(",").map(parseIntBaseTen);
}

type InstructionExecutor = (
  inputs: number[],
  args: { inputs: Inputs }
) => { result?: number; outputs?: Outputs; cursor?: number };
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

enum ParameterMode {
  Position,
  Immediate,
}

class OpCode {
  input: number;
  string: string;
  code: number;

  maxLength = 5;

  constructor(input: number) {
    this.input = input;
    this.string = input.toString().padStart(this.maxLength, "0");
    this.code = R.pipe(R.takeLast(2), parseIntBaseTen)(this.string);
  }

  parameterMode(argumentNumber: number): ParameterMode {
    return this.string[this.maxLength - 3 - argumentNumber] === "0"
      ? ParameterMode.Position
      : ParameterMode.Immediate;
  }
}

export function factory(...instructions: Instruction[]): Computer {
  function step({ program, cursor, inputs, outputs }: State): State | null {
    const opCode = new OpCode(program[cursor]);
    const code = opCode.code;

    if (code === 99) return null;

    const instruction = instructions.find(
      R.pipe(R.prop("opCode"), R.equals(code))
    );

    if (instruction) {
      const args = R.map(argumentIndex => {
        const mode = opCode.parameterMode(argumentIndex);
        const immediateValue = program[cursor + 1 + argumentIndex];

        switch (mode) {
          case ParameterMode.Immediate:
            return immediateValue;
          case ParameterMode.Position:
            return program[immediateValue];
          default:
            throw new Error(`Don't know parameter mode ${mode}`);
        }
      }, R.range(0, instruction.arity));
      const instructionResult = instruction.execute(args, {
        inputs: inputs,
      });

      let nextCursor = cursor + instruction.arity + 1; // plus opCode

      if (instructionResult.result !== undefined) {
        const location = program[cursor + 1 + instruction.arity];

        program[location] = instructionResult.result;

        nextCursor++;
      }

      if (instructionResult.outputs !== undefined) {
        outputs.push(...instructionResult.outputs);
      }

      if (instructionResult.cursor !== undefined) {
        nextCursor = instructionResult.cursor;
      }

      return {
        cursor: nextCursor,
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
    return _intCode({
      program: R.clone(program),
      cursor: 0,
      inputs,
      outputs: [],
    });
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
