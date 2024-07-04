import * as React from 'react'
import renderer from 'react-test-renderer'
import MyChallenges from '../MyChallenges'

it('render when passing the props', () => {
	const tree = renderer
		.create(
			<MyChallenges
				challenges={[]}
				onRowPress={() => {
					console.log('onRowPress')
				}}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
