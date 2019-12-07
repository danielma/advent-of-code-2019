/*
The Thermal Environment Supervision Terminal (TEST) starts by running a diagnostic program (your puzzle input). The TEST diagnostic program will run on your existing Intcode computer after a few modifications:

First, you'll need to add two new instructions:

Opcode 3 takes a single integer as input and saves it to the position given by its only parameter. For example, the instruction 3,50 would take an input value and store it at address 50.
Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 would output the value at address 50.
Programs that use these instructions will come with documentation that explains what should be connected to the input and output. The program 3,0,4,0,99 outputs whatever it gets as input, then halts.
*/

import { factory, Add, Multiply, Instruction } from "../shared/intcode";

const Input: Instruction = {
  opCode: 3,
  arity: 0,
  execute: (_, { inputs }) => ({ result: inputs[0] }),
};

const Output: Instruction = {
  opCode: 4,
  arity: 1,
  execute: args => ({ outputs: args }),
};

const JumpIfTrue: Instruction = {
  opCode: 5,
  arity: 2,
  execute: ([condition, location]) =>
    condition === 0 ? {} : { cursor: location },
};

const JumpIfFalse: Instruction = {
  opCode: 6,
  arity: 2,
  execute: ([condition, location]) =>
    condition === 0 ? { cursor: location } : {},
};

const LessThan: Instruction = {
  opCode: 7,
  arity: 2,
  execute: ([first, second]) => ({ result: first < second ? 1 : 0 }),
};

const Equals: Instruction = {
  opCode: 8,
  arity: 2,
  execute: ([first, second]) => ({ result: first === second ? 1 : 0 }),
};

export const intCode = factory(
  Add,
  Multiply,
  Input,
  Output,
  JumpIfTrue,
  JumpIfFalse,
  LessThan,
  Equals
);

/*
  Your computer is only missing a few opcodes:

Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
Like all instructions, these instructions need to support parameter modes as described above.

Normally, after an instruction is finished, the instruction pointer increases by the number of values in that instruction. However, if the instruction modifies the instruction pointer, that value is used and the instruction pointer is not automatically increased.
*/
