/**
 * Prefix all keys in the specified object and save them on a new object.
 *
 * Example:
 * const o = prefixKeys({ toggle: true, target: 'spy' }, 'data-')
 * // o will be: { 'data-toggle': true, 'data-target': 'spy' }
 *
 * @param {object} obj The object whoes keys/properties will be prefixed
 * @param {string} prefix The prefix to apply to each key in obj
 * @param {object} dest The optional destination object to save the new keys to
 * @return {{[key:string]:any}}
 */
export default function prefixKeys (obj, prefix, dest = {}) {
  return Object.keys(obj).reduce((o, key) => {
    o[`${prefix}${key}`] = obj[key]
    return o
  }, dest || {})
}
