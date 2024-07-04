import { useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'
import { View, Text } from '../components/Themed'
import { OnboardingTabScreenProps } from '../types'
import SharedStyles from '../constants/Styles'
import { dichotomousHippopotamus } from '../constants/Colors'
import { useInterval } from '../hooks/useInterval'
import { useIsFocused } from '@react-navigation/native'

const messages = [
	'Processing survey...',
	'Reviewing screen time...',
	'Evaluating goals...',
	'Building your plan...',
	'Finalizing recommendations...'
]
const duration = 3000

export default function GoalLoadingScreen({ navigation, route }: OnboardingTabScreenProps<'GoalLoading'>) {
	const index = useRef(0)
	const [text, setText] = useState(messages[index.current])
	const isFocused = useIsFocused()

	useInterval(
		() => {
			index.current = index.current + 1
			if (index.current > messages.length - 1) {
				// Done cycling through labels, go to next screen
				index.current = 0
				navigation.navigate('SelectGoal', { expertGoal: route.params.expertGoal })
			}
			setText(messages[index.current])
		},
		isFocused ? 3000 : null
	)

	return (
		<View style={styles.container}>
			<Text></Text>
			<LottieView
				source={require('../assets/animations/logo-animation-orange.json')}
				loop={true}
				style={{ width: '50%', paddingTop: 5 }}
				colorFilters={[
					{
						keypath: 'ADBE Vector Group',
						color: dichotomousHippopotamus
					}
				]}
				autoPlay
				duration={duration}
			/>
			<Text style={{ fontFamily: 'objektiv-md-italic', fontSize: 20, marginTop: 40 }}>{text}</Text>
			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	}
})
