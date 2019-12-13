import intCode, { parseProgram } from "../shared/intcode";
import { parseIntBaseTen } from "../utils";
import R from "ramda";
import colors from "colors/safe";

type Coordinate = [number, number];

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

function deserializeLocation(serialized: string): Coordinate {
  const [x, y] = serialized.split(",").map(parseIntBaseTen);

  return [x, y];
}

export function robotPainter(
  program: string,
  options = { defaultColor: Color.Black }
): RobotState {
  const { defaultColor } = options;
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

    result = intCode({ ...result, inputs: [currentColor] });

    const [paintColor, turn] = result.outputs.slice(-2);

    robotState.paintedSpaces[
      serializeLocation(robotState.location)
    ] = paintColor;
    robotState.heading = nextHeading(robotState.heading, turn);
    robotState.location = moveLocation(robotState.location, robotState.heading);
  } while (result.paused);

  return robotState;
}

const maxList = R.reduce(R.max, -Infinity);
const minList = R.reduce(R.min, Infinity);

export function actuallyPaint(program: string): string {
  const { paintedSpaces } = robotPainter(program, {
    defaultColor: Color.White,
  });

  const paints = Object.keys(paintedSpaces).map(deserializeLocation);

  const minX = minList(paints.map(R.head)) as number;
  const maxX = maxList(paints.map(R.head)) as number;
  const minY = minList(paints.map(R.last)) as number;
  const maxY = maxList(paints.map(R.last)) as number;

  let painting = "";

  for (let y = minY; y < maxY + 1; y++) {
    for (let x = minX; x < maxX + 1; x++) {
      const location: Coordinate = [x, y];

      const serialized = serializeLocation(location);

      if (paintedSpaces[serialized] === Color.White) {
        painting += colors.bgWhite(" ");
      } else {
        painting += colors.bgBlack(" ");
      }
    }

    painting += "\n";
  }

  return painting;
}
