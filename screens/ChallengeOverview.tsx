import { useIsFocused } from '@react-navigation/native'
import { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import JoinChallenges from '../components/JoinChallenges'
import MyChallenges from '../components/MyChallenges'
import { Text, View } from '../components/Themed'
import { chattanoogaTapWater, dichotomousHippopotamus } from '../constants/Colors'
import { ChallengesV2, joinChallenge, useChallenges, useMyChallenges } from '../core/services/challenges-v2'

function EmptyPrompt({ text }: { text: string }) {
	return (
		<View
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'transparent',
				marginTop: 20
			}}>
			<Text style={{ color: chattanoogaTapWater, textAlign: 'center' }}>{text}</Text>
		</View>
	)
}

function ChallengeOverview({ navigate }: { navigate: (id: string, param: any) => void }) {
	const { data, refetch } = useChallenges(true)
	const { data: myChallenges, refetch: refetchMyChallenges } = useMyChallenges(true)
	const isFocsued = useIsFocused()

	useEffect(() => {
		if (isFocsued) {
			refresh()
		}
	}, [isFocsued])

	const onJoinPress = (id: number) => {
		joinChallenge(id).then(() => {
			refresh()
		})
	}

	const refresh = () => {
		refetch()
		refetchMyChallenges()
	}

	const onShowAll = (isUserChallenges: boolean) => {
		navigate('AllChallenges', { isUserChallenges })
	}

	const onChallengeTap = (challenge: ChallengesV2) => {
		navigate('ChallengeScreen', { challengeId: challenge.id })
	}

	return (
		<View
			style={{
				alignItems: 'center',
				flexGrow: 1,
				backgroundColor: 'transparent',
				flexDirection: 'column',
				width: '100%',
				height: '100%'
			}}>
			<View
				style={{
					flexDirection: 'row',
					marginHorizontal: 15,
					marginBottom: 15,
					marginTop: 30,
					backgroundColor: 'transparent'
				}}>
				<Text style={{ flex: 1, fontSize: 16, fontFamily: 'objektiv-semi-bold' }}>Join a Challenge</Text>
				<TouchableOpacity onPress={() => onShowAll(false)}>
					<Text style={{ fontSize: 16, color: dichotomousHippopotamus, fontFamily: 'objektiv-semi-bold' }}>
						Show All
					</Text>
				</TouchableOpacity>
			</View>
			<View style={{ flex: 1, width: '100%', backgroundColor: 'transparent' }}>
				{data && data.length > 0 ? (
					<JoinChallenges
						isHorizontal={true}
						challenges={data ?? []}
						onJoinPress={onJoinPress}
						onRowPress={onChallengeTap}
					/>
				) : (
					<EmptyPrompt text={'No challenges available.\nCheck back soon!'} />
				)}
			</View>
			<View
				style={{
					flexDirection: 'row',
					marginHorizontal: 15,
					marginTop: 10,
					marginBottom: 15,
					backgroundColor: 'transparent'
				}}>
				<Text style={{ flex: 1, fontSize: 16, fontFamily: 'objektiv-semi-bold' }}>My Challenges</Text>
				<TouchableOpacity
					onPress={() => {
						onShowAll(true)
					}}>
					<Text style={{ fontSize: 16, color: dichotomousHippopotamus, fontFamily: 'objektiv-semi-bold' }}>
						Show All
					</Text>
				</TouchableOpacity>
			</View>
			<View style={{ flex: 1, width: '100%', backgroundColor: 'transparent' }}>
				{myChallenges && myChallenges.length > 0 ? (
					<MyChallenges challenges={myChallenges ?? []} onRowPress={onChallengeTap} />
				) : (
					<EmptyPrompt text="Join a new challenge to get started." />
				)}
			</View>
		</View>
	)
}

export default ChallengeOverview
