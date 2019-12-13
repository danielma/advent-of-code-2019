import test from "ava";
import { readFileSync } from "fs";
import { robotPainter } from "./solution";

test("robot painter", t => {
  const input = readFileSync(`${__dirname}/input`).toString();

  const robotState = robotPainter(input);

  t.is(Object.keys(robotState.paintedSpaces).length, 2016);
});
