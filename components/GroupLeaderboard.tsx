import React, { useEffect, useState } from 'react'
import { chattanoogaTapWater, dichotomousHippopotamus, fill } from '../constants/Colors'
import { LeaderboardUsers, useLeaderboard } from '../core/services/group'
import { Text, View } from './Themed'
import { formatDuration, activeTime, toMinutes, getFirstName } from '../core/format'
import UserAvatar from './UserAvatar'
import { Feather, Ionicons } from '@expo/vector-icons'
import { isPast, parseISO } from 'date-fns'
import { useInterval } from '../hooks/useInterval'
import { useIsFocused } from '@react-navigation/native'
import { VictoryLabel, VictoryPie } from 'victory-native'
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import { durationToStackLabel } from './FamilyChart'

function GroupItem({
	user,
	includeActive,
	onUserPress
}: {
	user: LeaderboardUsers
	includeActive: boolean
	onUserPress: (userId: string) => void
}) {
	let overnightCount = parseInt(`${user.overnightCount}`, 10)
	const isFocused = useIsFocused()
	const [userActiveTime, setUserActiveTime] = useState(activeTime(user.maxStartTime))

	const tickActiveTime = () => setUserActiveTime(activeTime(user.maxStartTime))
	useInterval(tickActiveTime, user.active ? 30000 : null)

	useEffect(() => {
		tickActiveTime()
	})

	useEffect(() => {
		if (isFocused) tickActiveTime()
	}, [isFocused, user])

	return (
		<TouchableOpacity
			onPress={() => onUserPress(user.userid)}
			style={[
				groupItemStyles.item,
				user.active && includeActive
					? {
							shadowColor: dichotomousHippopotamus,
							shadowOpacity: 0.9,
							shadowRadius: 6,
							borderColor: dichotomousHippopotamus,
							borderWidth: 2,
							shadowOffset: {
								height: 0,
								width: 0
							}
					  }
					: {}
			]}>
			<View style={[groupItemStyles.row, { marginBottom: 10, maxWidth: '100%' }]}>
				<View style={[groupItemStyles.column, { flex: 1 }]}>
					<View style={{ backgroundColor: 'transparent' }}>
						<UserAvatar
							user={user}
							size="medium"
							style={
								[{ borderColor: fill, borderWidth: 1 }, { margin: 3 }]
								// Overlap effect
							}
						/>
					</View>

					<View style={{ flexDirection: 'column', marginLeft: 10, backgroundColor: 'transparent', flex: 1 }}>
						<Text
							style={{
								fontFamily: 'objektiv-md',
								fontSize: 16,
								paddingRight: 5,
								flex: 1
							}}
							numberOfLines={1}>
							{user.fullname}
						</Text>
						<Text style={[groupItemStyles.chatTap]}>
							{!user.activated
								? 'User has not setup their Aro account'
								: user.totalTime
								? formatDuration(user.totalTime)
								: '0:00'}
						</Text>
					</View>

					<View style={[groupItemStyles.column, { marginRight: 10 }]}>
						{user.active && includeActive && (
							<Text style={{ fontSize: 14, fontFamily: 'objektiv-semi-bold' }}>{userActiveTime}</Text>
						)}
					</View>

					{!user.activated && (
						<>
							<Feather
								style={{ paddingLeft: 0, paddingRight: 5 }}
								name={'info'}
								color={dichotomousHippopotamus}
								size={20}
							/>
						</>
					)}

					{overnightCount > 0 && (
						<>
							<Text
								style={{
									color: chattanoogaTapWater,
									fontSize: 12,
									paddingRight: 3
								}}>
								{overnightCount}x
							</Text>

							<Ionicons
								style={{ paddingLeft: 0, paddingRight: 5 }}
								name={'ios-moon'}
								color={dichotomousHippopotamus}
								size={12}
							/>
						</>
					)}
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default function ({
	startDate,
	groupId,
	endDate,
	navigate,
	switchValue,
	userColorMap
}: {
	startDate: string
	groupId: string
	endDate: string
	navigate: (id: string, param: any) => void
	switchValue: boolean
	userColorMap: { [key: string]: string }
}) {
	const { data, refetch } = useLeaderboard(groupId, startDate, endDate)
	let includeActive = !isPast(parseISO(endDate))
	const [chartData, setChartData] = useState<{ fullname: string; x: string; y: number; fill: string }[]>()

	useEffect(() => {
		if (!data) return

		const pieChartData = data.users.map((user) => {
			const label = `${durationToStackLabel(user.totalTime)}`
			return {
				fullname: user.fullname,
				x: label,
				y: toMinutes(user.totalTime),
				fill: userColorMap[user.userid]
			}
		})

		setChartData(pieChartData)
	}, [data, userColorMap])

	const isFocusable = useIsFocused()

	useEffect(() => {
		isFocusable && refetch()
	}, [isFocusable])

	const onUserPress = (userId: string) => {
		navigate('Group', {
			screen: 'GroupUserDetailScreen',
			params: { userId: userId }
		})
	}

	const { width } = Dimensions.get('window')

	const formatDatumXLabel = (x: any) => {
		if (typeof x === 'string') {
			return `(${parseFloat(x).toFixed(1)} hr)`
		} else if (typeof x === 'number') {
			return `(${x.toFixed(1)} hr)`
		} else {
			return `(${x} hr)`
		}
	}

	return (
		<View style={{ marginTop: 20, width: '100%', alignItems: 'center', backgroundColor: 'transparent' }}>
			{switchValue ? (
				<View style={{ flexDirection: 'column', width: '100%' }}>
					<VictoryPie
						padding={{ top: 40, bottom: 40, left: 50, right: 50 }}
						animate={{
							duration: 2000,
							easing: 'circle'
						}}
						width={width * 0.9}
						data={chartData}
						labelComponent={
							<VictoryLabel
								style={[{ fill: 'white', fontFamily: 'objektiv-semi-bold', fontSize: 10 }]}
								textAnchor="middle"
							/>
						}
						labelRadius={width * 0.35}
						labels={({ datum }) => (datum.x ? `${getFirstName(datum.fullname)} ${formatDatumXLabel(datum.x)}` : null)}
						style={{
							data: {
								fill: ({ datum }) => datum.fill
							}
						}}
					/>
				</View>
			) : (
				<>
					{data &&
						data.users.map((u, i) => (
							<GroupItem onUserPress={onUserPress} user={u} key={i} includeActive={includeActive} />
						))}
				</>
			)}
		</View>
	)
}
const groupItemStyles = StyleSheet.create({
	item: {
		width: '100%',
		backgroundColor: fill,
		borderRadius: 15,
		marginBottom: 20,
		paddingHorizontal: 20,
		paddingVertical: 20,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	column: {
		backgroundColor: 'transparent',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},

	row: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%'
	},
	chatTap: {
		color: chattanoogaTapWater,
		fontSize: 12,
		fontFamily: 'objektiv-md'
	}
})
