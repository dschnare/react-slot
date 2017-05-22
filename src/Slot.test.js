import * as React from 'react'
import * as assert from 'assert'
import { shallow, render } from 'enzyme'
import Slot from './Slot'
import prefixKeys from './prefixKeys'

describe('Slot', function () {
  it('should render a <div> with className, id and data- attributes', function () {
    const id = 'my-id'
    const name = 'MySlot'
    const className = 'testing'
    const dataset = { target: '#thing', scroll: 'spy' }
    const dataAttributes = prefixKeys(dataset, 'data-')
    const wrapper = shallow(
      <Slot name={name}
        id={id}
        dataset={dataset}
        content={''}
        className={className}>
        {''}
      </Slot>
    )

    assert.ok(wrapper.equals(
      <div
        id={id}
        {...dataAttributes}
        className={'slot-' + name + ' ' + className}>
        {''}
      </div>
    ))
  })

  it('should render with default content', function () {
    const wrapper = render(
      <div>
        <h1>Layout</h1>
        <Slot className='body' content={''}>
          Hello World!
        </Slot>
        <Slot name='footer' content={''}>
          The Footer
        </Slot>
        <Slot name='stuff' content={''} />
        <Slot name='stuff2' content={''}>{''}</Slot>
        <Slot name='footer' content={''} />
      </div>
    )

    assert.strictEqual(wrapper.html(), [
      '<div>',
        '<h1>Layout</h1>',
        '<div class="slot-default body">',
          'Hello World!',
        '</div>',
        '<div class="slot-footer">',
          'The Footer',
        '</div>',
        '<div class="slot-stuff2"></div>',
      '</div>'
    ].join(''))
  })

  it('should render with concrete and default content', function () {
    const LayoutDefault = props => {
      const { children } = props
      return (
        <div className='layout-default'>
          <Slot className='body' content={children}>
            Hello World!
          </Slot>
          <Slot name='footer' content={children}>
            The Footer
          </Slot>
          <Slot name='footer' className='big-foot' content={children} />
        </div>
      )
    }
    const wrapper = render(
      <LayoutDefault>
        <div slot='footer' className='new-footer'>
          The New Footer
        </div>
        <div slot="nothing">
          Gonzo
        </div>
      </LayoutDefault>
    )

    assert.strictEqual(wrapper.html(), [
      '<div class="layout-default">',
        '<div class="slot-default body">',
          'Hello World!',
        '</div>',
        '<div class="slot-footer new-footer">',
          'The New Footer',
        '</div>',
        '<div class="slot-footer big-foot new-footer">',
          'The New Footer',
        '</div>',
      '</div>'
    ].join(''))
  })

  it('should render unamed default slot with concrete content', function () {
    const LayoutDefault = props => {
      const { children } = props
      return (
        <div className='layout-default'>
          <Slot className='body' content={children}>
            Hello World!
          </Slot>
          <Slot name='footer' content={children}>
            The Footer
          </Slot>
        </div>
      )
    }
    const wrapper = render(
      <LayoutDefault>
        <div slot className='new-body body'>
          The New Body
        </div>
      </LayoutDefault>
    )

    assert.strictEqual(wrapper.html(), [
      '<div class="layout-default">',
        '<div class="slot-default body new-body">',
          'The New Body',
        '</div>',
        '<div class="slot-footer">',
          'The Footer',
        '</div>',
      '</div>'
    ].join(''))
  })

  it('should render named default slot with concrete content', function () {
    const LayoutDefault = props => {
      const { children } = props
      return (
        <div className='layout-default'>
          <Slot className='body' content={children}>
            Hello World!
          </Slot>
          <Slot name='footer' content={children}>
            The Footer
          </Slot>
        </div>
      )
    }
    const wrapper = render(
      <LayoutDefault>
        <div slot='default' className='new-body body'>
          The New Body
        </div>
      </LayoutDefault>
    )

    assert.strictEqual(wrapper.html(), [
      '<div class="layout-default">',
        '<div class="slot-default body new-body">',
          'The New Body',
        '</div>',
        '<div class="slot-footer">',
          'The Footer',
        '</div>',
      '</div>'
    ].join(''))
  })

  it('should render default slot with unslotted concrete content', function () {
    const LayoutDefault = props => {
      const { children } = props
      return (
        <div className='layout-default'>
          <Slot className='body' content={children}>
            Hello World!
          </Slot>
          <Slot name='footer' content={children}>
            The Footer
          </Slot>
        </div>
      )
    }
    const wrapper = render(
      <LayoutDefault>
        <div>The New Body</div>
        <div slot='footer'>
          The New Footer
        </div>
        <h1>Headline</h1>
      </LayoutDefault>
    )

    assert.strictEqual(wrapper.html(), [
      '<div class="layout-default">',
        '<div class="slot-default body">',
          '<div>The New Body</div>',
          '<h1>Headline</h1>',
        '</div>',
        '<div class="slot-footer">',
          'The New Footer',
        '</div>',
      '</div>'
    ].join(''))
  })

  it('should render nested <Slot> elements', function () {
    const Footer = props => (<footer {...props} />)
    class Body extends React.Component {
      render () {
        return (<main {...this.props} />)
      }
    }
    const LayoutDefault = props => {
      const { children } = props
      return (
        <div className='layout-default'>
          <Slot className='body' as={Body} content={children}>
            Hello World!
            <Slot name='nothing' content={children} />
          </Slot>
          <Slot name='footer' as={Footer} content={children}>
            The Footer <Slot name='footer-inner' content={children} />
          </Slot>
        </div>
      )
    }
    const wrapper = render(
      <LayoutDefault>
        <div slot className='new-body'>
          The New Body
        </div>
        <div slot='footer-inner'>Boom</div>
      </LayoutDefault>
    )

    assert.strictEqual(wrapper.html(), [
      '<div class="layout-default">',
        '<main class="slot-default body new-body">',
          'The New Body',
        '</main>',
        '<footer class="slot-footer">',
          'The Footer ',
          '<div class="slot-footer-inner">Boom</div>',
        '</footer>',
      '</div>'
    ].join(''))
  })

  it('should override nested <Slot> elements when parent slots are overridden', function () {
    const Footer = props => (<footer {...props} />)
    class Body extends React.Component {
      render () {
        return (<main {...this.props} />)
      }
    }
    const LayoutDefault = props => {
      const { children } = props
      return (
        <div className='layout-default'>
          <Slot className='body' as={Body} content={children}>
            Hello World!
            <Slot name='nothing' content={children} />
          </Slot>
          <Slot name='footer' as={Footer} content={children}>
            The Footer <Slot name='footer-inner' content={children} />
          </Slot>
        </div>
      )
    }
    const wrapper = render(
      <LayoutDefault>
        <div slot className='new-body'>
          The New Body
        </div>
        <div slot='footer'>The Footer Boom</div>
      </LayoutDefault>
    )

    assert.strictEqual(wrapper.html(), [
      '<div class="layout-default">',
        '<main class="slot-default body new-body">',
          'The New Body',
        '</main>',
        '<footer class="slot-footer">',
          'The Footer Boom',
        '</footer>',
      '</div>'
    ].join(''))
  })

  it('should render nested layouts as expected', function () {
    const LayoutDefault = props => {
      const { children } = props
      return (
        <div className='layout-default'>
          <Slot className='body' content={children}>
            Hello World!
          </Slot>
          <Slot name='footer' as='footer' content={children}>
            The Footer
          </Slot>
        </div>
      )
    }
    const wrapper = render(
      <LayoutDefault>
        <div slot className='new-body'>
          <span>The New Body</span>
          <LayoutDefault>
            <div slot='footer' className='inner-footer'>
              Hello Footer!
            </div>
          </LayoutDefault>
        </div>
      </LayoutDefault>
    )

    assert.strictEqual(wrapper.html(), [
      '<div class="layout-default">',
        '<div class="slot-default body new-body">',
          '<span>The New Body</span>',
          '<div class="layout-default">',
            '<div class="slot-default body">',
              'Hello World!',
            '</div>',
            '<footer class="slot-footer inner-footer">',
              'Hello Footer!',
            '</footer>',
          '</div>',
        '</div>',
        '<footer class="slot-footer">',
          'The Footer',
        '</footer>',
      '</div>'
    ].join(''))
  })
})
