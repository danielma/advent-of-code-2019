/*
The wires twist and turn, but the two wires occasionally cross paths. To fix the circuit, you need to find the intersection point closest to the central port. Because the wires are on a grid, use the Manhattan distance for this measurement. While the wires do technically cross right at the central port where they both start, this point does not count, nor does a wire count as crossing with itself.

For example, if the first wire's path is R8,U5,L5,D3, then starting from the central port (o), it goes right 8, up 5, left 5, and finally down 3:

...........
...........
...........
....+----+.
....|....|.
....|....|.
....|....|.
.........|.
.o-------+.
...........
Then, if the second wire's path is U7,R6,D4,L4, it goes up 7, right 6, down 4, and left 4:

...........
.+-----+...
.|.....|...
.|..+--X-+.
.|..|..|.|.
.|.-X--+.|.
.|..|....|.
.|.......|.
.o-------+.
...........
These wires cross at two locations (marked X), but the lower-left one is closer to the central port: its distance is 3 + 3 = 6.

Here are a few more examples:

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = distance 159
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = distance 135
What is the Manhattan distance from the central port to the closest intersection?
*/

import R from "ramda";
import { parseIntBaseTen } from "../utils";

enum Direction {
  U = "U",
  D = "D",
  R = "R",
  L = "L",
}
type Movement = { direction: Direction; distance: number };
type WirePath = Movement[];
type Coordinate = { x: number; y: number };
type ReversedCoordinateMap = { [key: string]: true };

const entryCoordinate: Coordinate = { x: 0, y: 0 };

const wirePathToCoordinates: (path: WirePath) => Coordinate[] = path => {
  const coordinates = R.mapAccum(
    (lastPosition: Coordinate, movement: Movement) => {
      const list = R.range(1, movement.distance + 1);

      const evolutions: { [key: string]: (i: number) => R.Evolver } = {
        [Direction.D]: i => ({ y: R.add(-i) }),
        [Direction.U]: i => ({ y: R.add(i) }),
        [Direction.L]: i => ({ x: R.add(-i) }),
        [Direction.R]: i => ({ x: R.add(i) }),
      };

      const evolution = evolutions[movement.direction];

      const c: Coordinate[] = R.map(
        (index: number) => R.evolve(evolution(index))(lastPosition),
        list
      );

      return [R.last(c), c];
    },
    entryCoordinate,
    path
  )[1];

  return R.flatten(coordinates);
};

const stringToWirePath: (input: string) => WirePath = R.pipe(
  R.split(","),
  R.map(
    (input): Movement => ({
      direction: Direction[input.substring(0, 1)],
      distance: parseIntBaseTen(input.substring(1)),
    })
  )
);

const walkWireString = R.pipe(stringToWirePath, wirePathToCoordinates);

export function manhattanDistance(coordinates: Coordinate): number {
  return Math.abs(coordinates.x) + Math.abs(coordinates.y);
}

function walkInACircle(
  distance: number,
  cb: (coordinate: Coordinate) => boolean
): boolean {
  if (distance === 0) {
    cb(entryCoordinate);
  } else {
    const position = { x: 0, y: distance };

    for (let i = 1; i <= distance; i++) {
      if (cb(position)) {
        return true;
      }

      position.x++;
      position.y--;
    }

    for (let i = 1; i <= distance; i++) {
      if (cb(position)) {
        return true;
      }

      position.x--;
      position.y--;
    }

    for (let i = 1; i <= distance; i++) {
      if (cb(position)) {
        return true;
      }

      position.x--;
      position.y++;
    }

    for (let i = 1; i <= distance; i++) {
      if (cb(position)) {
        return true;
      }

      position.y++;
      position.x++;
    }

    return false;
  }
}

function wanderTheEarth(cb: (coordinate: Coordinate) => boolean): void {
  let distance = 0;

  while (!walkInACircle(distance, cb)) {
    distance++;
  }
}

function hashCoordinate(coordinate: Coordinate): string {
  return `${coordinate.x},${coordinate.y}`;
}

function hashToCoordinate(hash: string): Coordinate {
  const [x, y] = hash.split(",");

  return { x: parseIntBaseTen(x), y: parseIntBaseTen(y) };
}

const coordinatesToMap: (input: Coordinate[]) => ReversedCoordinateMap = list =>
  R.reduce(
    (acc, coordinate) => {
      acc[hashCoordinate(coordinate)] = true;

      return acc;
    },
    {},
    list
  );

function slightlyBetterClosestCrossing(
  pathA: Coordinate[],
  pathB: Coordinate[]
): Coordinate {
  const mapA = coordinatesToMap(pathA);
  const mapB = coordinatesToMap(pathB);

  let coordinate: Coordinate;

  wanderTheEarth(position => {
    const hash = hashCoordinate(position);

    if (mapA[hash] && mapB[hash]) {
      coordinate = hashToCoordinate(hash);

      return true;
    }

    return false;
  });

  if (coordinate) {
    return coordinate;
  }

  throw new Error("Paths don't cross!");
}

function naiveClosestCrossing(
  pathA: Coordinate[],
  pathB: Coordinate[]
): Coordinate {
  const sortedA = R.sortBy(manhattanDistance, pathA);
  const sortedB = R.sortBy(manhattanDistance, pathB);

  for (let iA = 0; iA < sortedA.length; iA++) {
    const coordinateA = sortedA[iA];
    for (let iB = 0; iB < sortedB.length; iB++) {
      const coordinateB = sortedB[iB];

      if (R.equals(coordinateA, coordinateB)) {
        return coordinateA;
      }
    }
  }

  throw new Error("Paths don't cross!");
}

export function closestCrossing(wireA: string, wireB: string): Coordinate {
  const pathA = walkWireString(wireA);
  const pathB = walkWireString(wireB);

  return slightlyBetterClosestCrossing(pathA, pathB);
}
