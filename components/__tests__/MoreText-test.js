import * as React from 'react'
import renderer from 'react-test-renderer'
import MoreText from '../MoreText'

it('render when passing the props', () => {
	const tree = renderer.create(<MoreText text={''} />).toJSON()
	expect(tree).toMatchSnapshot()
})
