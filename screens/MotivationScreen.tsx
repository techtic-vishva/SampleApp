import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Image, ScrollView, Dimensions, Pressable } from 'react-native'
import { Text, View } from '../components/Themed'
import { chattanoogaTapWater, darkArts, dichotomousHippopotamus, employeeParking, fill } from '../constants/Colors'
import { RootTabScreenProps } from '../types'
import BaseScreen from './BaseScreen'
import { useUserAchievements, useAchievements, Achievement } from '../core/services/achievement'
import Loading from '../components/Loading'
import { format } from 'date-fns'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ChallengeOverview from './ChallengeOverview'
import { ChallengesV2, useMyChallenges } from '../core/services/challenges-v2'

const Tab = createMaterialTopTabNavigator()

function Achivements(props: {
	highlightAchievementCode?: string | undefined
	navigate: (id: string, param: any) => void
}) {
	const { data: achievementBank, isLoading: isAchievementBankLoading, refetch: refetchBank } = useAchievements()
	const {
		data: userAchievements,
		isLoading: isUserAchievementsLoading,
		refetch: refetchUserAchieved
	} = useUserAchievements()
	const { data: myChallenges, refetch: refetchMyChallenge } = useMyChallenges(false)
	const [challengesBadges, setChallengeBadges] = useState<{ achivement: Achievement; userChallenge: ChallengesV2 }[]>()
	const isFocsued = useIsFocused()

	useEffect(() => {
		if (isFocsued) {
			refetchUserAchieved()
			refetchBank()
			refetchMyChallenge()
		}
	}, [isFocsued])

	useEffect(() => {
		const userChallenges = []
		for (let achivement of achievementBank ?? []) {
			const userChallenge = myChallenges && myChallenges.find((ua) => ua.achievementId === achivement.id)

			if (userChallenge) {
				const challenge = { achivement, userChallenge }
				userChallenges.push(challenge)
			}
		}
		setChallengeBadges(userChallenges)
	}, [myChallenges])

	if (
		isAchievementBankLoading ||
		isUserAchievementsLoading ||
		!Array.isArray(achievementBank) ||
		!Array.isArray(userAchievements)
	) {
		return <Loading />
	}

	const AchivementView = ({
		isHighlighed,
		userAchivedDate,
		userAchieved,
		item,
		onBadgePress
	}: {
		isHighlighed?: boolean
		userAchivedDate: { achievementId: number; insertedOn: string } | undefined
		userAchieved: boolean
		item: Achievement
		onBadgePress?: () => void
	}) => {
		return (
			<>
				<Pressable
					onPress={onBadgePress}
					style={[
						{
							width: 50,
							height: 50
						},
						isHighlighed
							? {
									shadowColor: dichotomousHippopotamus,
									shadowOpacity: 1,
									shadowRadius: 15,
									shadowOffset: {
										height: 0,
										width: 0
									},
									elevation: 24
							  }
							: {}
					]}>
					<Image
						source={{ uri: item.badgeUrl, width: 50, height: 50, cache: 'force-cache' }}
						resizeMode={'stretch'}
						style={{
							opacity: userAchieved ? 1 : 0.2
						}}
					/>
				</Pressable>
				<Text style={[{ fontSize: 11, paddingTop: 5 }]}>{item.displayName}</Text>
				{userAchivedDate?.insertedOn && (
					<Text style={[{ fontSize: 11, paddingTop: 5, color: chattanoogaTapWater, fontFamily: 'objektiv-semi-bold' }]}>
						{format(new Date(userAchivedDate.insertedOn), 'MMM dd, yyyy')}
					</Text>
				)}
			</>
		)
	}

	return (
		<View
			style={{
				flex: 1,
				height: '100%',
				width: '100%'
			}}>
			<ScrollView
				contentContainerStyle={{
					paddingTop: 30,
					flexDirection: 'row',
					flexWrap: 'wrap'
				}}>
				{achievementBank?.map((a) => {
					const userAchieved = userAchievements.some((ua) => ua.achievementId === a.id)
					const userAchivedDate = userAchievements?.find((ua) => ua.achievementId === a.id)
					const isHighlighed = props.highlightAchievementCode === a.code
					if (a.type === 'CHALLENGE') return null

					return (
						<View
							key={a.id}
							style={{
								width: Dimensions.get('screen').width / 3,
								height: 120,
								alignItems: 'center',
								backgroundColor: 'transparent'
							}}>
							<AchivementView
								isHighlighed={isHighlighed}
								userAchivedDate={userAchivedDate ?? undefined}
								userAchieved={userAchieved}
								item={a}
							/>
						</View>
					)
				})}
				<View style={{ backgroundColor: 'transparent', width: '100%' }}>
					<Text style={{ textAlign: 'center', flex: 1, fontSize: 20, fontFamily: 'objektiv-semi-bold' }}>
						Challenge Badges
					</Text>
					<View
						style={{
							paddingTop: 30,
							flexDirection: 'row',
							flexWrap: 'wrap'
						}}>
						{challengesBadges?.map((a) => {
							const userAchieved = userAchievements.some((ua) => ua.achievementId === a.achivement.id)
							const userAchivedDate = userAchievements?.find((ua) => ua.achievementId === a.achivement.id)
							if (a.userChallenge.status === 'expired') return null
							return (
								<View
									key={a.achivement.id}
									style={{
										width: Dimensions.get('screen').width / 3,
										height: 120,
										alignItems: 'center',
										backgroundColor: 'transparent'
									}}>
									<AchivementView
										userAchivedDate={userAchivedDate ?? undefined}
										userAchieved={userAchieved}
										item={a.achivement}
										onBadgePress={() => {
											props.navigate('ChallengeScreen', { challengeId: a.userChallenge.id })
										}}
									/>
								</View>
							)
						})}
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

export const tabMap = {
	challenges: 'Challenges',
	achievements: 'Achievements'
}

export default function MotivationScreenTab({ navigation, route }: RootTabScreenProps<'MotivationTab'>) {
	const highlightAchievementCode = route.params?.highlightAchievementCode

	// Default tab
	let initialTabName = tabMap.challenges
	if ((route.params?.initialRouteName || 'challenges').toLowerCase() == 'achievements')
		initialTabName = tabMap.achievements
	if (highlightAchievementCode) initialTabName = tabMap.achievements

	useEffect(() => {
		if (!highlightAchievementCode) return
		const unsubscribe = navigation.addListener('blur', () => {
			navigation.setParams({ highlightAchievementCode: undefined })
		})

		return unsubscribe
	})

	return (
		<BaseScreen>
			<View style={styles.container}>
				<Tab.Navigator
					initialRouteName={initialTabName}
					offscreenPageLimit={0}
					screenOptions={{
						tabBarContentContainerStyle: {
							borderBottomColor: fill,
							borderBottomWidth: 0.5
						},
						tabBarActiveTintColor: employeeParking,
						tabBarIndicatorStyle: {
							backgroundColor: dichotomousHippopotamus,
							height: 3
						},
						tabBarLabelStyle: { fontSize: 14, fontFamily: 'objektiv-md', textTransform: 'none' },
						tabBarStyle: {
							backgroundColor: 'transparent',
							width: '100%',
							marginLeft: 'auto',
							marginRight: 'auto'
						}
					}}>
					<Tab.Screen name={tabMap.challenges} children={() => <ChallengeOverview navigate={navigation.navigate} />} />
					<Tab.Screen
						name={tabMap.achievements}
						children={() => (
							<Achivements highlightAchievementCode={highlightAchievementCode} navigate={navigation.navigate} />
						)}
					/>
				</Tab.Navigator>
			</View>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 40,
		width: '100%',
		height: '100%',
		backgroundColor: '#121212'
	}
})
