import * as React from 'react'
import * as PropTypes from 'prop-types'
import prefixKeys from './prefixKeys'

export default class Layout extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    id: PropTypes.string,
    className: PropTypes.string,
    dataset: PropTypes.object,
    role: PropTypes.string,
    children: PropTypes.node,
    as: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ])
  }

  static defaultProps =  {
    id: '',
    className: '',
    role: '',
    dataset: {},
    as: 'div'
  }

  static childContextTypes = {
    reactLayout: PropTypes.node
  }

  getChildContext () {
    const { content } = this.props
    return { reactLayout: content }
  }

  render () {
    const { role, id, dataset = {}, children, as: layout = 'div' } = this.props
    const attrs = prefixKeys(dataset, 'data-')

    if (id) attrs.id = id
    if (role) attrs.role = role
    attrs.className = this.getLayoutClassName()

    return React.createElement(layout, attrs, children)
  }

  getLayoutClassName () {
    const { name = 'Layout', className = '' } = this.props
    return [ `layout-${name}`, className ]
      .filter(Boolean)
      .reduce((a, b) => a.indexOf(b) < 0 ? a.concat(b) : a,[])
      .join(' ')
  }
}
