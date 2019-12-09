import { factory, builtInInstructions, Instruction } from "../shared/intcode";

/*
The relative base is modified with the relative base offset instruction:

Opcode 9 adjusts the relative base by the value of its only parameter. The relative base increases (or decreases, if the value is negative) by the value of the parameter.
For example, if the relative base is 2000, then after the instruction 109,19, the relative base would be 2019. If the next instruction were 204,-34, then the value at address 1985 would be output.

Your Intcode computer will also need a few other capabilities:

The computer's available memory should be much larger than the initial program. Memory beyond the initial program starts with the value 0 and can be read or written like any other memory. (It is invalid to try to access memory at a negative address, though.)
The computer should have support for large numbers. Some instructions near the beginning of the BOOST program will verify this capability.
Here are some example programs that use these features:
*/

const instructions: Instruction[] = [
  ...builtInInstructions,
  {
    opCode: 9,
    arity: 1,
    execute: ([first], state) => ({ relativeBase: state.relativeBase + first }),
  },
];

export const intCode = factory(...instructions);
