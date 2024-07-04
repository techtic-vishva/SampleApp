import * as React from 'react'
import renderer from 'react-test-renderer'
import DateCircle from '../DateCircle'

it('render when passing the props', () => {
	const tree = renderer
		.create(
			<DateCircle
				progress={0}
				lineWidth={3}
				widthPercent={0.1}
				goalProgress={0}
				colorOverride={'#000000'}
				includeShadow={false}
				widthPixels={50}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
