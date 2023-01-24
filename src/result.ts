export interface IResult<T> {
  ok(): this is OkResult<T>;
  map<U>(fn: (value: T) => U): IResult<U>;
  mapErr(fn: (value: Error) => Error): IResult<T>;
  andThen<U>(fn: (value: T) => IResult<U>): IResult<U>;
  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  unwrapOrElse(defaultValue: T): T;
}

export class OkResult<T> implements IResult<T> {
  constructor(public readonly value: T) {}
  ok(): this is OkResult<T> & Exclude<any, ErrResult> {
    return true;
  }
  map<U>(fn: (value: T) => U): IResult<U> {
    return ok(fn(this.value));
  }
  mapErr<U>(_fn: (error: Error) => U): IResult<T> {
    return this;
  }
  andThen<U>(fn: (value: T) => IResult<U>): IResult<U> {
    return fn(this.value);
  }
  unwrap(): T {
    return this.value;
  }
  unwrapOr(_defaultValue: T): T {
    return this.value;
  }
  unwrapOrElse(_defaultValue: T): T {
    return this.value;
  }
}

export class ErrResult implements IResult<any> {
  constructor(public readonly error: Error) {}
  ok(): this is OkResult<never> {
    return false;
  }
  map<U>(_fn: (value: never) => U): IResult<U> {
    return this as any;
  }
  mapErr(fn: (value: Error) => Error): IResult<any> {
    return err(fn(this.error));
  }
  andThen<U>(_fn: (value: never) => IResult<U>): IResult<U> {
    return this as any;
  }
  unwrap(): never {
    throw this.error;
  }
  unwrapOr(defaultValue: any) {
    return defaultValue;
  }
  unwrapOrElse(fn: () => any): any {
    return fn();
  }
}

export function ok<T>(value: T): OkResult<T> {
  return new OkResult(value);
}

export function err(error: Error): ErrResult {
  return new ErrResult(error);
}

export type Result<T> = IResult<T>;
