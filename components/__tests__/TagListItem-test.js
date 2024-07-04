import * as React from 'react'
import renderer from 'react-test-renderer'

import TagListItem from '../TagListItem'

it('TagListItem renders correctly', () => {
	const tree = renderer
		.create(<TagListItem index={0} sessiogTagAgg={{ name: 'test', duration: { hours: '1' } }} />)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
