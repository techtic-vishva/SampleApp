import { Entypo } from '@expo/vector-icons'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { HeaderText } from '../components/StyledText'
import { Text, View } from '../components/Themed'
import { chattanoogaTapWater, dichotomousHippopotamus, fill } from '../constants/Colors'
import { OnboardingTabScreenProps } from '../types'
import SharedStyles from '../constants/Styles'
import { setGoalWithType, update, useUser } from '../core/services/user'
import AroTip from '../components/AroTip'
import { setIsOnboarded } from '../core/GlobalState'

type Goals = {
	title: string
	description: string
	goal: string
	goalType: string
	icon: React.ComponentProps<typeof Entypo>['name']
}

export default function SelectGoalScreen({ navigation, route }: OnboardingTabScreenProps<'SelectGoal'>) {
	const { data } = useUser()

	const goals: Goals[] = [
		{
			title: 'Beginner',
			goal: '0:30',
			goalType: 'B',
			description: 'Ease into Aro with an approachable goal to kickstart your journey.',
			icon: 'progress-one'
		},
		{
			title: 'Intermediate',
			goal: '1:30',
			goalType: 'I',
			description: 'Start strong and set your goal to the average Aro time of other users like you.',
			icon: 'progress-two'
		},
		{
			title: 'Expert',
			goal: route.params.expertGoal,
			goalType: 'E',
			description: 'Go "Screen Time Neutral" and offset your device usage.',
			icon: 'progress-full'
		}
	]

	function onGoalPress(item: Goals) {
		setGoalWithType(item.goal, item?.goalType).finally(() => {
			if (data?.metadata?.reonboard) {
				// Temporariy to reonboard users
				update({ metadata: { hasOnboarded: true, reonboard: false } }).then(() => setIsOnboarded(true, true))
			} else {
				navigation.navigate('PermissionsPreview')
			}
		})
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={{ width: '90%', alignItems: 'center' }}>
				<HeaderText style={styles.title}>Select a Goal</HeaderText>
				<Text style={{ fontSize: 16, width: '90%', textAlign: 'center', marginBottom: 30 }}>
					How much time would you like to spend apart from your phone each day?
				</Text>
			</View>

			{/* Options */}
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				{goals.map((item, i) => {
					let [hourS, minS] = item.goal.split(':')
					const hour = parseInt(hourS, 10)
					const min = parseInt(minS, 10)

					return (
						<TouchableOpacity key={i} style={styles.goalContainer} onPress={() => onGoalPress(item)}>
							<View style={{ backgroundColor: 'transparent' }}>
								<Entypo name={item.icon} size={22} color={dichotomousHippopotamus} />
							</View>
							<View
								style={{
									flexDirection: 'column',
									backgroundColor: 'transparent',
									paddingHorizontal: 15,
									width: '98%'
								}}>
								<View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
									<Text style={{ fontFamily: 'objektiv-semi-bold', fontSize: 18, marginBottom: 3 }}>{item.title}</Text>
									<Text
										style={{
											fontFamily: 'objektiv-semi-bold',
											fontSize: 17,
											color: chattanoogaTapWater,
											flex: 1,
											textAlign: 'right'
										}}>
										{hour && hour != 0 ? `${hour} hr ` : ''}
										<Text style={{ fontFamily: 'objektiv-semi-bold', fontSize: 17, color: chattanoogaTapWater }}>{`${
											min ?? 0
										} min`}</Text>
									</Text>
								</View>
								<Text style={{ fontFamily: 'objektiv', fontSize: 14 }}>{item.description}</Text>
							</View>
						</TouchableOpacity>
					)
				})}
			</View>

			{/* Tip */}
			<View style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}>
				<AroTip message="Aro will provide intelligent goal recommendations as you use Aro. Your goal can be adjusted at any time." />
			</View>

			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</View>
	)
}

const goalWidth = '95%'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 60,
		justifyContent: 'space-evenly'
	},
	title: {
		fontSize: 25,
		marginBottom: 10
	},
	goalContainer: {
		display: 'flex',
		flexDirection: 'row',
		padding: 18,
		marginVertical: 13,
		backgroundColor: fill,
		borderRadius: 20,
		width: goalWidth,
		maxWidth: goalWidth,
		minWidth: goalWidth,
		alignItems: 'center'
	}
})
