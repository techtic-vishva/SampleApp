import { StyleSheet, FlatList, TouchableOpacity, ScrollView, Share, Image, Dimensions, Pressable } from 'react-native'
import { Text, View } from '../components/Themed'
import { chattanoogaTapWater, dichotomousHippopotamus, fill } from '../constants/Colors'
import { useUser } from '../core/services/user'
import { ProfileTabScreenProps } from '../types'
import { getUser } from '../core/Authentication'
import { HeaderText } from '../components/StyledText'
import { format, isSameMonth } from 'date-fns'
import Loading from '../components/Loading'
import UserAvatar from '../components/UserAvatar'
import { useIsFocused } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import BaseScreen from './BaseScreen'
import { previousMonday, previousSunday } from 'date-fns'
import { orderBy, groupBy } from 'lodash'
import { MenuView } from '@react-native-menu/menu'
import { usePhotoUpload } from '../components/usePhotoUpload'
import { Feather, Ionicons } from '@expo/vector-icons'
import GroupUserMetrics from '../components/GroupUserMetrics'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useMetrics } from '../core/services/user-stats'

function getISO(date: Date) {
	return format(date, 'yyyy-MM-dd')
}

function WeeklyRecaps(props: { onItemPress: (endDate: string, startDate: string) => void }) {
	const firebaseUser = getUser()

	const weeklyRecap = () => {
		const weeks = []
		const maxEndDate = previousSunday(new Date()) // Start Max Date
		const joinedDate = new Date(getISO(new Date(firebaseUser?.metadata.creationTime || '2022-01-01'))) // Joined Date of User
		let iterator = maxEndDate

		// Build List of Weeks
		while (iterator > joinedDate) {
			let startOfWeek = previousMonday(iterator)
			if (startOfWeek > joinedDate) weeks.push({ start: startOfWeek, end: iterator })
			else if (joinedDate > startOfWeek && joinedDate < iterator) weeks.push({ start: startOfWeek, end: iterator })
			iterator = previousSunday(iterator)
		}

		const sortData = orderBy(weeks, ['start'], ['desc'])

		const groupByMonths = groupBy(sortData, ({ start }) => format(new Date(start), 'MMMM yyyy'))
		const output = Object.entries(groupByMonths).map(([month, weeks]) => ({ month, weeks }))

		return output
	}

	const [groupByMonthsList] = useState(weeklyRecap())

	return (
		<View style={{ flex: 1, width: '100%', padding: 15 }}>
			<FlatList
				showsVerticalScrollIndicator={false}
				data={groupByMonthsList}
				ListEmptyComponent={Empty()}
				contentContainerStyle={{ paddingBottom: 230 }}
				renderItem={({ item, index }) => (
					<View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginTop: index > 0 ? 10 : 0
							}}>
							<Text style={{ fontSize: 14, color: chattanoogaTapWater, fontFamily: 'objektiv' }}>{item.month}</Text>
							<View
								style={{ flex: 1, height: 1, marginRight: 5, marginLeft: 10 }}
								lightColor="#eee"
								darkColor="rgba(255,255,255,0.1)"
							/>
						</View>

						<FlatList
							data={item.weeks}
							contentContainerStyle={{ width: '100%' }}
							renderItem={({ item }) => (
								<TouchableOpacity
									onPress={() =>
										props.onItemPress(new Date(item.end).toISOString(), new Date(item.start).toISOString())
									}
									style={{
										width: '48%',
										flexDirection: 'column',
										backgroundColor: fill,
										marginTop: 5,
										marginBottom: 5,
										marginEnd: 10,
										borderRadius: 5,
										padding: 8
									}}>
									<View style={{ backgroundColor: 'transparent', flex: 1 }}>
										<Text style={{ fontSize: 8, color: chattanoogaTapWater, fontFamily: 'objektiv' }}>WEEKLY</Text>
										<Text
											style={{
												marginTop: 3,
												color: 'white',
												fontFamily: 'objektiv-md',
												fontSize: 12
											}}>{`${format(item.start, 'MMM d')} - ${
											isSameMonth(item.start, item.end) ? format(item.end, 'd') : format(item.end, 'MMM d')
										}`}</Text>
									</View>
								</TouchableOpacity>
							)}
							numColumns={2}
							style={{ marginBottom: 10, marginTop: 10 }}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View>
				)}
			/>
		</View>
	)
}

function MyAro() {
	const { data: user } = useUser()
	const [includeOvernight, setIncludeOvernight] = useState(false)

	const dataProvider = (start: string, end: string) => {
		return useMetrics(user?.userid ?? '', start, end, includeOvernight)
	}
	return (
		<View style={{ flexGrow: 1, width: '100%' }}>
			<View
				style={{
					paddingTop: 15,
					marginLeft: 'auto',
					marginRight: 'auto'
				}}>
				<TouchableOpacity
					style={{ flexDirection: 'row', alignItems: 'center' }}
					onPress={() => setIncludeOvernight(!includeOvernight)}>
					<View>
						<Text style={{ fontSize: 8, color: chattanoogaTapWater, paddingRight: 5, textAlign: 'right' }}>
							Include Overnight Data
						</Text>
					</View>
					<Ionicons
						name={includeOvernight ? 'ios-moon' : 'ios-moon-outline'}
						size={14}
						color={includeOvernight ? dichotomousHippopotamus : chattanoogaTapWater}
					/>
				</TouchableOpacity>
			</View>
			<ScrollView style={{ width: '100%' }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 230 }}>
				<GroupUserMetrics isMyStatsView dataProvider={dataProvider} />
			</ScrollView>
		</View>
	)
}

export function Empty() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				height: Dimensions.get('window').height * 0.6
			}}>
			<View
				style={{
					position: 'relative',
					top: 75,
					zIndex: 999,
					backgroundColor: fill,
					padding: 10,
					borderRadius: 15,
					width: '90%'
				}}>
				<Text style={{ textAlign: 'center' }}>
					🔒 Record Aro time consistently for a week to unlock your first{' '}
					<Text style={{ fontFamily: 'objektiv-semi-bold-italic' }}>Weekly Recap 🗓️</Text>.
				</Text>
			</View>
			<Image
				source={require('../assets/images/weekly-recaps-placeholder.png')}
				resizeMode="contain"
				blurRadius={7}
				style={{ width: '100%', height: '100%', opacity: 0.5 }}
			/>
		</View>
	)
}

const Tab = createMaterialTopTabNavigator()

const tabMap = {
	stats: 'My Stats',
	recaps: 'Weekly Recaps'
}

export default function ProfileScreen({ navigation, route }: ProfileTabScreenProps<'ProfileTab'>) {
	const { data, isLoading, isFetching, refetch } = useUser()
	const isFocused = useIsFocused()
	const triggerPhotoUpload = usePhotoUpload(refetch)

	// Refresh on focus
	useEffect(() => {
		if (!isFetching && isFocused) {
			refetch()
		}
	}, [isFocused])

	// Default tab
	let initialTabName = tabMap.stats
	if ((route.params?.initialRouteName || 'stats').toLowerCase() === 'recaps') initialTabName = tabMap.recaps

	if (isLoading || !data) {
		return <Loading />
	}

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Pressable
					onPress={() => navigation.navigate('Settings')}
					style={({ pressed }) => ({
						opacity: pressed ? 0.5 : 1
					})}>
					<Feather name="settings" size={20} color={'white'} style={{ marginRight: 15 }} />
				</Pressable>
			)
		})
	}, [])
	function onReferPress() {
		//@ts-ignore
		navigation.navigate('Settings', { screen: 'ReferFriend' })
	}
	return (
		<BaseScreen>
			<View style={styles.container}>
				<View
					style={{ flexDirection: 'row', backgroundColor: 'transparent', marginHorizontal: 22, marginVertical: 20 }}>
					<MenuView
						onPressAction={({ nativeEvent }) => {
							if (nativeEvent.event === 'select' || nativeEvent.event === 'camera') {
								triggerPhotoUpload(nativeEvent.event)
							}
						}}
						actions={[
							{
								id: 'select',
								title: 'Select From Library',
								image: 'photo.on.rectangle'
							},
							{
								id: 'camera',
								title: 'Use Camera',
								image: 'camera'
							}
						]}
						shouldOpenOnLongPress={false}>
						<UserAvatar user={data} style={{ marginStart: 10 }} />
					</MenuView>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							backgroundColor: 'transparent',
							marginStart: '10%'
						}}>
						<HeaderText numberOfLines={1} adjustsFontSizeToFit={true}>
							{data.fullname}
						</HeaderText>
						<Text
							numberOfLines={1}
							adjustsFontSizeToFit={true}
							style={{ color: chattanoogaTapWater, padding: 10, paddingStart: 0 }}>
							{data.email}
						</Text>

						{data.referralInviteCode && (
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={onReferPress}>
								<Text style={{ fontSize: 14 }}>
									{data.referralCount == 0
										? '0 Referrals'
										: data.referralCount == 1
										? '1 Referral'
										: `${data.referralCount} Referrals`}
								</Text>

								<Feather
									name={'share'}
									size={14}
									color={chattanoogaTapWater}
									style={{ marginStart: 5, opacity: 0.75 }}
								/>
							</TouchableOpacity>
						)}
					</View>
				</View>
				<View style={{ paddingTop: 10, width: '100%', height: '100%', backgroundColor: 'transparent' }}>
					<Tab.Navigator
						initialRouteName={initialTabName}
						screenOptions={{
							tabBarContentContainerStyle: {
								borderBottomColor: fill,
								borderBottomWidth: 0.5
							},
							tabBarActiveTintColor: 'white',
							tabBarIndicatorStyle: {
								backgroundColor: dichotomousHippopotamus,
								height: 3
							},
							tabBarLabelStyle: { fontSize: 15, fontFamily: 'objektiv-md', textTransform: 'none' },
							tabBarStyle: { backgroundColor: 'transparent', width: '100%', marginLeft: 'auto', marginRight: 'auto' }
						}}>
						<Tab.Screen name={tabMap.stats} children={() => <MyAro />} />
						<Tab.Screen
							name={tabMap.recaps}
							children={() => (
								<WeeklyRecaps
									onItemPress={(endDate, startDate) => {
										//@ts-ignore
										navigation.navigate('Profile', {
											screen: 'WeeklyRecap',
											params: {
												endDate: endDate,
												startDate: startDate
											}
										})
									}}
								/>
							)}
						/>
					</Tab.Navigator>
				</View>
			</View>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 65
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	separator: {
		marginTop: 30,
		height: 1,
		width: '80%'
	}
})
