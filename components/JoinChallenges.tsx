import { isPast, parseISO } from 'date-fns'
import { FlatList, Image, TouchableOpacity } from 'react-native'
import { chattanoogaTapWater, fill } from '../constants/Colors'
import { ChallengesV2 } from '../core/services/challenges-v2'
import OrangeButton from './OrangeButton'
import { Text, View } from './Themed'

export default function ({
	isHorizontal,
	onJoinPress,
	onRowPress,
	challenges
}: {
	isHorizontal?: boolean
	onJoinPress: (id: number) => void
	onRowPress: (challenge: ChallengesV2) => void
	challenges: ChallengesV2[]
}) {
	const renderChallengeBody = (item: ChallengesV2) => {
		const isJoinDisabled = isPast(parseISO(item.end))

		return (
			<>
				<Image
					source={{ uri: item.badgeUrl, cache: 'force-cache' }}
					resizeMode={'stretch'}
					style={{
						width: 50,
						height: 50,
						marginBottom: 10
					}}
				/>
				<Text
					style={{ marginBottom: 3, marginHorizontal: 6, fontFamily: 'objektiv-semi-bold' }}
					numberOfLines={1}
					ellipsizeMode="tail">
					{item.title}
				</Text>
				<Text style={{ color: chattanoogaTapWater, fontSize: 12, fontFamily: 'objektiv' }}>
					{item.shortDescription}
				</Text>
				<OrangeButton
					disabled={isJoinDisabled}
					onPress={() => onJoinPress(item.id)}
					title={isJoinDisabled ? 'View' : 'Join'}
					outterStyle={{ width: 120, paddingVertical: 8, marginTop: 10, backgroundColor: 'transparent' }}
					textColorOverride="white"
				/>
			</>
		)
	}

	const renderHorizontalChallenge = ({ item, index }: { item: ChallengesV2; index: number }) => {
		return (
			<TouchableOpacity
				key={index}
				onPress={() => onRowPress(item)}
				style={{
					backgroundColor: fill,
					width: 175,
					borderRadius: 8,
					height: 200,
					marginRight: 20,
					justifyContent: 'center',
					alignItems: 'center'
				}}>
				{renderChallengeBody(item)}
			</TouchableOpacity>
		)
	}

	const renderGridChallenge = ({ item, index }: { item: ChallengesV2; index: number }) => {
		return (
			<TouchableOpacity
				key={index}
				onPress={() => onRowPress(item)}
				style={{
					width: '47%',
					flexDirection: 'column',
					backgroundColor: fill,
					marginTop: 10,
					marginBottom: 10,
					marginEnd: 15,
					borderRadius: 8,
					justifyContent: 'center',
					alignItems: 'center',
					paddingVertical: 20
				}}>
				<View style={{ backgroundColor: 'transparent', flex: 1, alignItems: 'center' }}>
					{renderChallengeBody(item)}
				</View>
			</TouchableOpacity>
		)
	}

	return (
		<>
			{isHorizontal ? (
				<View
					style={{
						height: 220,
						width: '100%',
						paddingStart: 15,
						backgroundColor: 'transparent'
					}}>
					<FlatList data={challenges} horizontal={true} renderItem={renderHorizontalChallenge} />
				</View>
			) : (
				<View style={{ flex: 1, alignItems: 'center', marginStart: 15, marginEnd: 10, backgroundColor: 'transparent' }}>
					<FlatList style={{ width: '100%' }} data={challenges} numColumns={2} renderItem={renderGridChallenge} />
				</View>
			)}
		</>
	)
}
