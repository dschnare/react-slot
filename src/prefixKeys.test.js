import * as assert from 'assert'
import prefixKeys from './prefixKeys'

describe('prefixKeys', function () {
  it('should prefix each key with "data-"', function () {
    const src = { one: 'one', two: 'two', three: 37 }
    const o = prefixKeys(src, 'data-')

    assert.ok(src !== o, 'result is referentially equal to src object')
    assert.deepStrictEqual(o, {
      'data-one': 'one',
      'data-two': 'two',
      'data-three': 37
    })
  })

  it('should prefix each key with "data-" and save each key to dest', function () {
    const src = { one: 'one', two: 'two', three: 37 }
    const dest = { prop: 'value' }
    const o = prefixKeys(src, 'data-', dest)

    assert.ok(o === dest, 'result is not referentially equal to dest object')
    assert.deepStrictEqual(o, {
      'data-one': 'one',
      'data-two': 'two',
      'data-three': 37,
      'prop': 'value'
    })
  })
})
