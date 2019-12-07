import R from "ramda";

type Instruction = {
  opCode: number;
  arity: number;
  execute: (inputs: number[]) => number;
};

type Program = number[];
type Computer = (program: Program) => Program;

type State = {
  program: Program;
  cursor: number;
};

export function factory(...instructions: Instruction[]): Computer {
  function step({ program, cursor }: State): State | null {
    const opCode = program[cursor];

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

  return function intCode(program: Program): Program {
    return _intCode({ program, cursor: 0 });
  };
}

export const Add: Instruction = {
  opCode: 1,
  arity: 2,
  execute: R.sum,
};

export const Multiply: Instruction = {
  opCode: 2,
  arity: 2,
  execute: R.reduce((acc, n) => acc * n, 1),
};
