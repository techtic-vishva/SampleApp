import * as React from 'react'
import renderer from 'react-test-renderer'
import JoinChallenges from '../JoinChallenges'

it('render when passing the props', () => {
	const tree = renderer
		.create(
			<JoinChallenges
				isHorizontal={true}
				challenges={[]}
				onJoinPres={() => {
					console.log('onJoinPres')
				}}
				onRowPress={() => {
					console.log('onRowPress')
				}}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
