import R from "ramda";

export type Instruction = {
  opCode: string;
  arity: number;
  execute: (inputs: number[]) => number;
};

export type Program = number[];
type Outputs = number[];
type Inputs = number[];
type ComputerResult = { program: Program; outputs: Outputs };
type Computer = (program: Program, inputs?: Inputs) => ComputerResult;

type State = {
  program: Program;
  cursor: number;
};

const getOpCode = R.pipe(R.toString, s => s.padStart(5, "0"), R.takeLast(2));

export function factory(...instructions: Instruction[]): Computer {
  function step({ program, cursor }: State): State | null {
    const opCode = getOpCode(program[cursor]);

    if (opCode === "99") return null;

    const instruction = instructions.find(
      R.pipe(R.prop("opCode"), R.equals(opCode))
    );

    if (instruction) {
      const args = R.map(
        i => program[program[cursor + i]],
        R.range(1, 1 + instruction.arity)
      );
      const location = program[cursor + 1 + instruction.arity];

      program[location] = instruction.execute(args);

      return {
        cursor: cursor + instruction.arity + 2,
        program,
      };
    } else {
      return null;
    }
  }

  function _intCode(state: State): Program {
    const result = step(state);

    if (result) {
      return _intCode(result);
    } else {
      return state.program;
    }
  }

  return function intCode(
    program: Program,
    inputs: Inputs = []
  ): ComputerResult {
    return { program: _intCode({ program, cursor: 0 }), outputs: [] };
  };
}

export const Add: Instruction = {
  opCode: "01",
  arity: 2,
  execute: R.sum,
};

export const Multiply: Instruction = {
  opCode: "02",
  arity: 2,
  execute: R.reduce((acc, n) => acc * n, 1),
};
