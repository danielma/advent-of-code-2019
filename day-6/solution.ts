import R from "ramda";

type Planet = {
  name: string;
  orbits: string;
};

type ReverseMap = { [key: string]: Planet["name"] };

function makeReverseMap(map: string): ReverseMap {
  const planets: Planet[] = map.split("\n").map(o => {
    return {
      name: o.split(")")[1],
      orbits: o.split(")")[0],
    };
  });

  return R.reduce(
    (acc: object, planet: Planet) => {
      acc[planet.name] = planet.orbits;
      return acc;
    },
    {},
    planets
  );
}

export function countOrbits(map: string): number {
  const reverseMap = makeReverseMap(map);

  let count = 0;

  R.forEach(orbits => {
    let nextPlanet = orbits;
    do {
      count++;
      nextPlanet = reverseMap[nextPlanet];
    } while (nextPlanet);
  }, R.values(reverseMap));

  return count;
}

function makePath({
  from,
  to = undefined,
  map,
}: {
  from: Planet["name"];
  to?: Planet["name"];
  map: ReverseMap;
}): Planet["name"][] {
  const path: string[] = [];

  let nextPlanet = map[from];

  do {
    path.push(nextPlanet);
    nextPlanet = map[nextPlanet];
  } while (nextPlanet && nextPlanet !== to);

  return path;
}

function findTheFirstCommonElement(pathA: string[], pathB: string[]): string {
  for (let iA = 0; iA < pathA.length; iA++) {
    const planetA = pathA[iA];
    for (let iB = 0; iB < pathB.length; iB++) {
      const planetB = pathB[iB];

      if (planetA === planetB) {
        return planetA;
      }
    }
  }

  return "COM";
}

export function transfersFrom(
  planetA: string,
  planetB: string,
  map: string
): number {
  const reverseMap = makeReverseMap(map);

  const pathA = makePath({ from: planetA, map: reverseMap });
  const pathB = makePath({ from: planetB, map: reverseMap });

  const common = findTheFirstCommonElement(pathA, pathB);

  return (
    makePath({ from: planetA, to: common, map: reverseMap }).length +
    makePath({ from: planetB, to: common, map: reverseMap }).length
  );
}
