import { useEffect } from 'react'
import { StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { View, Text } from './Themed'
import BaseScreen from '../screens/BaseScreen'
import { HeaderText } from './StyledText'
import UserAvatar from './UserAvatar'
import { chattanoogaTapWater } from '../constants/Colors'
import { Feather } from '@expo/vector-icons'
import { useOverView } from '../core/services/user-stats'
import { useIsFocused } from '@react-navigation/native'
import Loading from './Loading'
import { format } from 'date-fns'
import { formatDuration } from '../core/format'
import { getUser } from '../core/Authentication'

export default function GroupUserDetail({
	userId,
	includeOvernight,
	style,
	includeHeader
}: {
	userId: string
	includeOvernight: boolean
	style?: StyleProp<ViewStyle>
	includeHeader?: boolean
}) {
	includeHeader = includeHeader === undefined ? true : includeHeader
	const { data, refetch, isFetching } = useOverView(userId, includeOvernight)
	const isFocused = useIsFocused()

	useEffect(() => {
		if (!isFetching && isFocused) {
			refetch()
		}
	}, [isFocused])

	if (!data) return <Loading />

	let streakText = '---'
	if (data?.streakLength === 1) streakText = '1 day'
	else if (data?.streakLength > 1) streakText = `${data.streakLength} days`

	return (
		<BaseScreen>
			<View style={[styles.container, style]}>
				{includeHeader && (
					<View style={styles.profileContainer}>
						<UserAvatar user={{ avatar: data?.avatar, fullname: data?.fullname }} />
						<HeaderText style={{ marginTop: '8%' }}>{data?.fullname}</HeaderText>
						{data.joinDate && (
							<Text style={{ color: chattanoogaTapWater }}>Joined {format(new Date(data.joinDate), 'MMMM yyyy')}</Text>
						)}
					</View>
				)}
				<View style={styles.rowContainer}>
					<View style={{ width: '65%', display: 'flex' }}>
						<View style={{ display: 'flex', flexDirection: 'row' }}>
							<Text style={styles.titleStyle}>GOAL</Text>
							<Text style={{ fontSize: 12, paddingLeft: 2 }}>{/* ⏳ */}</Text>
						</View>
						<Text style={styles.subTitleStyle}> {data.userGoal ? formatDuration(data.userGoal) : '---'}</Text>
					</View>
					<View style={{ display: 'flex' }}>
						<View style={{ display: 'flex', flexDirection: 'row' }}>
							<Text style={styles.titleStyle}>STREAK</Text>
							<Text style={{ fontSize: 12, paddingLeft: 2 }}>🔥</Text>
						</View>
						<Text style={styles.subTitleStyle}>{streakText}</Text>
					</View>
				</View>
				<View style={[styles.rowContainer, { marginTop: '10%' }]}>
					<View style={{ width: '65%', display: 'flex' }}>
						<View style={{ display: 'flex', flexDirection: 'row' }}>
							<Text style={styles.titleStyle}>ACHIEVEMENTS</Text>
							<Text style={{ fontSize: 12, paddingLeft: 2 }}>🏅</Text>
						</View>
						<Text style={styles.subTitleStyle}>{data.achievements ?? 0} earned</Text>
					</View>
				</View>
			</View>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column'
	},
	profileContainer: {
		alignItems: 'center',
		backgroundColor: 'transparent',
		marginBottom: '10%'
	},
	rowContainer: {
		flexDirection: 'row',
		marginStart: '7%',
		marginEnd: '7%',
		backgroundColor: 'transparent'
	},
	titleStyle: {
		fontSize: 15,
		color: chattanoogaTapWater,
		fontFamily: 'objektiv-semi-bold',
		height: 30
	},
	subTitleStyle: {
		color: 'white',
		fontSize: 14
	}
})
