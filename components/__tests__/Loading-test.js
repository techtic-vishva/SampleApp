import * as React from 'react'
import renderer from 'react-test-renderer'

import Loading from '../Loading'

it('Loading renders correctly', () => {
	const tree = renderer.create(<Loading />).toJSON()
	expect(tree).toMatchSnapshot()
})
