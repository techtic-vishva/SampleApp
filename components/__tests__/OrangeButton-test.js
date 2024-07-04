import * as React from 'react'
import renderer from 'react-test-renderer'
import OrangeButton from '../OrangeButton'

it('render when passing the props', () => {
	const tree = renderer
		.create(
			<OrangeButton
				title="continue"
				icon="share"
				textColorOverride="#0b0805"
				outterStyle={{}}
				onLongPress={() => {
					console.log('onLogPressed')
				}}
				onPress={() => {
					console.log('onPress')
				}}
				iconLeft={false}
				disabled={false}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
