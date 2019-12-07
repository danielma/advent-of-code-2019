/*
The Thermal Environment Supervision Terminal (TEST) starts by running a diagnostic program (your puzzle input). The TEST diagnostic program will run on your existing Intcode computer after a few modifications:

First, you'll need to add two new instructions:

Opcode 3 takes a single integer as input and saves it to the position given by its only parameter. For example, the instruction 3,50 would take an input value and store it at address 50.
Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 would output the value at address 50.
Programs that use these instructions will come with documentation that explains what should be connected to the input and output. The program 3,0,4,0,99 outputs whatever it gets as input, then halts.
*/

import { factory, Add, Multiply } from "../shared/intcode";

export const intCode = factory(
  Add,
  Multiply,
  {
    opCode: 3, // Input
    arity: 0,
    execute: (_, { inputs }) => ({ result: inputs[0] }),
  },
  {
    opCode: 4, // Output
    arity: 1,
    execute: args => ({ outputs: args }),
  }
);
