import { FontAwesome } from '@expo/vector-icons'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { HeaderText } from '../../components/StyledText'
import { Text, View } from '../../components/Themed'
import { chattanoogaTapWater, dichotomousHippopotamus, fill } from '../../constants/Colors'
import { OnboardingTabScreenProps } from '../../types'
import SharedStyles from '../../constants/Styles'
import * as Linking from 'expo-linking'
import { update } from '../../core/services/user'

type ScreenTime = {
	title: string
	goal: string
	goalLable: string
	icon: React.ComponentProps<typeof FontAwesome>['name']
}

export default function PulseScreen({ navigation, route }: OnboardingTabScreenProps<'Pulse'>) {
	const goals: ScreenTime[] = [
		{
			title: 'A little',
			goal: '2:00',
			goalLable: '< 2 hours',
			icon: 'battery-3'
		},
		{
			title: 'A fair amount',
			goal: '3:00',
			goalLable: '2-4 hours',
			icon: 'battery-2'
		},
		{
			title: 'A lot',
			goal: '5:00',
			goalLable: '4-6 hours',
			icon: 'battery-1'
		},
		{
			title: 'A whole lot!!!',
			goal: '6:00',
			goalLable: '> 6 hours',
			icon: 'battery-empty'
		}
	]

	async function onGoalPress(item: ScreenTime) {
		await update({ metadata: { screenTimePulse: item.goal } })
		navigation.navigate('GoalLoading', { expertGoal: item.goal })
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={{ width: '90%', alignItems: 'center' }}>
				<HeaderText style={styles.title}>Screen Time</HeaderText>
				<Text style={{ fontSize: 16, width: '90%', textAlign: 'center', marginBottom: 30 }}>
					How much time per day do you spend on your smartphone?
				</Text>
			</View>

			{/* Options */}
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				{goals.map((item, i) => {
					return (
						<TouchableOpacity key={i} style={styles.goalContainer} onPress={() => onGoalPress(item)}>
							<View style={{ backgroundColor: 'transparent' }}>
								<FontAwesome name={item.icon} size={22} color={dichotomousHippopotamus} />
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
										{item.goalLable}
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					)
				})}
			</View>

			<View style={{ marginBottom: 60, justifyContent: 'space-around', paddingVertical: 10, width: '90%' }}>
				{Platform.OS == 'ios' && (
					<Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 30 }}>
						{`Not sure?  `}
						<TouchableOpacity
							onPress={() => {
								Linking.openURL('App-Prefs:SCREEN_TIME')
							}}>
							<Text style={{ textDecorationLine: 'underline' }}>Check your Screen Time report.</Text>
						</TouchableOpacity>
					</Text>
				)}
				<Text
					style={{
						fontSize: 16,
						textAlign: 'center',
						color: chattanoogaTapWater
					}}>
					Did you know that the average person spends over 3 hours per day on thier phone?
				</Text>
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
		paddingTop: 100
	},
	title: {
		fontSize: 25,
		marginBottom: 10
	},
	goalContainer: {
		display: 'flex',
		flexDirection: 'row',
		padding: 18,
		marginVertical: 10,
		backgroundColor: fill,
		borderRadius: 20,
		width: goalWidth,
		maxWidth: goalWidth,
		minWidth: goalWidth,
		alignItems: 'center'
	}
})
