import { OnboardingTabScreenProps } from '../../types'
import React, { useState } from 'react'
import SteppedNavigationFooter from '../../components/SteppedNavigationFooter'
import { setGoal } from '../../core/services/user'
import GoalSelector from '../../components/GoalSelector'

export default function GoalScreen({ navigation }: OnboardingTabScreenProps<'Goal'>) {
	const [interval, setInterval] = useState('1:00')

	const onChange = (date: Date, interval: string) => {
		setInterval(interval)
	}

	function next() {
		setGoal(interval)
		navigation.navigate('Permissions', {})
	}

	return (
		<GoalSelector onChange={onChange}>
			<SteppedNavigationFooter activeStep={2} onBack={navigation.goBack} onContinue={next} />
		</GoalSelector>
	)
}
