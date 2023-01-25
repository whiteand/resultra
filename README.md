# Resultra

Rust inspired result structure for javascript

- [Resultra](#resultra)
  - [Example](#example)
  - [Constructors](#constructors)
    - [ok](#ok)
    - [err](#err)
  - [Methods](#methods)
    - [ok](#ok-1)
    - [map](#map)
    - [andThen](#andthen)
    - [unwrap](#unwrap)
  - [Utils](#utils)
    - [catchError](#catcherror)
    - [catchAsync](#catchasync)
    - [collect](#collect)
    - [collectAsync](#collectasync)
    - [successes](#successes)
    - [successesAsync](#successesasync)
    - [fromJsonRpc](#fromjsonrpc)
    - [fromPromise](#frompromise)
    - [parseInt](#parseint)
    - [parseFloat](#parsefloat)
    - [assert](#assert)
    - [validate](#validate)


## Example

```typescript
import { ok, err } from 'resultra'
import { parseInt } from 'reusltra/utils'

function parseName() {
  const name = prompt('Enter your name');
  return name
    ? ok(name)
    : err(new Error('name is required'))
}

function parseAge() {
  const age = prompt('Enter your age');
  return age ? parseInt(age, 10) : err(new Error('Age is required'))
}

const personResult = parseName()
  .andThen(name =>
    parseAge()
      .map(age =>
        ({ name, age })
      )
  );

if (personResult.ok()) {
    const person = personResult.unwrap();
    console.log('Hello', person.name)
    console.log('You are', person.age, 'years old')
} else {
    console.log('Error:', personResult.error)
}
```

## Constructors

### ok

Creates an OkResult

```typescript
const okResult = ok(1);
const okValue = okResult.value
```

### err

Creates an ErrResult

```typescript
const errResult = err('error');
const errValue = errResult.error
```


## Methods

### ok

Returns true if the result is an OkResult

Example:

```typescript

```

### map

Maps the value of the result if it is an OkResult

### andThen

Maps the value of the result to another result if it is an OkResult

### unwrap

Unwraps the value of the result if it is an OkResult.
Throws an error if the result is an ErrResult.


## Utils


### catchError

Catches errors thrown by a function and returns a Result

```typescript
const result = catchError(() => {
  throw new Error('error')
})
assert(!result.ok(), 'result should be an error here')
assert(result.error.message === 'error')
```

### catchAsync

Catches errors thrown by an async function and returns a Promise of a Result

```typescript
const result = await catchAsync(async () => {
  throw new Error('error')
})
assert(!result.ok(), 'result should be an error here')
assert(result.error.message === 'error')
```

### collect

Collects an array of results into a single result of all the values.
If any of the results are errors, the first error is returned.

```typescript
const results = collect([
  ok(1),
  ok(2),
  ok(3),
])
assert(results.ok(), 'results should be ok')
assert(results.value.length === 3, 'results should have 3 values')
```

```typescript
const results = collect([
  ok(1),
  err('error'),
  ok(3),
])

assert(!results.ok(), 'results should be an error')
assert(results.error === 'error', 'error should be "error"')
```

### collectAsync

Collects an array of async results into a single result of all the values.
If any of the results are errors, the first error is returned.

```typescript
const results = await collectAsync([
  Promise.resolve(ok(1)),
  Promise.resolve(ok(2)),
  Promise.resolve(ok(3)),
])
assert(results.ok(), 'results should be ok')
assert(results.value.length === 3, 'results should have 3 values')
```

```typescript
const results = await collectAsync([
  Promise.resolve(ok(1)),
  Promise.resolve(err('error')),
  Promise.resolve(ok(3)),
])

assert(!results.ok(), 'results should be an error')
assert(results.error === 'error', 'error should be "error"')
```

### successes

Collects an array of results into an array of all successful result values.

```typescript
const results = successes([
  ok(1),
  ok(2),
  ok(3),
])
assert(results.length === 3, 'results should have 3 values')
```

```typescript
const results = successes([
  ok(1),
  err('error'),
  ok(3),
])

assert(results.length === 2, 'results should be equal to [1,3]')
```

### successesAsync

Collects an array of async results into an array of all successful result values.

```typescript
const results = await successesAsync([
  Promise.resolve(ok(1)),
  Promise.resolve(ok(2)),
  Promise.resolve(ok(3)),
])

assert(results.length === 3, 'results should have 3 values')
```

```typescript
const results = await successesAsync([
  Promise.resolve(ok(1)),
  Promise.resolve(err('error')),
  Promise.reject(ok(3)),
])

assert(results.length === 1, 'results should be equal to [1]')
```

### fromJsonRpc

Creates a Result from a JSON RPC response

```typescript
const result = fromJsonRpc({
  result: 1,
})
assert(result.ok(), 'result should be ok')
assert(result.value === 1, 'result should be equal to 1')
```

```typescript
const result = fromJsonRpc({
  error: new Error('error'),
})

assert(!result.ok(), 'result should be an error')
assert(result.error.message === 'error', 'error should be "error"')
```

### fromPromise

Creates a Promise of Result from a Promise. It will be ok, if the promise resolves, or an error, if the promise rejects.

```typescript
const result = await fromPromise(Promise.resolve(1))
assert(result.ok(), 'result should be ok')
assert(result.value === 1, 'result should be equal to 1')
```

```typescript
const result = await fromPromise(Promise.reject(new Error('error')))
assert(!result.ok(), 'result should be an error')
assert(result.error.message === 'error', 'error should be "error"')
```

### parseInt

Creates a Result of number from a string and a base. It will be ok, if the string can be parsed, or an error, if the string cannot be parsed.

```typescript
const result = parseInt('1', 10)
assert(result.ok(), 'result should be ok')
assert(result.value === 1, 'result should be equal to 1')
```

```typescript
const result = parseInt('a', 10)
assert(!result.ok(), 'result should be an error')
assert(result.error.message === 'Failed to parse a as number', 'error should be "Failed to parse a as number"')
```

### parseFloat

Creates a Result of number from a string. It will be ok, if the string can be parsed, or an error, if the string cannot be parsed.

```typescript
const result = parseFloat('1.1')
assert(result.ok(), 'result should be ok')
assert(result.value === 1.1, 'result should be equal to 1.1')
```

```typescript
const result = parseFloat('a')
assert(!result.ok(), 'result should be an error')
assert(result.error.message === 'Failed to parse a as number', 'error should be "Failed to parse a as number"')
```

### assert

Returns ok result if value is truthy, err with specified message if not

```typescript
const result = assert(1, 'error')
assert(result.ok(), 'result should be ok')
assert(result.value === 1, 'result should be equal to 1')
```

```typescript
const result = assert(0, 'error')
assert(!result.ok(), 'result should be an error')
assert(result.error.message === 'error', 'error should be "error"')
```

### validate

Checks if predicate returns true for a value, returns ok result if true, err with specified message if not

```typescript
const result = validate(1, (value) => value === 1, 'error')
assert(result.ok(), 'result should be ok')
assert(result.value === 1, 'result should be equal to 1')
```

```typescript
const result = validate(0, (value) => value === 1, 'error')
assert(!result.ok(), 'result should be an error')
assert(result.error.message === 'error', 'error should be "error"')
```

