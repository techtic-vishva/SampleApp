import { OnboardingTabScreenProps } from '../../types'
import React, { useState } from 'react'
import SteppedNavigationFooter from '../../components/SteppedNavigationFooter'
import { update } from '../../core/services/user'
import MotivationSelector from '../../components/MotivationSelector'

export default function MotivationScreen({ navigation }: OnboardingTabScreenProps<'Motivation'>) {
	const [selected, setSelected] = useState<string[]>()

	async function next() {
		update({ persona: selected })
		navigation.navigate('Permissions', {})
	}

	function onChange(persona: string[]) {
		setSelected(persona)
	}

	return (
		<MotivationSelector onChange={onChange}>
			<SteppedNavigationFooter onContinueDisabled={!selected} onContinue={next} activeStep={1} />
		</MotivationSelector>
	)
}
