// Converting Between
export const convertHexToRgb = hex => {
  const match = hex.replace(/#/, "").match(/.{1,2}/g);
  return {
    r: parseInt(match[0], 16),
    g: parseInt(match[1], 16),
    b: parseInt(match[2], 16)
  };
};

export const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

export const rgbToHex = rgb => {
  return (
    "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b)
  );
};

// Functions
export const interpolateColor = (
  left: string,
  right: string,
  percentage: number
): string => {
  const [l, r] = [convertHexToRgb(left), convertHexToRgb(right)];

  const rgb = ["r", "g", "b"]
    .map(x => ({ [x]: Math.round(l[x] + (r[x] - l[x]) * percentage) }))
    .reduce((a, b) => ({ ...a, ...b }));

  return rgbToHex(rgb);
};

export const combineColors = (colors: [number, number]): string => {
  return colors.reduce(
    (combined, color) => interpolateColor(combined, color[0], color[1]),
    "#ffffff"
  );
};
