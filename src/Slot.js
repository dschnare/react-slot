import * as React from 'react'
import * as PropTypes from 'prop-types'
import prefixKeys from './prefixKeys'
import mergeProps from './mergeProps'

export default class Slot extends React.Component {
  static propTypes = {
    content: PropTypes.node.isRequired,
    name: PropTypes.string,
    children: PropTypes.node,
    id: PropTypes.string,
    className: PropTypes.string,
    dataset: PropTypes.object,
    role: PropTypes.string,
    as: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ])
  }

  static defaultProps = {
    name: '',
    id: '',
    className: '',
    dataset: {},
    role: '',
    as: 'div'
  }

  render () {
    if (this.isDefaultSlot()) {
      return this.renderDefaultSlot()
    } else {
      return this.renderNamedSlot()
    }
  }

  isDefaultSlot () {
    const { name = '' } = this.props
    return !name
  }

  renderDefaultSlot () {
    const { role, id, dataset = {}, children, as: slot = 'div' } = this.props
    let attrs = prefixKeys(dataset, 'data-')
    let slotNode = this.findDefaultSlotNode()
    let content = []

    if (id) attrs.id = id
    if (role) attrs.role = role
    attrs.className = this.getSlotClassName()

    if (slotNode) {
      const opts = { ignore: [ 'slot', 'children' ] }
      attrs = mergeProps(attrs, slotNode.props, opts)
      content = slotNode.props.children
    } else {
      content = this.findUnslottedNodes()
    }

    content = React.Children.count(content) === 0 ? children : content

    if (React.Children.count(content) > 0) {
      return (
        React.createElement(slot, attrs, content)
      )
    } else {
      return null
    }
  }

  renderNamedSlot () {
    const { role, name, id, dataset = {}, children, as: slot = 'div' } = this.props
    let attrs = prefixKeys(dataset, 'data-')
    let slotNode = this.findNamedSlotNode(name)
    let content = []

    if (id) attrs.id = id
    if (role) attrs.role = role
    attrs.className = this.getSlotClassName()

    if (slotNode) {
      const opts = { ignore: [ 'slot', 'children' ] }
      attrs = mergeProps(attrs, slotNode.props, opts)
      content = slotNode.props.children
    }

    content = React.Children.count(content) === 0 ? children : content

    if (React.Children.count(content) > 0) {
      return (
        React.createElement(slot, attrs, content)
      )
    } else {
      return null
    }
  }

  getSlotClassName () {
    const { name = '', className = '' } = this.props
    return [ `slot-${name || 'default'}`, className ]
      .filter(Boolean)
      .reduce((a, b) => a.indexOf(b) < 0 ? a.concat(b) : a,[])
      .join(' ')
  }

  findNamedSlotNode (name) {
    const { content } = this.props
    const node = React.Children.toArray(content).filter(child => {
      const node = child
      return node.props && node.props.slot === name
    })[0]

    return node
  }

  findDefaultSlotNode () {
    const { content } = this.props
    const node = React.Children.toArray(content).filter(node => {
      const props = node.props || {}
      return props.slot === true || props.slot === 'default'
    })[0]

    return node
  }

  findUnslottedNodes () {
    const { content } = this.props
    return React.Children.toArray(content).filter(node => {
      return !node.props || !('slot' in node.props)
    }).filter(Boolean)
  }
}
