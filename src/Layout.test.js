import * as React from 'react'
import * as assert from 'assert'
import { shallow, render } from 'enzyme'
import Layout from './Layout'
import Slot from './Slot'
import prefixKeys from './prefixKeys'

describe('Layout', function () {
  it('should render a <div> with className, id and data- attributes', function () {
    const id = 'my-id'
    const name = 'MyLayout'
    const className = 'testing'
    const dataset = { target: '#thing', scroll: 'spy' }
    const dataAttributes = prefixKeys(dataset, 'data-')
    const wrapper = shallow(
      <Layout name={name} id={id} dataset={dataset} content={''} className={className} />
    )
    assert.ok(wrapper.equals(
      <div id={id} className={'layout-' + name + ' ' + className} {...dataAttributes} />
    ))
  })

  it('should render slots with default content', function () {
    const name = 'MyLayout'
    const wrapper = render(
      <Layout name={name} content={[]}>
        <h1>Layout</h1>
        <Slot className='body'>
          Hello World!
        </Slot>
        <Slot name='footer'>
          The Footer
        </Slot>
        <Slot name='stuff' />
        <Slot name='stuff2'>{''}</Slot>
        <Slot name='footer' />
      </Layout>
    )

    assert.strictEqual(wrapper.html(), [
      '<div class="layout-MyLayout">',
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

  it('should render slots with concrete and default content', function () {
    const LayoutDefault = props => {
      return (
        <Layout name='Default' content={props.children}>
          <Slot className='body'>
            Hello World!
          </Slot>
          <Slot name='footer'>
            The Footer
          </Slot>
          <Slot name='footer' className='big-foot' />
        </Layout>
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
      '<div class="layout-Default">',
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
      return (
        <Layout name='Default' content={props.children}>
          <Slot className='body'>
            Hello World!
          </Slot>
          <Slot name='footer'>
            The Footer
          </Slot>
        </Layout>
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
      '<div class="layout-Default">',
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
    const name = 'MyLayout'
    const LayoutDefault = props => {
      return (
        <Layout name='Default' content={props.children}>
          <Slot className='body'>
            Hello World!
          </Slot>
          <Slot name='footer'>
            The Footer
          </Slot>
        </Layout>
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
      '<div class="layout-Default">',
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
    const name = 'MyLayout'
    const LayoutDefault = props => {
      return (
        <Layout name='Default' content={props.children}>
          <Slot className='body'>
            Hello World!
          </Slot>
          <Slot name='footer'>
            The Footer
          </Slot>
        </Layout>
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
      '<div class="layout-Default">',
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

  it('should not render nested <Slot> elements', function () {
    const name = 'MyLayout'
    const Footer = props => (<footer {...props} />)
    class Body extends React.Component {
      render () {
        return (<main {...this.props} />)
      }
    }
    const LayoutDefault = props => {
      return (
        <Layout name='Default' content={props.children}>
          <Slot className='body' as={Body}>
            Hello World!
            <Slot name='nothing' />
          </Slot>
          <Slot name='footer' as={Footer}>
            The Footer
          </Slot>
        </Layout>
      )
    }
    const wrapper = render(
      <LayoutDefault>
        <div slot className='new-body'>
          The New Body
          <Slot name='funny'>Funny</Slot>
        </div>
      </LayoutDefault>
    )

    assert.strictEqual(wrapper.html(), [
      '<div class="layout-Default">',
        '<main class="slot-default body new-body">',
          'The New Body',
        '</main>',
        '<footer class="slot-footer">',
          'The Footer',
        '</footer>',
      '</div>'
    ].join(''))
  })

  it('should render nested layouts as expected', function () {
    const name = 'MyLayout'
    const LayoutDefault = props => {
      return (
        <Layout name='Default' content={props.children}>
          <Slot className='body'>
            Hello World!
          </Slot>
          <Slot name='footer' as='footer'>
            The Footer
          </Slot>
        </Layout>
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
      '<div class="layout-Default">',
        '<div class="slot-default body new-body">',
          '<span>The New Body</span>',
          '<div class="layout-Default">',
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
