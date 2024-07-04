import { format } from 'date-fns'
import { FlatList, Image, TouchableOpacity } from 'react-native'
import { chattanoogaTapWater, fill } from '../constants/Colors'
import { stripTimestampAndParseDate } from '../core/format'
import { ChallengesV2 } from '../core/services/challenges-v2'
import ProgressBar from './ProgressBar'
import { Text, View } from './Themed'

export default function ({
	challenges,
	onRowPress
}: {
	challenges: ChallengesV2[]
	onRowPress: (challenge: ChallengesV2) => void
}) {
	const renderChallenge = ({ item, index }: { item: ChallengesV2; index: number }) => {
		const isCompleted = item.status == 'success' || item.count >= item.max

		return (
			<View
				style={{
					width: '100%',
					backgroundColor: fill,
					marginTop: 10,
					marginBottom: 10,
					marginEnd: 15,
					borderRadius: 8,
					padding: 12,
					alignItems: 'center',
					flexDirection: 'column'
				}}>
				<TouchableOpacity
					key={index}
					onPress={() => {
						onRowPress(item)
					}}
					style={{
						flexDirection: 'row'
					}}>
					<Image
						source={{ uri: item.badgeUrl, cache: 'force-cache' }}
						resizeMode={'stretch'}
						style={{
							width: 50,
							height: 50,
							opacity: isCompleted ? 1 : 0.2
						}}
					/>
					<View style={{ backgroundColor: 'transparent', marginStart: 10, flex: 1 }}>
						<Text style={{ fontFamily: 'objektiv-semi-bold', fontSize: 16 }}>{item.title}</Text>
						<ProgressBar count={item.count} max={item.max} />
						<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
							<Text style={{ color: chattanoogaTapWater }}>
								{item.count} of {item.max} {item.valueDescription}
								{!isCompleted && ` - Ends ${format(stripTimestampAndParseDate(item.end), 'MMMM dd')}`}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
	return (
		<View
			style={{
				alignItems: 'center',
				flex: 1,
				marginHorizontal: 15,
				flexDirection: 'column',
				backgroundColor: 'transparent'
			}}>
			<FlatList style={{ width: '100%', flexDirection: 'column' }} data={challenges} renderItem={renderChallenge} />
		</View>
	)
}
