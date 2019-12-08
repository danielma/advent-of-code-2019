import R from "ramda";
import { parseIntBaseTen } from "../utils";

type Layer = number[];

export function dataToLayers(
  data: string,
  { width, height }: { width: number; height: number }
): Layer[] {
  const layerSize = width * height;
  const stringLayers = R.splitEvery(layerSize, data);

  return stringLayers.map(l => l.split("").map(parseIntBaseTen));
}
