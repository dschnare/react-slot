import * as React from 'react'

export default function slot (name, children) {
  const slotNode = findNamedSlotNode(name, children)

  if (slotNode) {
    return slotNode.props.children
  } else {
    return null
  }
}

function findNamedSlotNode (name, children) {
  const node = React.Children.toArray(children).filter(child => {
    const node = child
    return node.props && node.props.slot === name
  })[0]

  return node
}
