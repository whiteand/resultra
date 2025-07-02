export abstract class BaseResult<T, E> {
  abstract ok(): this is OkResult<T>;
  abstract map<U>(fn: (value: T) => U): Result<U, E>;
  abstract mapErr<U>(fn: (error: E) => U): Result<T, U>;
  abstract andThen<U, E2>(fn: (value: T) => Result<U, E2>): Result<U, E | E2>;
  abstract unwrap(): T;
  abstract unwrapErr(): E;
}

export class OkResult<T> extends BaseResult<T, never> {
  constructor(public readonly value: T) {
    super();
  }
  ok(): this is OkResult<T> {
    return true;
  }
  map<U>(fn: (value: T) => U): Result<U, never> {
    return ok(fn(this.value));
  }
  mapErr<U>(_: (error: never) => U): Result<T, U> {
    return this
  }
  andThen<U, E2>(fn: (value: T) => Result<U, E2>): Result<U, E2> {
    return fn(this.value);
  }
  unwrap(): T {
    return this.value;
  }
  unwrapErr(): never {
    throw this
  }
}
export class ErrResult<E = Error> extends BaseResult<any, E> {
  constructor(public readonly error: E) {
    super();
  }
  ok(): this is OkResult<never> {
    return false;
  }
  map<U>(_fn: (value: never) => U): Result<U, E> {
    return this as any;
  }
  mapErr<U>(fn: (error: E) => U): Result<any, U> {
    return err(fn(this.error));
  }
  andThen<U, E2>(_fn: (value: never) => Result<U, E2>): Result<U, E> {
    return this as any;
  }
  unwrap(): never {
    throw this.error;
  }
  unwrapErr(): E {
    return this.error;
  }
}

export type Result<T, E = Error> = OkResult<T> | ErrResult<E>;

export function ok(): OkResult<void>;
export function ok<const T>(value: T): OkResult<T>;
export function ok(value?: unknown): OkResult<unknown> {
  return new OkResult(value);
}

export function err<const E>(error: E): ErrResult<E> {
  return new ErrResult(error);
}
export function unwrapOr<T>(result: Result<T>, defaultValue: T): T {
  return result.ok() ? result.value : defaultValue;
}
