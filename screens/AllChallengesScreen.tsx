import { useIsFocused } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import JoinChallenges from '../components/JoinChallenges'
import MyChallenges from '../components/MyChallenges'
import { Text, View } from '../components/Themed'
import { chattanoogaTapWater } from '../constants/Colors'
import { ChallengesV2, joinChallenge, useChallenges, useMyChallenges } from '../core/services/challenges-v2'
import { RootStackScreenProps } from '../types'

function EmptyPrompt() {
	return (
		<View style={{ flex: 1, marginTop: 100, alignItems: 'center', backgroundColor: 'transparent' }}>
			<Text>No Challenges Available</Text>
		</View>
	)
}

const bucketChallengesByStatus = (challenges: ChallengesV2[]) => {
	const challengeList = []

	const inProgress = challenges.filter((challenge) => challenge.status === 'in-progress')
	const expired = challenges.filter((challenge) => challenge.status === 'expired')
	const success = challenges.filter((challenge) => challenge.status === 'success')
	const upComing = challenges.filter((challenge) => challenge.status === 'upcoming')

	inProgress.length > 0 && challengeList.push({ status: 'In Progress', challenges: inProgress })
	upComing.length > 0 && challengeList.push({ status: 'Upcoming', challenges: upComing })
	success.length > 0 && challengeList.push({ status: 'Complete', challenges: success })
	expired.length > 0 && challengeList.push({ status: 'Past', challenges: expired })

	return challengeList
}

export default function AllChallengesScreen({ navigation, route }: RootStackScreenProps<'AllChallenges'>) {
	const { isUserChallenges } = route.params

	const { data, refetch } = useChallenges(false)
	const { data: myChallenges, refetch: refetchMyChallenge } = useMyChallenges(false)
	const [challenges, setChallenges] = useState(
		bucketChallengesByStatus(isUserChallenges ? myChallenges ?? [] : data ?? [])
	)
	const isFocsued = useIsFocused()

	// Need to set challenges when data is loaded
	useEffect(() => {
		if (data && myChallenges) {
			setChallenges(bucketChallengesByStatus(isUserChallenges ? myChallenges : data))
		}
	}, [data, myChallenges])

	// Refetch on focus
	useEffect(() => {
		if (isFocsued) {
			if (isUserChallenges) refetchMyChallenge()
			else refetch()
		}
	}, [isFocsued])

	const onJoinPress = (id: number) => {
		joinChallenge(id).then(() => {
			refetch()
		})
	}

	const onChallengeTap = (challenge: ChallengesV2) => {
		navigation.navigate('ChallengeScreen', { challengeId: challenge.id })
	}

	return (
		<View style={styles.container}>
			<View style={{ flex: 1, width: '100%', backgroundColor: 'transparent' }}>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={challenges}
					ListEmptyComponent={EmptyPrompt()}
					contentContainerStyle={{ paddingBottom: 230 }}
					renderItem={({ item, index }) => {
						if (item.challenges.length === 0) return null

						return (
							<View style={{ backgroundColor: 'transparent' }}>
								<View
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										marginTop: index > 0 ? 10 : 0,
										marginHorizontal: 15,
										backgroundColor: 'transparent'
									}}>
									<Text style={{ fontSize: 14, color: chattanoogaTapWater, fontFamily: 'objektiv' }}>
										{item.status}
									</Text>
									<View
										style={{ flex: 1, height: 1, marginRight: 5, marginLeft: 10 }}
										lightColor="#eee"
										darkColor="rgba(255,255,255,0.1)"
									/>
								</View>
								{isUserChallenges ? (
									<MyChallenges challenges={item.challenges} onRowPress={onChallengeTap} />
								) : (
									<JoinChallenges
										isHorizontal={false}
										challenges={item.challenges}
										onJoinPress={onJoinPress}
										onRowPress={onChallengeTap}
									/>
								)}
							</View>
						)
					}}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: 'transparent',
		flexDirection: 'column',
		paddingTop: 100
	}
})
