import * as assert from 'assert'
import mergeProps from './mergeProps'

describe('mergeProps', function () {
  it('should merge accept arrays as source objects', function () {
    const a = { one: 1, two: 2 }
    const b = [ 0, 1, 2 ]
    const c = mergeProps(a, b)

    assert.ok(c !== a, 'result is referentially equal to source object')
    assert.deepStrictEqual(c, {
      one: 1,
      two: 2,
      0: 0,
      1: 1,
      2: 2
    })

    const e = mergeProps(b, a)
    assert.strictEqual(typeof e, 'object')
    assert.deepStrictEqual(e, {
      one: 1,
      two: 2,
      0: 0,
      1: 1,
      2: 2
    })
  })

  it('should merge properties into a new object', function () {
    const a = { one: 1, two: 2 }
    const b = { three: 3, four: 4, one: 'one' }
    const c = mergeProps(a, b)

    assert.ok(c !== a, 'result is referentially equal to source object')
    assert.deepStrictEqual(c, {
      one: 'one',
      two: 2,
      three: 3,
      four: 4
    })
  })

  it('should merge properties into a new object and ignore the specified properties', function () {
    const a = { one: 1, two: 2 }
    const b = { three: 3, four: 4, one: 'one' }
    const c = mergeProps(a, b, { ignore: [ 'one', 'four' ] })

    assert.deepStrictEqual(c, {
      one: 1,
      two: 2,
      three: 3
    })
  })
})
