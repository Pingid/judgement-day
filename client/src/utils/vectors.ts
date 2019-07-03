interface V2 {
  x: number;
  y: number;
}

export const transform = (p1: V2, p2: V2): V2 => ({
  x: p1.x + p2.x,
  y: p1.y + p2.y
});
export const circlePoint = (percentage: number, r: number): V2 => ({
  x: Math.cos(percentage * Math.PI * 2) * r,
  y: Math.sin(percentage * Math.PI * 2) * r
});

export const interpolateVector = (a: V2, b: V2, frac: number): V2 => ({
  x: a.x + (b.x - a.x) * frac,
  y: a.y + (b.y - a.y) * frac
});

export const randomDistributeVector = (v: V2, n: number): V2 => ({
  x: v.x + (Math.random() * n - n / 2),
  y: v.y + (Math.random() * n - n / 2)
});

export const distance = (a: V2, b: V2): number =>
  Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
