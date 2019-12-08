import R from "ramda";
import { parseIntBaseTen } from "../utils";
import colors from "colors/safe";

type Layer = number[];
type Dimensions = { width: number; height: number };

export function dataToLayers(
  data: string,
  { width, height }: Dimensions
): Layer[] {
  const layerSize = width * height;
  const stringLayers = R.splitEvery(layerSize, data);

  return stringLayers.map(l => l.split("").map(parseIntBaseTen));
}

/*
Now you're ready to decode the image. The image is rendered by stacking the layers and aligning the pixels with the same positions in each layer. The digits indicate the color of the corresponding pixel: 0 is black, 1 is white, and 2 is transparent.

The layers are rendered with the first layer in front and the last layer in back. So, if a given position has a transparent pixel in the first and second layers, a black pixel in the third layer, and a white pixel in the fourth layer, the final image would have a black pixel at that position.

For example, given an image 2 pixels wide and 2 pixels tall, the image data 0222112222120000 corresponds to the following image layers:

Layer 1: 02
         22

Layer 2: 11
         22

Layer 3: 22
         12

Layer 4: 00
         00
Then, the full image can be found by determining the top visible pixel in each position:

The top-left pixel is black because the top layer is 0.
The top-right pixel is white because the top layer is 2 (transparent), but the second layer is 1.
The bottom-left pixel is white because the top two layers are 2, but the third layer is 1.
The bottom-right pixel is black because the only visible pixel in that position is 0 (from layer 4).
So, the final image looks like this:

01
10
What message is produced after decoding your image?
*/

const BLACK = 0;
const WHITE = 1;
const TRANSPARENT = 2;

export function compositeImage(data: string, dimensions: Dimensions): Layer {
  const finalLayer = R.repeat(2, dimensions.width * dimensions.height);

  dataToLayers(data, dimensions)
    .reverse()
    .forEach(layer => {
      layer.forEach((pixel, index) => {
        if (pixel === TRANSPARENT) return;

        finalLayer[index] = pixel;
      });
    });

  return finalLayer;
}

function colorizedPixel(pixel: number): string {
  switch (pixel) {
    case TRANSPARENT:
      return " ";
    case BLACK:
      return colors.bgBlack(colors.black(" "));
    case WHITE:
      return colors.bgWhite(colors.white(" "));
    default:
      throw new Error(`No color for ${pixel}`);
  }
}

export function asciiRepresentation(
  layer: Layer,
  { width, height }: Dimensions
): string {
  let result = "";

  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const pixel = layer[row * width + column];

      result += colorizedPixel(pixel);
    }
    result += "\n";
  }

  return result;
}
