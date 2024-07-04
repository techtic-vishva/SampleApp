import { useActionSheet } from '@expo/react-native-action-sheet'
import { format, isPast, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native'
import DynamicIcon from '../components/DynamicIcon'
import Loading from '../components/Loading'
import OrangeButton from '../components/OrangeButton'
import ProgressBar from '../components/ProgressBar'
import { Text, View } from '../components/Themed'
import {
	chattanoogaTapWater,
	dichotomousHippopotamusDisabled,
	employeeParking,
	fill,
	dichotomousHippopotamus
} from '../constants/Colors'
import { stripTimestampAndParseDate } from '../core/format'
import {
	ChallengesV2,
	joinChallenge,
	leaveChallenge,
	useChallenge,
	useLeaderboard
} from '../core/services/challenges-v2'
import { RootStackScreenProps } from '../types'
import BaseScreen from './BaseScreen'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import UserAvatar from '../components/UserAvatar'
import { orderBy } from 'lodash'
import { useIsFocused } from '@react-navigation/native'
import { useUser } from '../core/services/user'

function Overview({
	challenge,
	isUserChallenge,
	onJoinPress,
	isJoinDisabled,
	isChallengeComplete,
	members
}: {
	challenge: ChallengesV2 & { userHasJoined: boolean }
	isUserChallenge: boolean
	onJoinPress: () => void
	isJoinDisabled: boolean
	isChallengeComplete: boolean
	members: number
}) {
	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 350 }}>
			<View style={{ backgroundColor: 'transparent', flex: 1, marginHorizontal: 20 }}>
				{/* Title */}
				<View style={{ backgroundColor: 'transparent', flex: 1 }}>
					{isUserChallenge ? (
						<>
							<Text style={{ fontFamily: 'objektiv', fontSize: 16, marginTop: 15 }}>
								{isChallengeComplete ? 'Challenge Complete!' : isJoinDisabled ? 'Challenge Ended' : 'Progress'}
							</Text>
							<ProgressBar count={challenge.count} max={challenge.max} />
							<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
								<Text
									style={{
										color: chattanoogaTapWater
									}}>
									{challenge.count} of {challenge.max} {challenge.valueDescription}
									{!isChallengeComplete &&
										` - ${isJoinDisabled ? 'Ended' : 'Ends'} ${format(
											stripTimestampAndParseDate(challenge.end),
											'MMMM dd'
										)}`}
								</Text>
							</View>
						</>
					) : (
						<>
							<Text
								style={{
									marginTop: 20,
									fontSize: 13,
									color: chattanoogaTapWater
								}}>
								{challenge.description}
							</Text>
							<OrangeButton
								onPress={onJoinPress}
								disabled={isJoinDisabled}
								title={
									isJoinDisabled
										? `Challenge Ended ${format(stripTimestampAndParseDate(challenge.end), 'MMMM dd')}`
										: 'Join Challenge'
								}
								outterStyle={{ width: '100%', paddingVertical: 7, marginTop: 30 }}
							/>
							{!isJoinDisabled && (
								<Text
									style={{
										fontFamily: 'objektiv-semi-bold',
										color: dichotomousHippopotamus,
										marginTop: 20,
										fontSize: 12,
										alignSelf: 'center'
									}}>
									{members} members {challenge.status === 'upcoming' ? 'have joined' : 'participating'}
								</Text>
							)}
						</>
					)}
				</View>
				{/* Criteria List */}
				{challenge.criteria !== null && (
					<View style={{ marginTop: 40, backgroundColor: 'transparent' }}>
						{challenge.criteria.map((item, i) => (
							<View
								key={i}
								style={{
									flexDirection: 'row',
									marginBottom: 15,
									backgroundColor: 'transparent'
								}}>
								<Image
									source={require('../assets/images/arobot-1.png')}
									style={{
										height: 24,
										width: 24,
										resizeMode: 'contain',
										marginRight: 15,
										tintColor: chattanoogaTapWater
									}}
								/>
								<Text style={{ color: 'white', flex: 1 }}>{item}</Text>
							</View>
						))}
					</View>
				)}
				{/* Bottom Description */}
				{isUserChallenge && (
					<Text style={{ marginTop: 30, fontSize: 14, color: chattanoogaTapWater }}>
						{isChallengeComplete ? challenge.successDescription : challenge.description}
					</Text>
				)}
			</View>
		</ScrollView>
	)
}

function Leaderboard({ challengeId, members }: { challengeId: number; members: number }) {
	const { data: leaderBoard, refetch } = useLeaderboard(challengeId)
	const { data: user } = useUser()
	const isFocsued = useIsFocused()

	useEffect(() => {
		if (isFocsued) {
			refetch()
		}
	}, [isFocsued])

	return (
		<ScrollView
			style={{ flex: 1 }}
			contentContainerStyle={{ alignItems: 'center', flexGrow: 1, paddingTop: 20, paddingBottom: 20 }}>
			{leaderBoard && leaderBoard.length > 0 ? (
				<>
					<Text
						style={{
							fontFamily: 'objektiv-semi-bold',
							color: dichotomousHippopotamus,
							marginBottom: 20,
							fontSize: 12,
							alignSelf: 'flex-end',
							marginEnd: 20
						}}>
						{members} members participating
					</Text>
					{orderBy(leaderBoard, ['count'], ['desc']).map((item, index) => {
						const isSelf = item.userid && user?.userid === item.userid
						let name = item.name || ''
						let avatar = item.avatarUrl || ''

						return (
							<View
								key={index}
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									width: '92%',
									backgroundColor: fill,
									borderRadius: 15,
									marginBottom: 20,
									paddingHorizontal: 20,
									paddingVertical: 20
								}}>
								<UserAvatar
									user={{ fullname: name || '', avatar: avatar || '' }}
									size="medium"
									style={[{ borderColor: fill, borderWidth: 1 }, { margin: 3 }]}
								/>

								<Text
									style={{
										fontFamily: 'objektiv-md',
										fontSize: 16,
										paddingRight: 5,
										flex: 1,
										marginStart: 10,
										color: isSelf ? dichotomousHippopotamus : 'white'
									}}
									numberOfLines={1}>
									{name}{' '}
								</Text>
								<Text
									style={{
										fontFamily: 'objektiv-semi-bold',
										fontSize: 14,
										color: isSelf ? dichotomousHippopotamus : 'white'
									}}>
									{item.count}
								</Text>
							</View>
						)
					})}
				</>
			) : (
				<Text style={{ color: chattanoogaTapWater, textAlign: 'center', marginTop: 50 }}>No Data found</Text>
			)}
		</ScrollView>
	)
}

const tabMap = {
	overview: 'Overview',
	leaderboard: 'Leaderboard'
}

const Tab = createMaterialTopTabNavigator()

export default function ChallengeScreen({ navigation, route }: RootStackScreenProps<'ChallengeScreen'>) {
	const { data: challenge, isLoading, refetch } = useChallenge(route.params.challengeId)
	const [isJoinDisabled, setIsJoinDisabled] = useState(false)
	const [isUserChallenge, setIsUserChallenge] = useState(false)
	const { showActionSheetWithOptions } = useActionSheet()

	const isFocsued = useIsFocused()

	useEffect(() => {
		if (isFocsued) {
			refetch()
		}
	}, [isFocsued])

	useEffect(() => {
		if (!challenge) return
		setIsJoinDisabled(isPast(parseISO(challenge.end)))
		setIsUserChallenge(challenge.userHasJoined)
	}, [challenge])

	const onJoinPress = () => {
		if (!challenge) return

		joinChallenge(challenge.id).then(() => {
			navigation.goBack()
		})
	}

	const onLeavePress = async () => {
		if (!challenge) return
		await leaveChallenge(challenge.id)
		navigation.goBack()
	}

	useEffect(() => {
		if (!isUserChallenge) return
		navigation.setOptions({
			headerRight: () => (
				<Pressable
					onPress={() => onLeaveChallenge()}
					style={({ pressed }) => ({
						opacity: pressed ? 0.5 : 1,
						display: isUserChallenge ? 'flex' : 'none'
					})}>
					<DynamicIcon name={'dots-three-horizontal'} type="entypo" color={employeeParking} size={20} />
				</Pressable>
			)
		})
	}, [isUserChallenge])

	const onLeaveChallenge = () => {
		let options = ['Leave Challenge', 'Cancel']
		let cancelButtonIndex = 1

		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex
			},
			(buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						onLeavePress()
						break
					default:
						break
				}
			}
		)
	}

	if (!challenge || isLoading) return <Loading />

	const isChallengeComplete = challenge.count >= challenge.max

	return (
		<BaseScreen>
			<View style={styles.container}>
				<Image
					source={{
						uri: challenge.thumbnailUrl,
						cache: 'force-cache'
					}}
					style={{ height: 300, width: '100%', resizeMode: 'cover' }}
				/>

				<Image
					source={{ uri: challenge.badgeUrl, cache: 'force-cache' }}
					resizeMode={'stretch'}
					style={{
						width: 50,
						height: 50,
						marginBottom: 10,
						marginTop: -25,
						marginStart: 20,
						opacity: isUserChallenge ? (challenge.status == 'success' ? 1 : 0.5) : 1
					}}
				/>
				<Text style={{ marginTop: 15, marginHorizontal: 20, fontFamily: 'objektiv-semi-bold', fontSize: 18 }}>
					{challenge.title}
				</Text>
				{/* Content Body */}
				{isUserChallenge ? (
					<>
						{challenge.leaderboardEnabled ? (
							<View
								style={{
									backgroundColor: 'transparent',
									flex: 1
								}}>
								<Tab.Navigator
									screenOptions={{
										tabBarContentContainerStyle: {
											borderBottomColor: fill,
											borderBottomWidth: 0.5
										},
										tabBarActiveTintColor: employeeParking,
										tabBarIndicatorStyle: {
											backgroundColor: dichotomousHippopotamusDisabled,
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
									<Tab.Screen
										name={tabMap.overview}
										children={() => (
											<Overview
												members={challenge.members}
												challenge={challenge}
												isChallengeComplete={isChallengeComplete}
												isJoinDisabled={isJoinDisabled}
												onJoinPress={onJoinPress}
												isUserChallenge={isUserChallenge}
											/>
										)}
									/>
									<Tab.Screen
										name={tabMap.leaderboard}
										children={() => <Leaderboard members={challenge.members} challengeId={challenge.id} />}
									/>
								</Tab.Navigator>
							</View>
						) : (
							<Overview
								members={challenge.members}
								challenge={challenge}
								isChallengeComplete={isChallengeComplete}
								isJoinDisabled={isJoinDisabled}
								onJoinPress={onJoinPress}
								isUserChallenge={isUserChallenge}
							/>
						)}
					</>
				) : (
					<Overview
						members={challenge.members}
						challenge={challenge}
						isChallengeComplete={isChallengeComplete}
						isJoinDisabled={isJoinDisabled}
						onJoinPress={onJoinPress}
						isUserChallenge={isUserChallenge}
					/>
				)}
			</View>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'transparent'
	}
})
