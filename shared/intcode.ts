import R from "ramda";
import { parseIntBaseTen } from "../utils";

export function parseProgram(stringProgram: string): Program {
  return stringProgram.split(",").map(parseIntBaseTen);
}

type InstructionExecutor = (
  inputs: number[],
  args: State
) => {
  result?: number;
  outputs?: Outputs;
  cursor?: number;
  inputs?: number[];
  pause?: boolean;
  relativeBase?: number;
};
export type Instruction = {
  opCode: number;
  arity: number;
  execute: InstructionExecutor;
};

export type Program = number[];
type Outputs = number[];
type Inputs = number[];
type Computer = (state: Partial<State>) => State;

export type State = {
  program: Program;
  cursor: number;
  inputs: Inputs;
  outputs: Outputs;
  paused: boolean;
  relativeBase: number;
};

enum ParameterMode {
  Position,
  Immediate,
  Relative,
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

  parameterMode(
    argumentNumber: number,
    options: GetArgumentOptions
  ): ParameterMode {
    const parameterString = this.string[this.maxLength - 3 - argumentNumber];
    const map = options.isWrite
      ? {
          0: ParameterMode.Immediate,
          1: ParameterMode.Immediate,
          2: ParameterMode.Relative,
        }
      : {
          0: ParameterMode.Position,
          1: ParameterMode.Immediate,
          2: ParameterMode.Relative,
        };

    const mode = map[parameterString];
    if (mode !== undefined) return mode;

    throw new Error(`Can't find parameter mode for ${parameterString}`);
  }
}

type GetArgumentOptions = {
  isWrite: boolean;
};

export function factory(...instructions: Instruction[]): Computer {
  function step(state: State): State | null {
    const { program, cursor, inputs, outputs } = state;
    const opCode = new OpCode(program[cursor]);
    const code = opCode.code;

    if (code === 99) return null;

    const instruction = instructions.find(R.propEq("opCode", code));

    if (!instruction) {
      throw new Error(`unknown opCode ${code}`);
    }

    function getArgument(
      argumentIndex: number,
      options: GetArgumentOptions = { isWrite: false }
    ): number {
      const mode = opCode.parameterMode(argumentIndex, options);
      const immediateValue = program[cursor + 1 + argumentIndex];

      switch (mode) {
        case ParameterMode.Position:
          return program[immediateValue] || 0;
        case ParameterMode.Immediate:
          return immediateValue;
        case ParameterMode.Relative:
          return (
            (options.isWrite
              ? state.relativeBase + immediateValue
              : program[state.relativeBase + immediateValue]) || 0
          );
        default:
          throw new Error(`Don't know parameter mode ${mode}`);
      }
    }

    const args = R.map(getArgument, R.range(0, instruction.arity));

    const instructionResult = instruction.execute(args, state);

    let nextCursor = cursor + instruction.arity + 1; // plus opCode
    let nextInputs = inputs;
    let nextRelativeBase = state.relativeBase;

    if (instructionResult.result !== undefined) {
      const location = getArgument(instruction.arity, {
        isWrite: true,
      });

      program[location] = instructionResult.result;

      nextCursor++;
    }

    if (instructionResult.outputs !== undefined) {
      outputs.push(...instructionResult.outputs);
    }

    if (instructionResult.cursor !== undefined) {
      nextCursor = instructionResult.cursor;
    }

    if (instructionResult.inputs !== undefined) {
      nextInputs = instructionResult.inputs;
    }

    if (instructionResult.relativeBase !== undefined) {
      nextRelativeBase = instructionResult.relativeBase;
    }

    if (instructionResult.pause) {
      return { ...state, paused: true };
    }

    return {
      cursor: nextCursor,
      program,
      inputs: nextInputs,
      outputs,
      paused: false,
      relativeBase: nextRelativeBase,
    };
  }

  function _intCode(state: State): State {
    const lastResult = step(state);
    let result = lastResult;

    do {
      result = result && step(result);

      if (result && result.paused) return result;
    } while (result);

    if (lastResult) {
      return lastResult;
    } else {
      throw new Error("no state to return");
    }
  }

  return function intCode({
    program,
    cursor = 0,
    inputs = [],
    outputs = [],
    paused = false,
    relativeBase = 0,
  }: State): State {
    return _intCode({
      program: R.clone(program),
      cursor,
      inputs,
      outputs,
      paused,
      relativeBase,
    });
  };
}

const computeResult: (
  computer: (inputs: number[]) => number
) => InstructionExecutor = computer => inputs => ({ result: computer(inputs) });

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

export const Input: Instruction = {
  opCode: 3,
  arity: 0,
  execute: (_, { inputs }) =>
    inputs.length > 0
      ? { result: inputs[0], inputs: inputs.slice(1) }
      : { pause: true },
};

export const Output: Instruction = {
  opCode: 4,
  arity: 1,
  execute: args => ({ outputs: args }),
};

export const JumpIfTrue: Instruction = {
  opCode: 5,
  arity: 2,
  execute: ([condition, location]) =>
    condition === 0 ? {} : { cursor: location },
};

export const JumpIfFalse: Instruction = {
  opCode: 6,
  arity: 2,
  execute: ([condition, location]) =>
    condition === 0 ? { cursor: location } : {},
};

export const LessThan: Instruction = {
  opCode: 7,
  arity: 2,
  execute: ([first, second]) => ({ result: first < second ? 1 : 0 }),
};

export const Equals: Instruction = {
  opCode: 8,
  arity: 2,
  execute: ([first, second]) => ({ result: first === second ? 1 : 0 }),
};

export const builtInInstructions = [
  Add,
  Multiply,
  Input,
  Output,
  JumpIfTrue,
  JumpIfFalse,
  LessThan,
  Equals,
];

export default factory(...builtInInstructions);
