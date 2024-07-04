import * as React from 'react'
import renderer from 'react-test-renderer'

import Step from '../Step'

it('render when passing the params', () => {
	const tree = renderer.create(<Step active={1} total={4} style={{}} />).toJSON()
	expect(tree).toMatchSnapshot()
})
