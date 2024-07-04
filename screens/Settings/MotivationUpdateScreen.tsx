import { SettingsTabScreenProps } from '../../types'
import React, { useState } from 'react'
import { update } from '../../core/services/user'
import MotivationSelector from '../../components/MotivationSelector'
import OrangeButton from '../../components/OrangeButton'
import BaseScreen from '../BaseScreen'
import { Platform } from 'react-native'

export default function MotivationUpdateScreen({ navigation }: SettingsTabScreenProps<'Motivation'>) {
	const [selected, setSelected] = useState<string[]>()

	async function next() {
		update({ persona: selected })
		navigation.goBack()
	}

	function onChange(persona: string[]) {
		setSelected(persona)
	}

	return (
		<BaseScreen>
			<MotivationSelector onChange={onChange}>
				<OrangeButton
					outterStyle={{ width: '90%', marginTop: 'auto', marginBottom: Platform.OS === 'ios' ? 60 : 20 }}
					onPress={next}
					title="Save"></OrangeButton>
			</MotivationSelector>
		</BaseScreen>
	)
}
