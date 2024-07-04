import * as React from 'react'
import renderer from 'react-test-renderer'
import WhiteButton from '../WhiteButton'

it('render when passing the props', () => {
	const tree = renderer
		.create(
			<WhiteButton
				onPress={() => {
					console.log('onPress')
				}}
				title={''}
				icon={''}
				outterStyle={{}}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
