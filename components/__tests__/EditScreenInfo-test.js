import * as React from 'react'
import renderer from 'react-test-renderer'

import EditScreenInfo from '../EditScreenInfo'

it('render when pass the path properly', () => {
	const tree = renderer.create(<EditScreenInfo path="Snapshot path" />).toJSON()
	expect(tree).toMatchSnapshot()
})
