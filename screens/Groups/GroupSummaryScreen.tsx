import { Feather, Ionicons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { format, intervalToDuration, startOfWeek } from 'date-fns'
import { endOfWeek } from 'date-fns/esm'
import LottieView from 'lottie-react-native'
import React, { useEffect, useState } from 'react'
import { Pressable, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import Loading from '../../components/Loading'
import { Text, View } from '../../components/Themed'
import UserAvatar from '../../components/UserAvatar'
import { chattanoogaTapWater, darkArts, dichotomousHippopotamus, fill } from '../../constants/Colors'
import SharedStyles from '../../constants/Styles'
import { formatDuration } from '../../core/format'
import { GroupSummaryUser, notify, useSummary } from '../../core/services/group'
import { useInterval } from '../../hooks/useInterval'
import { useOnActivate } from '../../hooks/useOnActivate'
import { useToday } from '../../hooks/useToday'
import { GroupTabScreenProps } from '../../types'
import DateCircle from '../../components/DateCircle'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import OrangeButton from '../../components/OrangeButton'

const Tab = createMaterialTopTabNavigator()
function buildActiveTime(start: string) {
	if (!start || !start.length) return ''

	return formatDuration(
		intervalToDuration({
			start: new Date(start),
			end: new Date()
		}),
		2
	)
}

function UserItem({ user, includeProgressCircle }: { user: GroupSummaryUser; includeProgressCircle: boolean }) {
	const isFocused = useIsFocused()
	const [activeTime, setActiveTime] = useState(buildActiveTime(user.maxStartTime))

	const tickActiveTime = () => setActiveTime(buildActiveTime(user.maxStartTime))
	useInterval(tickActiveTime, user.active ? 30000 : null)

	useEffect(() => {
		tickActiveTime()
	})

	useEffect(() => {
		if (isFocused) tickActiveTime()
	}, [isFocused, user])

	let overnightCount = parseInt(`${user.overnightCount}`, 10)

	return (
		<View style={groupItemStyles.item}>
			<View style={[groupItemStyles.row, { marginBottom: 10, maxWidth: '100%' }]}>
				<View style={[groupItemStyles.column, { flex: 1 }]}>
					<View style={{ backgroundColor: 'transparent' }}>
						{includeProgressCircle && (
							<View
								style={[
									{ backgroundColor: 'transparent', position: 'absolute', zIndex: 1000 },
									user?.avatar ? { top: -4, left: -4 } : { top: -4, left: -4 }
								]}>
								<DateCircle
									progress={user?.progress || 0}
									lineWidth={3}
									widthPixels={user?.avatar ? 50 : 48}
									includeShadow={false}
									colorOverride={dichotomousHippopotamus}
								/>
							</View>
						)}
						<UserAvatar
							user={user}
							size="medium"
							style={
								[{ borderColor: fill, borderWidth: 1 }, { margin: 3 }]
								// Overlap effect
							}
						/>
					</View>

					<Text
						style={{
							fontFamily: 'objektiv-md',
							marginLeft: 10,
							fontSize: 16,
							paddingRight: 5,
							flex: 1
						}}
						numberOfLines={1}>
						{user.fullname}
					</Text>

					{overnightCount > 0 && (
						<>
							{overnightCount > 1 && (
								<Text
									style={{
										color: chattanoogaTapWater,
										fontSize: 12,
										paddingRight: 3
									}}>
									{overnightCount}x
								</Text>
							)}
							<Ionicons
								style={{ paddingLeft: 0, paddingRight: 5 }}
								name={'ios-moon'}
								color={dichotomousHippopotamus}
								size={12}
							/>
						</>
					)}
				</View>
				<View style={[groupItemStyles.column, { marginRight: -7 }]}>
					{user.active && <Text style={{ fontSize: 14 }}>{activeTime}</Text>}
					{user.active ? (
						<LottieView
							source={require('../../assets/animations/pulese.min.json')}
							style={{ width: 34, height: 34 }}
							loop={true}
							autoPlay={true}
						/>
					) : (
						<Feather name="circle" size={28} style={{ marginRight: 3, opacity: 0.7 }} color={darkArts} />
					)}
				</View>
			</View>
			<View style={[groupItemStyles.row]}>
				<View style={[groupItemStyles.column]}>
					<Text style={[groupItemStyles.chatTap]}>Total Time:</Text>
				</View>
				<View style={[groupItemStyles.column]}>
					<Text style={[groupItemStyles.chatTap]}>{user.totalTime ? formatDuration(user.totalTime) : '0:00'}</Text>
				</View>
			</View>
			<View style={groupItemStyles.divider} />
			<View style={[groupItemStyles.row]}>
				<View style={[groupItemStyles.column]}>
					<Text style={[groupItemStyles.chatTap]}>Total Sessions:</Text>
				</View>
				<View style={[groupItemStyles.column]}>
					<Text style={[groupItemStyles.chatTap]}>{user.totalSessions || 0}</Text>
				</View>
			</View>
		</View>
	)
}

const groupItemStyles = StyleSheet.create({
	divider: {
		backgroundColor: chattanoogaTapWater,
		width: '100%',
		height: 1,
		opacity: 0.3,
		marginVertical: 5
	},
	item: {
		width: '90%',
		backgroundColor: fill,
		borderRadius: 15,
		marginBottom: 10,
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
	leftColumn: {
		display: 'flex'
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

function getISO(date: Date) {
	return format(date, 'yyyy-MM-dd')
}

export function GroupSummary({
	navigate,
	index,
	groupId,
	isJoinMeAvailable
}: {
	navigate: (id: string, param: any) => void
	index: number
	groupId: string
	isJoinMeAvailable: boolean
}) {
	const today = useToday()
	const [start, setStart] = useState(index == 1 ? today : getISO(startOfWeek(new Date(), { weekStartsOn: 1 })))
	const [end, setEnd] = useState(index == 1 ? today : getISO(endOfWeek(new Date(), { weekStartsOn: 1 })))
	const { data, refetch, isFetching, isRefetching } = useSummary(groupId, start, end)
	const isFocused = useIsFocused()
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [pressedJoinMe, setPressedJoinMe] = useState(false)
	useOnActivate(refetch, !isFetching && isFocused)

	useEffect(() => {
		if (isFocused) refetch()
	}, [isFocused])

	useEffect(() => {
		if (index == 1) {
			setEnd(today)
			setStart(today)
			refetch()
		}
	}, [today])

	function onUserItemPress(user: GroupSummaryUser) {
		navigate('GroupUserDetailScreen', { userId: user?.userid })
	}

	async function onRefresh() {
		setIsRefreshing(true)
		try {
			await refetch()
		} finally {
			setIsRefreshing(false)
		}
	}
	if (!data || !data.totalTime || isRefetching) return <Loading />

	const hasActive = data.users.some((u) => u.active)

	return (
		<View style={styles.container}>
			<View
				style={{
					marginTop: 15,
					display: 'flex',
					alignItems: 'center',
					backgroundColor: 'transparent'
				}}>
				<Text style={{ fontFamily: 'objektiv-md', fontSize: 30 }}>{formatDuration(data.totalTime, 2)}</Text>
				<Text style={{ marginTop: 10, marginBottom: 20 }}>Total Group Time</Text>
			</View>

			{isJoinMeAvailable && (
				<OrangeButton
					title={pressedJoinMe ? 'Sent' : 'Join Me'}
					disabled={hasActive || pressedJoinMe}
					outterStyle={{
						width: '88%',
						marginBottom: '5%'
					}}
					onPress={async () => {
						setPressedJoinMe(true)
						await notify(groupId)
					}}
					icon={pressedJoinMe ? 'check' : 'message-square'}
				/>
			)}

			<ScrollView
				refreshControl={
					<RefreshControl
						tintColor={chattanoogaTapWater}
						colors={[chattanoogaTapWater]}
						refreshing={isRefreshing}
						onRefresh={onRefresh}
					/>
				}
				style={{ width: '100%' }}
				contentContainerStyle={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					paddingBottom: 20
				}}>
				{data.users.map((u, i) => (
					<TouchableOpacity key={i} style={{ width: '100%', alignItems: 'center' }} onPress={() => onUserItemPress(u)}>
						<UserItem user={u} key={i} includeProgressCircle={index === 1} />
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	)
}

export default function GroupSummaryScreen({ navigation, route }: GroupTabScreenProps<'GroupSummary'>) {
	const today = useToday()
	const [shouldInvite] = useState(route.params.invite === true)
	const [start, setStart] = useState(today)
	const [end, setEnd] = useState(today)
	const groupId = route.params.groupId
	const { data, refetch, isFetching } = useSummary(groupId, start, end)
	const isFocused = useIsFocused()
	useOnActivate(refetch, !isFetching && isFocused)

	useEffect(() => {
		navigation.setOptions({
			title: data?.name,
			headerRight: () => (
				<Pressable
					onPress={() => navigation.navigate('GroupEdit', { groupId })}
					style={({ pressed }) => ({
						opacity: pressed ? 0.5 : 1
					})}>
					<Feather name="settings" size={20} color={'white'} />
				</Pressable>
			)
		})
	}, [data])

	useEffect(() => {
		if (shouldInvite) navigation.navigate('GroupInvite', { groupId })
	}, [shouldInvite])

	return (
		<View
			style={{
				paddingTop: 100,
				backgroundColor: 'transparent',
				height: '100%',
				width: '100%'
			}}>
			<View style={{ position: 'absolute', width: '100%', alignItems: 'center', height: '100%' }}>
				<View style={[SharedStyles.glowTop, { zIndex: -1, alignItems: 'center' }]} />
			</View>
			<Tab.Navigator
				screenOptions={{
					tabBarActiveTintColor: 'white',
					tabBarIndicatorStyle: {
						borderWidth: 1,
						borderColor: dichotomousHippopotamus
					},
					tabBarLabelStyle: { fontSize: 15, fontFamily: 'objektiv-md', textTransform: 'none' },
					tabBarStyle: { backgroundColor: 'transparent', width: '90%', marginLeft: 'auto', marginRight: 'auto' }
				}}>
				<Tab.Screen
					name="Mon - Sun"
					children={() => (
						<GroupSummary
							navigate={navigation.navigate}
							index={0}
							groupId={route.params.groupId}
							isJoinMeAvailable={false}
						/>
					)}
				/>
				<Tab.Screen
					name="Today"
					children={() => (
						<GroupSummary
							navigate={navigation.navigate}
							index={1}
							groupId={route.params.groupId}
							isJoinMeAvailable={false}
						/>
					)}
				/>
			</Tab.Navigator>
		</View>
	)
}

const width = '90%'

const styles = StyleSheet.create({
	input: {
		width,
		backgroundColor: fill,
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		color: 'white'
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		marginTop: 300,
		fontSize: 13,
		marginBottom: 10
	},
	button: {
		marginTop: 'auto',
		marginBottom: 50,
		width
	}
})
