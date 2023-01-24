import { Result, err, ok } from "./result";

export function catchError<Params extends any[], R>(
  cb: (...params: Params) => R,
  ...args: Params
): Result<R> {
  try {
    const r = cb(...args);
    return ok(r);
  } catch (error) {
    return err(error);
  }
}

export function catchAsync<Params extends any[], R>(
  cb: (...params: Params) => Promise<R>,
  ...args: Params
): Promise<Result<R>> {
  return cb(...args).then(ok, err);
}

export function collect<T>(results: Result<T>[]): Result<T[]> {
  const res: T[] = [];
  for (const x of results) {
    if (x.ok()) {
      res.push(x.value);
    } else {
      return x;
    }
  }
  return ok(res);
}

export function collectAsync<T>(
  results: Promise<Result<T>>[]
): Promise<Result<T[]>> {
  return Promise.all(
    results.map(
      (resultPromise): Promise<Result<T>> =>
        fromPromise(resultPromise).then((r) => r.andThen((x: Result<T>) => x))
    )
  ).then(collect);
}

export function successes<T>(results: Result<T>[]): T[] {
  const res: T[] = [];
  for (const x of results) {
    if (x.ok()) {
      res.push(x.value);
    }
  }
  return res;
}

export function successesAsync<T>(results: Promise<Result<T>>[]): Promise<T[]> {
  return Promise.all(
    results.map(
      (p): Promise<Result<T>> => fromPromise(p).then((x) => x.andThen((x) => x))
    )
  ).then(successes);
}

export function fromJsonRpc<T>(data: { error?: any; result?: T }): Result<T> {
  if (data.error) {
    return err(data.error);
  } else {
    return ok(data.result as T);
  }
}

export function fromPromise<T>(promise: Promise<T>): Promise<Result<T>> {
  return promise.then(ok, err);
}
