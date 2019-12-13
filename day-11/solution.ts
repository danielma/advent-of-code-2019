import intCode, { parseProgram } from "../shared/intcode";
import { parseIntBaseTen } from "../utils";
import R from "ramda";

type Coordinate = [number, number];

type Canvas = {};

enum Direction {
  North,
  East,
  South,
  West,
}

enum Color {
  Black,
  White,
}

enum Turn {
  Left,
  Right,
}

type RobotState = {
  heading: Direction;
  location: Coordinate;
  paintedSpaces: { [key: string]: Color };
};

function nextHeading(currentHeading: Direction, turn: Turn): Direction {
  // console.log({ currentHeading, turn });
  const heading = currentHeading + (turn === Turn.Left ? -1 : 1);
  const maxDirection = Object.keys(Direction).length / 2 - 1;

  if (heading > maxDirection) {
    return 0;
  } else if (heading < 0) {
    return maxDirection;
  } else {
    return heading;
  }
}

function moveLocation(location: Coordinate, heading: Direction): Coordinate {
  switch (heading) {
    case Direction.East:
      return [location[0] + 1, location[1]];
    case Direction.South:
      return [location[0], location[1] + 1];
    case Direction.West:
      return [location[0] - 1, location[1]];
    case Direction.North:
      return [location[0], location[1] - 1];
    default:
      throw new Error(`Unknown heading ${heading}`);
  }
}

function serializeLocation(location: Coordinate): string {
  return `${location[0]},${location[1]}`;
}

const defaultColor = Color.Black;

export function robotPainter(program: string): RobotState {
  const robotState: RobotState = {
    heading: Direction.North,
    location: [0, 0],
    paintedSpaces: {},
  };

  let result = intCode({ program: parseProgram(program) });

  do {
    const currentColor =
      robotState.paintedSpaces[serializeLocation(robotState.location)] ||
      defaultColor;

    // console.log("Add input", currentColor);
    result = intCode({ ...result, inputs: [currentColor] });

    const [paintColor, turn] = result.outputs.slice(-2);

    robotState.paintedSpaces[
      serializeLocation(robotState.location)
    ] = paintColor;
    // console.log("paint", robotState.location, paintColor);
    robotState.heading = nextHeading(robotState.heading, turn);
    // console.log("nextHeading", robotState.heading);
    robotState.location = moveLocation(robotState.location, robotState.heading);
  } while (result.paused);

  return robotState;
}
