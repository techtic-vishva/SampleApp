import React from 'react'
import Step from './Step'
import { View } from './Themed'
import OrangeButton from './OrangeButton'
import { GestureResponderEvent, Platform } from 'react-native'

type OnPress = (event: GestureResponderEvent) => void

const vSpace = 30

const buttonStyleBase = {
	marginHorizontal: 20,
	// marginBottom: vSpace,
	flex: 1
}

export default function SteppedNavigationFooter({
	activeStep,
	totalSteps,
	onContinue,
	onBack,
	onSkip,
	onContinueDisabled
}: {
	activeStep: number
	totalSteps?: number
	onContinue?: OnPress
	onBack?: OnPress
	onSkip?: OnPress
	onContinueDisabled?: boolean
}) {
	let buttonCount = 0
	if (onContinue) buttonCount++
	if (onBack) buttonCount++
	if (onSkip) buttonCount++

	const leftStyle = {
		marginRight: buttonCount > 1 ? buttonStyleBase.marginHorizontal / 2 : undefined
	}
	const rightStyle = {
		marginLeft: buttonCount > 1 ? buttonStyleBase.marginHorizontal / 2 : undefined
	}

	return (
		<View style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
			<View style={{ display: 'flex', flexDirection: 'row', marginBottom: vSpace }}>
				{onSkip && (
					<OrangeButton
						onPress={onSkip}
						outterStyle={[buttonStyleBase, { backgroundColor: 'white', borderColor: 'white' }, leftStyle]}
						title="Skip"
					/>
				)}
				{onBack && (
					<OrangeButton
						onPress={onBack}
						outterStyle={[buttonStyleBase, leftStyle]}
						icon="arrow-left"
						title="Back"
						iconLeft={true}
					/>
				)}
				{onContinue && (
					<OrangeButton
						disabled={onContinueDisabled}
						onPress={onContinue}
						outterStyle={[buttonStyleBase, rightStyle]}
						icon="arrow-right"
						title="Continue"
					/>
				)}
			</View>
			{Step(activeStep, totalSteps, {
				marginBottom: Platform.OS === 'ios' ? vSpace + 30 : 20 /* +30 to compensate for swipe bar */
			})}
		</View>
	)
}
