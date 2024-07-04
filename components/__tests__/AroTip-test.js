import * as React from 'react'
import renderer from 'react-test-renderer'
import AroTip from '../AroTip'

it('render when passing the props', () => {
	const tree = renderer.create(<AroTip message="" />).toJSON()
	expect(tree).toMatchSnapshot()
})
