import { useState } from 'react'
import GoalSelector from '../components/GoalSelector'
import OrangeButton from '../components/OrangeButton'
import { setGoal } from '../core/services/user'
import { RootStackScreenProps } from '../types'
import BaseScreen from './BaseScreen'

export default function GoalModalScreen({ navigation, route }: RootStackScreenProps<'GoalModal'>) {
	const [interval, setInterval] = useState('0:24')

	function next() {
		setGoal(interval)
		navigation.goBack()
	}

	const onChange = (date: Date, interval: string) => {
		setInterval(interval)
	}

	return (
		<BaseScreen>
			<GoalSelector onChange={onChange} value={route.params.value}>
				<OrangeButton title="Save" onPress={next} outterStyle={{ width: '90%', marginBottom: 'auto' }} />
			</GoalSelector>
		</BaseScreen>
	)
}
