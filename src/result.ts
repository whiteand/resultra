export class OkResult<T> {
  constructor(public readonly value: T) {}
  ok(): this is OkResult<T> {
    return true;
  }
  map<U>(fn: (value: T) => U): Result<U> {
    return ok(fn(this.value));
  }
  andThen<U>(fn: (value: T) => Result<U>): Result<U> {
    return fn(this.value);
  }
  unwrap(): T {
    return this.value;
  }
}
export class ErrResult<E = Error> {
  constructor(public readonly error: E) {}
  ok(): this is OkResult<never> {
    return false;
  }
  map<U>(_fn: (value: never) => U): Result<U> {
    return this as any;
  }
  andThen<U>(_fn: (value: never) => Result<U>): Result<U> {
    return this as any;
  }
  unwrap(): never {
    throw this.error;
  }
}

export type Result<T, E = Error> = OkResult<T> | ErrResult<E>;

export function ok<T>(value: T): OkResult<T> {
  return new OkResult(value);
}

export function err<E>(error: E): ErrResult<E> {
  return new ErrResult(error);
}
export function unwrapOr<T>(result: Result<T>, defaultValue: T): T {
  return result.ok() ? result.value : defaultValue;
}
