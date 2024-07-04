import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { View, Text } from '../components/Themed'
import { OnboardingTabScreenProps } from '../types'
import { setSurveyResponse, useSurveyQuestions } from '../core/services/user'
import { HeaderText } from '../components/StyledText'
import OrangeButton from '../components/OrangeButton'
import SteppedNavigationFooter from '../components/SteppedNavigationFooter'
import WhiteButton from '../components/WhiteButton'
import { chattanoogaTapWater } from '../constants/Colors'
import Loading from '../components/Loading'
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated'

export default function SurveyScreen({ navigation, route }: OnboardingTabScreenProps<'Survey'>) {
	const { data } = useSurveyQuestions(route.params.surveyId)
	const [selectedIndex, setSelectedIndex] = useState(0)

	function onNextQuestion() {
		if (!data?.questions) return

		// Questions Remaining
		if (selectedIndex < data?.questions.length - 1) {
			setSelectedIndex(selectedIndex + 1)
		} else {
			// No more questions, go to next screen
			navigation.navigate('Pulse')
		}
	}

	const onSurveyResponse = (answer: boolean) => {
		if (!data) return
		setSurveyResponse(data.id, data.questions[selectedIndex].id, answer).then(onNextQuestion)
	}

	if (!data) {
		return <Loading />
	}

	return (
		<View style={[styles.container]}>
			<Text style={{ width: '80%', textAlign: 'center', color: chattanoogaTapWater, fontSize: 18 }}>
				For each statement, select{'\n'}"Agree" or "Disagree."
			</Text>
			<Animated.View
				style={{ flex: 1, width: '100%', alignItems: 'center' }}
				key={selectedIndex}
				entering={SlideInRight.springify().stiffness(90).damping(12)}
				exiting={SlideOutLeft}>
				<HeaderText style={[styles.question]} numberOfLines={6} adjustsFontSizeToFit>
					<Text style={{ color: chattanoogaTapWater }}>“</Text> {data?.questions[selectedIndex].question}{' '}
					<Text style={{ color: chattanoogaTapWater }}>”</Text>
				</HeaderText>
			</Animated.View>

			<View
				style={{
					width: '90%',
					flexDirection: 'row',
					marginTop: 'auto',
					justifyContent: 'space-between'
				}}>
				<WhiteButton onPress={() => onSurveyResponse(false)} title="Disagree" outterStyle={{ width: '47%' }} />
				<OrangeButton onPress={() => onSurveyResponse(true)} title="Agree" outterStyle={{ width: '47%' }} />
			</View>
			<SteppedNavigationFooter activeStep={selectedIndex + 1} totalSteps={data?.questions.length} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 100,
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1
	},
	question: {
		fontSize: 42,
		textAlign: 'center',
		color: 'white',
		lineHeight: 60,
		width: '90%',
		marginTop: 'auto',
		marginBottom: 'auto',
		fontFamily: 'objektiv-semi-bold'
	}
})
