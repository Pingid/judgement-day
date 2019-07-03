
// Syncranusly maps with async function
export const waitForEach = <T, K>(f: (x: T) => Promise<K>, [head, ...tail]: Array<T>): Promise<Array<K>> =>
  !head
    ? Promise.resolve([])
    : f(head).then((res: K) => waitForEach(f, tail).then(arr => ([res, ...arr])))

// Wrapps any function in a try catch and returns a promise
export const tryCatch = <T>(f: () => T): Promise<T> => {
  try { return Promise.resolve(f()) }
  catch (error) { return Promise.reject(error) }
}

// Retries promise failed promise
export const retry = <T>(limit: number = 0, delay: number = 0, acc: number = 0) => (f: (n: number) => Promise<T>): Promise<T | {}> => f(acc)
  .catch(x => {
    if (acc >= limit) return Promise.reject(x);
    return new Promise((resolve) => setTimeout(resolve, delay))
      .then(x => retry(limit, delay, acc + 1)(f))
  })

// Timeout Promise wrapper
export const timeout = <T, K>(ms: number, rej: T = null) => (promise: Promise<K>): Promise<T | K> => {
  let timeoutProm: Promise<T | K> = new Promise((_resolve, reject) => {
    let id = setTimeout((): void => {
      clearTimeout(id);
      reject(rej ? rej : 'Timed out in ' + ms + 'ms.')
    }, ms)
  })
  return Promise.race([promise, timeoutProm])
}

// Wrap JSON.parse in promise
export const parseJSON = <A extends {}>(json: string): Promise<A> => tryCatch(() => JSON.parse(json))
