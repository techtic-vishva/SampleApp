import * as React from 'react'
import renderer from 'react-test-renderer'
import RingProgress from '../RingProgress'

it('render when passing the props', () => {
	const tree = renderer
		.create(
			<RingProgress
				progress={{ value: 0 * 100 }}
				goal={{}}
				achieved={{}}
				sessionCount={0}
				streakLength={0}
				onEditGoal={() => {
					console.log('On Edit Press')
				}}
				sizeScalerOverride={0.55}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
