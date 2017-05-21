# React Slots

A set of slot-based content distribution components for React. The technique
was highly influenced by the content distribution techniques introduced by
[Vuejs](http://vuejs.org/v2/guide/components.html#Content-Distribution-with-Slots).

## Install

    npm install react@">=15" react-dom@">=15" react-slots -S

## Quick Start

    // LayoutDefault.js
    // Generates a slotted HTML layout like the following:
    // <div class="layout-default">
    //  <header class="slot-header">Welcome!</header>
    //  <div class="slot-default main" role="main"></div>
    //  <div class="slot-info">Copyright 2017</div>
    //  <footer class="slot-footer"></footer>
    // </div>
    import * as React from 'react'
    import { Layout, Slot } from 'react-layout'

    export default function LayoutDefault (props) {
      return (
        <Layout name='default' content={props.children}>
          <Slot name='header' as='header'>Welcome!</Slot>
          <Slot className='main' role='main' />
          <Slot name='info'>Copyright 2017</Slot>
          <Slot name='footer' as='footer' />
        </Layout>
      )
    }

    // PageHome.js
    // Create a page that will insert content into a layout's slots.
    import * as React from 'react'

    export default PageHome extends React.Component {
      static propsTypes = {
        layout: PropTypes.func.isRequired
      }

      constructor (props) {
        super(props)
        this.clicked = this.clicked.bind(this)
      }

      render () {
        const { layout } = this.props

        return (
          <layout>
            <div slot='header'><h1>Home</h1></div>
            <div slot>
              The main content
            </div>
          </layout>
        )
      }

      clicked (event) {
        console.log('clicked!')
      }
    }

    // App.js
    import * as React from 'react'
    import * as ReactDOM from 'react-dom'
    import PageHome from './PageHome'

    const page = <PageHome layout={DefaultLayout} />

    ReactDOM.render(
      page,
      document.getElementById('app')
    )

## API

### Layout

Lyout is a component that is meant to hold your common content and a set of
`<Slot>` elements.

**Props**

- `name` *(required)* The name of this layout (inserted as class name 'layout-${name}')
- `content` *(required)* The children of the wrapping React component
- `id` The HTML id
- `className` Additional class names
- `dataset` *[default: {}]* An object with keys to set as 'data-' attributes
- `role` The HTML role
- `as` *[default: 'div']* The type of React element to create the root element as

Example:

    // A layout that will render HTML like the following:
    // <div class="layout-Default layout" data-hook="top">...</div>
    const LayoutDefault = props => {
      return (
        <Layout name='Default' className='layout' dataset={{ hook: 'top' }}>
          // ... content and <Slot> elements ...
        </Layout>
      )
    }

### Slot

Slot is a component that is meant to compose `<Layout>` elements with. These act
as the points where a layout can be altered by a component using the layout.

*NOTE: The Slot component will render nothing when used outside the context of a
Layout.*

**Props**

- `name` The name of this slot (inserted as class name 'slot-${name}')
- `id` The HTML id
- `className` Additional class names
- `dataset` *[default: {}]* An object with keys to set as 'data-' attributes
- `role` The HTML role
- `as` *[default: 'div']* The type of React element to create the root element as

Example:

    // A layout that will render HTML like the following:
    // <div class="layout-Default layout" data-hook="top">
    //  <header>Welcome!</header>
    //  <div class="slot-default main" role="main"></div>
    //  <div class="slot-info">Copyright 2017</div>
    //  <footer class="slot-footer"></footer>
    // </div>
    const LayoutDefault = props => {
      return (
        <Layout
          name='Default'
          content={props.children}
          className='layout'
          dataset={{ hook: 'top' }}>
          <Slot name='header' as='header'>Welcome!</Slot>
          <Slot className='main' role='main' />
          <Slot name='info'>Copyright 2017</Slot>
          <Slot name='footer' as='footer' />
        </Layout>
      )
    }

To insert content into a `Slot` the component using the layout needs to
designate React subtrees to use a slot by setting the `slot` prop on an element
to have its children inserted into the slot with the mathcing name (if one
exists).

    <div slot='slot-name'>...inserted into the slot-name slot...</div>

Any React elements with a `slot` set to `"default"`, or `true` will have thier
children inserted into the default slot (if one exists).

    <div slot>...inserted into the default slot...</div>
    <div slot='default'>...inserted into the default slot...</div>

Since only the children of a react subtree are inserted into a slot, all props
on the subtree root node are merged with the props defined on the `<Slot>`
element in the layout.

    // in the layout...
    <Slot name='footer' className='footer' />

    // Using the layout...
    <Layout>
      <div slot='footer' className='my-footer'>The Footer</div>
    </Layout>

    // Results in the footer slot being rendered as...
    <div class="slot-footer footer my-footer">TheFooter</div>

Also, if a default slot exists and no slotted subtree is found with the value
set to `default` or unnamed, then all React nodes without a slot designation
will be inserted into the default slot.

    <div slot='slot-name'>...</div>
    <div>Default content1</div>
    <div>More default content</div>
    <div slot='slot-name2'>...</div>

Example Usage of `LayoutDefault`:

    // A page component that uses LayoutDefault to structure its content. This
    // will render a page that looks like this:
    // <div class="layout-Default layout" data-hook="top">
    //  <header>Welcome!</header>
    //  <div class="slot-default main" role="main">
    //    <div>Hello World!</div>
    //    <p>This is some more content inserted into the default slot</p>
    //  </div>
    //  <div class="slot-info">Copyright 2018</div>
    // </div>
    const Page = props => {
      return (
        <LayoutDefault>
          <div slot='info'>Copyright 2018</div>
          <div>Hello World!</div>
          <p>This is some more content inserted into the default slot</p>
        </LayoutDefault>
      )
    }

Alternatively, you can explicitly insert content into a layout's default slot by
name by setting the `slot` prop to `"default"`.

    // This will yield the same rendered HTML as above.
    const Page = props => {
      return (
        <LayoutDefault>
          <div slot='info'>Copyright 2018</div>
          <div slot='default'>
            <div>Hello World!</div>
            <p>This is some more content inserted into the default slot</p>
          </div>
        </LayoutDefault>
      )
    }

## Related/Works Well With Modules

- [react-layout](https://npmjs.org/react-layout)
