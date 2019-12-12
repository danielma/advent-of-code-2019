import R from "ramda";
import colors from "colors/safe";

enum MapObject {
  Asteroid = "#",
  Empty = ".",
}

export type Coordinate = {
  x: number;
  y: number;
};

function isRealCoordinate(coordinate: Coordinate): boolean {
  return (
    Math.round(coordinate.x) === coordinate.x &&
    Math.round(coordinate.y) === coordinate.y
  );
}

export class AsteroidMap {
  height: number;
  width: number;
  objects: MapObject[];
  coordinates: Coordinate[];

  constructor(input: string) {
    const rows = input.split("\n");

    this.height = rows.length;
    this.width = rows[0].length;
    this.objects = rows.join("").split("") as MapObject[];
    this.coordinates = this.objects.map((_, index) => ({
      x: index % this.width,
      y: (index - (index % this.width)) / this.width,
    }));
  }

  at(coordinate: Coordinate): MapObject | null {
    return isRealCoordinate(coordinate)
      ? this.objects[this.coordinateToIndex(coordinate)]
      : null;
  }

  coordinateToIndex(coordinate: Coordinate): number {
    return coordinate.y * this.width + coordinate.x;
  }

  replaceAt(coordinate: Coordinate, newValue: MapObject): void {
    if (!isRealCoordinate(coordinate)) return;

    this.objects[this.coordinateToIndex(coordinate)] = newValue;
  }

  asteroidCount(): number {
    return this.objects.filter(o => o === MapObject.Asteroid).length;
  }
}

export function pathFrom(pointA: Coordinate, pointB: Coordinate): Coordinate[] {
  const distanceX = pointA.x - pointB.x;
  const distanceY = pointA.y - pointB.y;

  const farthestDistance = R.max(Math.abs(distanceX), Math.abs(distanceY));

  return R.range(0, farthestDistance + 1).map(index => ({
    x: pointA.x + distanceX * -1 * (index / farthestDistance),
    y: pointA.y + distanceY * -1 * (index / farthestDistance),
  }));
}

function visiblePathToAsteroid(
  asteroid: Coordinate,
  otherPoint: Coordinate,
  { map }: { map: AsteroidMap }
): boolean {
  if (asteroid.x === otherPoint.x && asteroid.y === otherPoint.y) return false;
  if (map.at(otherPoint) !== MapObject.Asteroid) return false;

  const path = pathFrom(asteroid, otherPoint);

  return R.all(o => map.at(o) !== MapObject.Asteroid, R.slice(1, -1, path));
}

export function asteroidsInSight(
  asteroid: Coordinate,
  { map }: { map: AsteroidMap }
): number {
  if (map.at(asteroid) !== MapObject.Asteroid) return 0;

  return map.coordinates.reduce(
    (acc, coordinate) =>
      visiblePathToAsteroid(asteroid, coordinate, { map }) ? acc + 1 : acc,
    0
  );
}

export function displayCountsOnMap(map: AsteroidMap): string {
  const os = map.coordinates.map(c => asteroidsInSight(c, { map }) || ".");

  return R.splitEvery(map.width, os)
    .map(l => l.map(i => i.toString()).join(""))
    .join("\n");
}

export function visualize(
  asteroid: Coordinate,
  { map }: { map: AsteroidMap }
): string {
  const mapObjects: string[] = [""];

  let lastY = 0;
  map.coordinates.forEach(c => {
    if (lastY !== c.y) {
      lastY++;
      mapObjects.push("");
    }

    let char = ".";

    if (c.x === asteroid.x && c.y === asteroid.y) {
      char = colors.blue("#");
    } else if (visiblePathToAsteroid(asteroid, c, { map })) {
      char = colors.green("#");
    } else if (map.at(c) === MapObject.Asteroid) {
      char = "#";
    }

    mapObjects[mapObjects.length - 1] += char;
  });

  return mapObjects.join("\n");
}

export function computeAngle(
  fromPoint: Coordinate,
  toPoint: Coordinate
): number {
  const angleClampedToOneEighty =
    (Math.atan2(fromPoint.y - toPoint.y, fromPoint.x - toPoint.x) / Math.PI) *
    180;

  const angle =
    angleClampedToOneEighty >= 0
      ? angleClampedToOneEighty
      : 360 + angleClampedToOneEighty;

  return angle - 90 < 0 ? angle - 90 + 360 : angle - 90;
}

function anglesToEverySpot(
  fromPoint: Coordinate,
  { map }: { map: AsteroidMap }
): { coordinate: Coordinate; angle: number }[] {
  return map.coordinates
    .filter(c => !(c.y === fromPoint.y && c.x === fromPoint.x))
    .map(c => ({ coordinate: c, angle: computeAngle(fromPoint, c) }));
}

export function walkInACircle(
  fromPoint: Coordinate,
  { map }: { map: AsteroidMap },
  cb: (args: { coordinate: Coordinate; angle: number }) => void,
  keepLooping = () => false
): void {
  const angles = R.sortBy(
    R.prop("angle"),
    anglesToEverySpot(fromPoint, { map })
  );

  do {
    angles.map(cb);
  } while (keepLooping());
}

export function shootAsteroids(
  fromPoint: Coordinate,
  { map }: { map: AsteroidMap }
): Coordinate[] {
  const shotsFired: Coordinate[] = [];

  let lastAngle = -1;

  walkInACircle(
    fromPoint,
    { map },
    ({ coordinate, angle }) => {
      if (angle === lastAngle) return;
      if (map.at(coordinate) !== MapObject.Asteroid) return;

      if (visiblePathToAsteroid(fromPoint, coordinate, { map })) {
        shotsFired.push(coordinate);

        map.replaceAt(coordinate, MapObject.Empty);

        lastAngle = angle;
      }
    },
    () => {
      lastAngle = -1;

      return map.asteroidCount() > 1;
    }
  );

  return shotsFired;
}
