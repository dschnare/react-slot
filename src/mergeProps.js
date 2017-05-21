/**
 * Merges two React property objects into a new object and returns it. The
 * property names in the ignore array option will not be merged from the second
 * property object.
 *
 * Example:
 * const p mergeProps(
 *  { id: 'id', className: 'one' },
 *  { className: 'two three one', id: 'id2 },
 *  { ignore: [ 'id' ] }
 * )
 * // p will be: { id: 'id', className: 'one two three' }
 *
 * @param {{[key:string]:any}} a
 * @param {{[key:string]:any}} b
 * @return {{[key:string]:any}}
 */
export default function mergeProps (a, b, { ignore = [] } = {}) {
  b = Object.assign({}, b)

  ignore.forEach(prop => delete b[prop])
  const className = typeof b.className === 'string'
    ? b.className.split(' ')
    : b.className
  delete b.className

  if (a.className || className) {
    a.className = [].concat(
      typeof a.className === 'string'
        ? a.className.split(' ')
        : a.className
      )
      .concat(className)
      .filter(Boolean)
      .reduce((a, b) => a.indexOf(b) < 0 ? a.concat(b) : a, [])
      .join(' ')
  }

  return Object.assign({}, a, b)
}
