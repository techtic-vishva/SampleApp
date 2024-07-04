import * as React from 'react'
import renderer from 'react-test-renderer'
import ProgressBar from '../ProgressBar'

it('render when passing the props', () => {
	const tree = renderer.create(<ProgressBar count={0} max={100} />).toJSON()
	expect(tree).toMatchSnapshot()
})
