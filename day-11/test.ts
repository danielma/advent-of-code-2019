import test from "ava";
import { readFileSync } from "fs";
import { robotPainter, actuallyPaint } from "./solution";

test.skip("robot painter", t => {
  const input = readFileSync(`${__dirname}/input`).toString();

  const robotState = robotPainter(input);

  t.log(actuallyPaint(input));

  t.is(Object.keys(robotState.paintedSpaces).length, 2016);
});
