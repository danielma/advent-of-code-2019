import test from "ava";
import R from "ramda";
import {
  pathFrom,
  asteroidsInSight,
  Coordinate,
  computeAngle,
  AsteroidMap,
  shootAsteroids,
} from "./solution";
import { readFileSync } from "fs";

test("generating a path", t => {
  const coordinates = pathFrom({ x: 0, y: 0 }, { x: 4, y: 4 });

  t.deepEqual(coordinates, [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 4 },
  ]);
});

test("generating a path in the other direction", t => {
  const coordinates = pathFrom({ x: 3, y: 4 }, { x: 1, y: 0 });

  t.deepEqual(coordinates, [
    { x: 3, y: 4 },
    { x: 2.5, y: 3 },
    { x: 2, y: 2 },
    { x: 1.5, y: 1 },
    { x: 1, y: 0 },
  ]);
});

test.skip("path generation is always equal", t => {
  function inBothDirections(pointA: Coordinate, pointB: Coordinate): void {
    t.deepEqual(pathFrom(pointA, pointB), pathFrom(pointB, pointA));
  }

  inBothDirections({ x: 0, y: 0 }, { x: 4, y: 4 });
  inBothDirections({ x: 6, y: 3 }, { x: 9, y: 0 });
  inBothDirections({ x: 3, y: 4 }, { x: 9, y: 0 });
});

test("a path that is broken", t => {
  const coordinates = pathFrom({ x: 6, y: 3 }, { x: 9, y: 0 });

  t.deepEqual(coordinates, [
    { x: 6, y: 3 },
    { x: 7, y: 2 },
    { x: 8, y: 1 },
    { x: 9, y: 0 },
  ]);
});

test("another path that is broken", t => {
  const coordinates = pathFrom({ x: 0, y: 2 }, { x: 2, y: 2 });

  t.deepEqual(coordinates, [
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ]);
});

test("parsing a map", t => {
  const map = new AsteroidMap(`.#..#
.....
#####
....#
...##`);

  t.is(asteroidsInSight({ x: 0, y: 0 }, { map }), 0);
  t.is(asteroidsInSight({ x: 4, y: 3 }, { map }), 7);
  t.is(asteroidsInSight({ x: 4, y: 2 }, { map }), 5);
  t.is(asteroidsInSight({ x: 3, y: 4 }, { map }), 8);

  t.is(asteroidsInSight({ x: 0, y: 2 }, { map }), 6);
  t.is(asteroidsInSight({ x: 4, y: 2 }, { map }), 5);

  const counts = map.coordinates.map(c => asteroidsInSight(c, { map }));
  t.is(R.reduce(R.max, -1, counts), 8);
});

test("example 1", t => {
  const map = new AsteroidMap(`......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`);

  const counts = map.coordinates.map(c => asteroidsInSight(c, { map }));
  t.is(R.reduce(R.max, -1, counts), 33);
});

test("example 2", t => {
  const map = new AsteroidMap(`#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`);

  const counts = map.coordinates.map(c => asteroidsInSight(c, { map }));
  t.is(R.reduce(R.max, -1, counts), 35);
});

test("example 3", t => {
  const mapSource = `.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`;
  const map = new AsteroidMap(mapSource);

  const counts = map.coordinates.map(c => asteroidsInSight(c, { map }));

  t.is(R.reduce(R.max, -1, counts), 41);
});

test("example 4", t => {
  const map = new AsteroidMap(`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`);

  const counts = map.coordinates.map(c => asteroidsInSight(c, { map }));
  t.is(R.reduce(R.max, -1, counts), 210);
});

test("real test input", t => {
  const map = new AsteroidMap(readFileSync(`${__dirname}/input`).toString());

  const counts = map.coordinates.map(c => asteroidsInSight(c, { map }));
  t.is(R.reduce(R.max, -1, counts), 274);
});

test("compute some angles", t => {
  // 0 is north
  // 90 is west
  // 180 is south
  // 270 is east
  t.is(computeAngle({ x: 4, y: 4 }, { x: 4, y: 0 }), 0);
  t.is(computeAngle({ x: 4, y: 4 }, { x: 8, y: 4 }), 90);
  t.is(computeAngle({ x: 4, y: 4 }, { x: 4, y: 8 }), 180);
  t.is(computeAngle({ x: 4, y: 4 }, { x: 0, y: 4 }), 270);
});

test.skip("walk in a circle", t => {
  const map = new AsteroidMap(`.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....X...###..
..#.#.....#....##`);

  console.log(shootAsteroids({ x: 8, y: 3 }, { map }));

  t.is(1, 2);
});

test("shoot asteroids", t => {
  const map = new AsteroidMap(`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`);

  const shots = shootAsteroids({ x: 11, y: 13 }, { map });

  t.deepEqual(shots[0], { x: 11, y: 12 });
  t.deepEqual(shots[1], { x: 12, y: 1 });
  t.deepEqual(shots[2], { x: 12, y: 2 });
  t.deepEqual(shots[9], { x: 12, y: 8 });
  t.deepEqual(shots[19], { x: 16, y: 0 });
  t.deepEqual(shots[49], { x: 16, y: 9 });
  t.deepEqual(shots[99], { x: 10, y: 16 });
  t.deepEqual(shots[198], { x: 9, y: 6 });
  t.deepEqual(shots[199], { x: 8, y: 2 });
  t.deepEqual(shots[200], { x: 10, y: 9 });
  t.is(shots.length, 299);
  t.deepEqual(shots[298], { x: 11, y: 1 });
});

test("part 2, real input", t => {
  const map = new AsteroidMap(readFileSync(`${__dirname}/input`).toString());

  const thePlacement = map.coordinates.find(
    c => asteroidsInSight(c, { map }) === 274
  );

  if (!thePlacement) throw new Error("didn't find the spot!");

  const shots = shootAsteroids(thePlacement, { map });

  t.deepEqual(shots[199], { x: 3, y: 5 });
});
