import * as R from "ramda";

export const mergeAdd = R.curry((a, b) =>
  Object.keys(a)
    .map(key => (b[key] ? { [key]: a[key] + b[key] } : { [key]: a[key] }))
    .reduce((a, b) => ({ ...a, ...b }), {})
);

export const divideBy = R.curry((val, obj) =>
  Object.keys(obj)
    .map(key => ({ [key]: obj[key] / val }))
    .reduce((a, b) => ({ ...a, ...b }), {})
);

export const mergeAverage = <T>(objs: T[]) =>
  divideBy(objs.length, objs.reduce((a, b) => mergeAdd(b, a), {}));
