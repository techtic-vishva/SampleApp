import * as React from 'react'
import renderer from 'react-test-renderer'

import SteppedNavigationFooter from '../SteppedNavigationFooter'

it('render when passing the props', () => {
	const tree = renderer
		.create(
			<SteppedNavigationFooter
				activeStep={1}
				totalSteps={4}
				onContinueDisabled={false}
				onContinue={() => {
					console.log('on continue pressed')
				}}
				onBack={() => {
					console.log('on back pressed')
				}}
				onSkip={() => {
					console.log('on skip pressed')
				}}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})

it('render when continue button is disable', () => {
	const tree = renderer
		.create(
			<SteppedNavigationFooter
				activeStep={1}
				totalSteps={4}
				onContinueDisabled={true}
				onContinue={() => {
					console.log('on continue pressed')
				}}
				onBack={() => {
					console.log('on back pressed')
				}}
				onSkip={() => {
					console.log('on skip pressed')
				}}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
