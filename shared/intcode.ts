import R from "ramda";
import { parseIntBaseTen } from "../utils";

export function parseProgram(stringProgram: string): Program {
  return stringProgram.split(",").map(parseIntBaseTen);
}

type InstructionExecutor = (
  inputs: number[],
  args: { inputs: Inputs }
) => {
  result?: number;
  outputs?: Outputs;
  cursor?: number;
  inputs?: number[];
  pause?: boolean;
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
  function step(state: State): State | null {
    const { program, cursor, inputs, outputs } = state;
    const opCode = new OpCode(program[cursor]);
    const code = opCode.code;

    if (code === 99) return null;

    const instruction = instructions.find(R.propEq("opCode", code));

    if (!instruction) {
      throw new Error(`unknown opCode ${code}`);
    }

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
    let nextInputs = inputs;

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

    if (instructionResult.inputs !== undefined) {
      nextInputs = instructionResult.inputs;
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
    };
  }

  function _intCode(state: State): State {
    const result = step(state);

    if (result) {
      return result.paused ? result : _intCode(result);
    } else {
      return state;
    }
  }

  return function intCode({
    program,
    cursor = 0,
    inputs = [],
    outputs = [],
    paused = false,
  }: State): State {
    return _intCode({
      program: R.clone(program),
      cursor,
      inputs,
      outputs,
      paused,
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

export default factory(
  Add,
  Multiply,
  Input,
  Output,
  JumpIfTrue,
  JumpIfFalse,
  LessThan,
  Equals
);
