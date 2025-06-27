import { describe, expect } from 'vitest'
import { err, ok, Result } from './result'
import { collectAsync } from './utils'

describe("collectAsync", (it) => {
    function fail<E>(error: E, delay: number = 0): Promise<Result<any, E>> {
        if (delay <= 0) {
            return Promise.resolve(err(error))
        }
        return new Promise((resolve) => {
            setTimeout(() => resolve(err(error)), delay);
        });
    }
    function success<T>(value: T, delay: number = 0): Promise<Result<T, any>> {
        if (delay <= 0) {
            return Promise.resolve(ok(value))
        }
        return new Promise((resolve) => {
            setTimeout(() => resolve(ok(value)), delay);
        });
    }
    it('works', async () => {
        let res: Result<unknown, string> = await collectAsync([success(1), success(2)])
        expect(res.unwrap()).toEqual([1, 2])
        res = await collectAsync([fail('err'), success(2)])
        expect(res.unwrapErr()).toEqual('err')
        res = await collectAsync([fail('err', 10), fail('err2')])
        expect(res.unwrapErr()).toEqual('err2')
        res = await collectAsync([fail('err', 100000), fail('err2')])
        expect(res.unwrapErr()).toEqual('err2')
    })
})