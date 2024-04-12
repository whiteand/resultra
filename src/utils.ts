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

export function collect<T, E>(results: Result<T, E>[]): Result<T[], E> {
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

export function successesAsync<T, E>(
  results: Promise<Result<T, E>>[]
): Promise<T[]> {
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

type PromiseError<P extends Promise<any>> = Parameters<
  Parameters<P["catch"]>[0]
>[0];

export function fromPromise<T, P extends Promise<T>>(
  promise: P
): Promise<Result<T, PromiseError<P>>> {
  return promise.then(ok, err);
}

export function parseInt(str: string, base: number): Result<number> {
  const value = Number.parseInt(str, base);
  if (Number.isNaN(value)) {
    return err(new Error(`Failed to parse "${str}" as number`));
  }
  return ok(value);
}

export function parseFloat(str: string): Result<number> {
  const value = Number.parseFloat(str);
  if (Number.isNaN(value)) {
    return err(new Error(`Failed to parse "${str}" as number`));
  }
  return ok(value);
}

export function assert<T>(
  value: T | false | 0 | "" | null | undefined,
  errorMessage: string
): Result<T> {
  if (value) {
    return ok(value as T);
  } else {
    return err(new Error(errorMessage));
  }
}
export function validate<T>(
  value: T,
  validator: (value: any) => boolean,
  errorMessage: string
): Result<T>;
export function validate<T, U>(
  value: T,
  validator: (value: any) => value is U,
  errorMessage: string
): Result<U>;
export function validate<T>(
  value: T,
  validator: (value: any) => boolean,
  errorMessage: string
): Result<T> {
  if (validator(value)) {
    return ok(value);
  } else {
    return err(new Error(errorMessage));
  }
}
