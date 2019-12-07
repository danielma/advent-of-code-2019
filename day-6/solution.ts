import R from "ramda";
// type OrbitCounts = { direct: number; indirect: number };

type Planet = {
  name: string;
  orbits: string;
};

export function countOrbits(map: string): number {
  const planets: Planet[] = map.split("\n").map(o => {
    return {
      name: o.split(")")[1],
      orbits: o.split(")")[0],
    };
  });

  const reverseMap = R.reduce(
    (acc: object, planet: Planet) => {
      acc[planet.name] = planet.orbits;
      return acc;
    },
    {},
    planets
  );

  let count = 0;

  R.mapObjIndexed(orbits => {
    let nextPlanet = orbits;
    do {
      count++;
      nextPlanet = reverseMap[nextPlanet];
    } while (nextPlanet);
  }, reverseMap);

  return count;
  // return { direct: 0, indirect: 0 };
}
