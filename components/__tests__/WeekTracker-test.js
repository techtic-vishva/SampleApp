import { format } from 'date-fns'
import * as React from 'react'
import renderer from 'react-test-renderer'

import WeekTracker from '../WeekTracker'

it('render when passing the props', () => {
	const tree = renderer
		.create(
			<WeekTracker
				selectedDate={format(new Date(), 'yyyy-MM-dd')}
				data={[]}
				onPress={(dateString) => {
					console.log(dateString)
				}}
				onTouchEnd={{}}
				onTouchStart={{}}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
