import { Feather, FontAwesome5 } from '@expo/vector-icons'
import {
	addDays,
	format,
	isFuture,
	startOfWeek,
	endOfWeek,
	parseISO,
	previousMonday,
	nextMonday,
	isSameMonth
} from 'date-fns'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native'
import { Calendar } from 'react-native-calendars'
import FamilyChart from '../components/FamilyChart'
import Loading from '../components/Loading'
import MessageComponent from '../components/MessageComponent'
import { Text, View } from '../components/Themed'
import UserAvatar from '../components/UserAvatar'
import { chartColors, chattanoogaTapWater, darkArts, dichotomousHippopotamus, fill } from '../constants/Colors'
import { useGroup, useGroupMembers, useGroupMetrics } from '../core/services/group'
import { useUser } from '../core/services/user'
import { useSwipe } from '../hooks/useSwipe'
import { RootTabScreenProps } from '../types'
import BaseScreen from './BaseScreen'
import GroupLeaderboard from '../components/GroupLeaderboard'
import { MarkedDates } from 'react-native-calendars/src/types'
import GroupUserMetrics from '../components/GroupUserMetrics'
import DateCircle from '../components/DateCircle'

function formatWeek(start: Date, end: Date) {
	return `${format(start, 'MMM d')} - ${isSameMonth(start, end) ? format(end, 'd') : format(end, 'MMM d')}`
}

function getISO(date: Date) {
	return format(date, 'yyyy-MM-dd')
}

export default function HouseholdScreen({ navigation, route }: RootTabScreenProps<'FamilyTab'>) {
	const { onTouchStart, onTouchEnd } = useSwipe(onNext, onPrevious)
	const { data } = useUser()
	const [groupId, setGroupId] = useState(route.params?.groupId ?? data?.householdGroupId ?? '')
	const [date, setDate] = useState(route.params?.date ? new Date(route.params.date) : new Date())
	const [start, setStart] = useState(startOfWeek(date, { weekStartsOn: 1 }))
	const [end, setEnd] = useState(endOfWeek(date, { weekStartsOn: 1 }))
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)
	const { data: user } = useUser()
	const [markedDates, setMarkedDates] = useState<MarkedDates>({})
	const [weekString, setWeekString] = useState(formatWeek(start, end))
	const { data: groupData, isLoading } = useGroup(groupId)
	const [scrollEnabled, setScrollEnabled] = useState(true)
	const [switchValue, onSwitchChange] = useState(false)
	const { data: groupMembers } = useGroupMembers(groupId, false)
	const [userColorMap, setUserColorMap] = useState<{ [userId: string]: string }>({})

	const statsDataProvider = (_s: string, _e: string) => {
		return useGroupMetrics(groupId, getISO(start), getISO(end), false)
	}

	useEffect(() => {
		if (data && !groupId) {
			setGroupId(data?.householdGroupId ?? '')
		}
	}, [data])

	useEffect(() => {
		if (!groupMembers) return
		let colorMap: { [userId: string]: string } = {}
		let sorted = groupMembers.sort((a, b) => (a?.fullname ?? '').localeCompare(b?.fullname ?? ''))
		let i = 0

		for (const member of sorted) {
			if (i >= chartColors.length) i = 0
			colorMap[member.userid] = chartColors[i]
			i++
		}

		setUserColorMap(colorMap)
	}, [groupMembers])

	function onPrevious() {
		updateDates(previousMonday(start))
	}

	function onNext() {
		updateDates(nextMonday(start))
	}

	function updateDates(newDate: Date) {
		const startDate = startOfWeek(newDate, { weekStartsOn: 1 })
		const endDate = endOfWeek(newDate, { weekStartsOn: 1 })

		setStart(startDate)
		setEnd(endDate)
	}

	useEffect(() => {
		if (!start || !end) return

		setMarkedDates({
			[format(start, 'yyyy-MM-dd')]: { startingDay: true, color: dichotomousHippopotamus },
			[format(addDays(start, 1), 'yyyy-MM-dd')]: { color: dichotomousHippopotamus },
			[format(addDays(start, 2), 'yyyy-MM-dd')]: { color: dichotomousHippopotamus },
			[format(addDays(start, 3), 'yyyy-MM-dd')]: { color: dichotomousHippopotamus },
			[format(addDays(start, 4), 'yyyy-MM-dd')]: { color: dichotomousHippopotamus },
			[format(addDays(start, 5), 'yyyy-MM-dd')]: { color: dichotomousHippopotamus },
			[format(end, 'yyyy-MM-dd')]: { endingDay: true, color: dichotomousHippopotamus }
		})

		setWeekString(formatWeek(start, end))
	}, [start, end])

	if (isLoading || !groupData || !groupId) return <Loading />

	return (
		<BaseScreen>
			<View style={styles.container}>
				{/* Profile */}
				<TouchableOpacity
					onPress={() => {
						//@ts-ignore
						navigation.navigate('Group', {
							screen: 'GroupEdit',
							params: { groupId: groupId }
						})
					}}
					style={{
						width: '8%',
						flexDirection: 'row-reverse',
						top: 50,
						backgroundColor: 'transparent',
						zIndex: 1000,
						right: '5%',
						position: 'absolute',
						padding: 5
					}}>
					<UserAvatar size="medium" user={{ fullname: groupData?.name ?? '', avatar: groupData?.avatar }} useChattTap />
				</TouchableOpacity>
				{/* Date Selector */}
				<View
					onTouchStart={onTouchStart}
					onTouchEnd={onTouchEnd}
					style={{
						display: 'flex',
						flexDirection: 'row',
						marginBottom: 20,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: fill,
						height: 25,
						borderRadius: 15,
						paddingHorizontal: 5
					}}>
					<TouchableOpacity onPress={onPrevious} style={{ zIndex: 100 }}>
						<Feather name="chevron-left" size={22} color={'white'} />
					</TouchableOpacity>

					<TouchableOpacity
						style={{
							backgroundColor: fill,
							width: 150,
							borderRadius: 30,
							height: 35,
							borderColor: darkArts,
							borderWidth: 2
						}}
						onPress={() => {
							setIsCalendarOpen(!isCalendarOpen)
						}}>
						<Text
							style={{
								textAlign: 'center',
								fontFamily: 'objektiv-semi-bold',
								textTransform: 'uppercase',
								fontSize: 12,
								paddingTop: 7
							}}>
							{weekString}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={onNext} disabled={isFuture(nextMonday(start))}>
						<Feather name="chevron-right" size={22} color={isFuture(nextMonday(start)) ? 'gray' : 'white'} />
					</TouchableOpacity>
				</View>
				{/* Header */}
				<View
					style={{
						backgroundColor: 'transparent',
						display: 'flex',
						flexDirection: 'row',
						width: '90%',
						paddingBottom: 5
					}}>
					<Text style={{ textAlign: 'center', fontSize: 20, fontFamily: 'objektiv-semi-bold' }}>{groupData?.name}</Text>
					<View
						style={{
							backgroundColor: 'transparent',
							marginLeft: 10,
							display: 'flex',
							flexDirection: 'row',
							flex: 1,
							justifyContent: 'flex-end',
							alignItems: 'center'
						}}>
						{groupMembers &&
							groupMembers.map((u, i) => {
								return (
									<TouchableOpacity
										key={i}
										style={{ backgroundColor: 'transparent', marginLeft: 12 }}
										onPress={() => {
											// @ts-ignore
											navigation.navigate('Group', {
												screen: 'GroupUserDetailScreen',
												params: { userId: u.userid }
											})
										}}>
										<View
											style={[
												{
													backgroundColor: 'transparent',
													position: 'absolute',
													zIndex: 1000,
													top: 0,
													left: 0,
													margin: u?.avatar ? -5 : -6,
													padding: 0
												}
											]}>
											<DateCircle
												progress={100}
												lineWidth={2}
												widthPixels={u?.avatar ? 31 : 35}
												includeShadow={false}
												colorOverride={userColorMap[u.userid]}
											/>
										</View>

										<UserAvatar user={u} key={i} size="small" />
									</TouchableOpacity>
								)
							})}
					</View>
				</View>
				{/* Body */}
				<ScrollView
					scrollEnabled={scrollEnabled}
					style={{ width: '100%' }}
					contentContainerStyle={{
						width: '100%',
						display: 'flex',
						alignItems: 'center',
						paddingBottom: 80
					}}>
					{/* Messages */}
					<MessageComponent
						onTouchStart={() => setScrollEnabled(false)}
						onTouchEnd={() => setScrollEnabled(true)}
						type="1"
					/>

					{/* Chart */}
					<FamilyChart
						groupId={groupId}
						startDate={format(start, 'yyyy-MM-dd')}
						endDate={format(end, 'yyyy-MM-dd')}
						userColorMap={userColorMap}
					/>

					{/* Leaderboard */}
					<View style={{ backgroundColor: 'transparent', width: '90%' }}>
						<View
							style={{
								marginTop: 10,
								flexDirection: 'row',
								alignItems: 'center'
							}}>
							<Text style={{ flex: 1, fontSize: 17, fontFamily: 'objektiv-semi-bold' }}>Leaderboard</Text>
							<FontAwesome5 name="chart-pie" size={24} color={chattanoogaTapWater} />
							<Switch
								thumbColor={'white'}
								value={switchValue}
								style={{ marginStart: 10 }}
								onValueChange={onSwitchChange}
								trackColor={{ true: dichotomousHippopotamus, false: 'grey' }}
							/>
						</View>

						<GroupLeaderboard
							groupId={groupId}
							startDate={format(start, 'yyyy-MM-dd')}
							endDate={format(end, 'yyyy-MM-dd')}
							navigate={navigation.navigate}
							switchValue={switchValue}
							userColorMap={userColorMap}
						/>
					</View>
					<View style={{ backgroundColor: 'transparent', width: '100%', alignItems: 'center', marginTop: 30 }}>
						<View
							style={{
								marginTop: 10,
								flexDirection: 'row',
								alignItems: 'center',
								width: '90%'
							}}>
							<Text style={{ flex: 1, fontSize: 17, fontFamily: 'objektiv-semi-bold' }}>Weekly Stats</Text>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('HouseHoldUserStats', { groupId: groupId })
								}}>
								<Text style={{ fontSize: 14, color: dichotomousHippopotamus, fontFamily: 'objektiv-semi-bold' }}>
									Show More
								</Text>
							</TouchableOpacity>
						</View>
						<GroupUserMetrics
							usingCustomDates
							isMyStatsView={false}
							dataProvider={statsDataProvider}
							noDataComponent={
								<View style={{ width: '90%' }}>
									<Text style={{ textAlign: 'left', marginTop: 20, color: chattanoogaTapWater }}>
										No sessions have been recorded for the selected time period.
									</Text>
								</View>
							}
						/>
						{/* <SettingGroup>
                            <SettingItem
                                label="Household Stats"
                                onClick={() => {
                                    navigation.navigate('HouseHoldUserStats', { groupId: groupId })
                                }}
                                leftIcon="time-slot"
                                leftIconType="entypo"
                                last
                            />
                             <SettingItem label="Aro Recaps" onClick={() => {}} leftIcon="smartphone" leftIconType="feather" />
                            <SettingItem
                                last
                                label="Family Goals / Challenges"
                                onClick={() => {}}
                                leftIcon="zap"
                                leftIconType="feather"
                            />
                        </SettingGroup> */}
					</View>
				</ScrollView>

				{/* Calendar */}
				{isCalendarOpen && (
					<View
						style={{
							display: 'flex',
							position: 'absolute',
							marginTop: '25%',
							width: '100%',
							backgroundColor: 'transparent'
						}}>
						<Calendar
							enableSwipeMonths={true}
							initialDate={format(start, 'yyyy-MM-dd')}
							maxDate={format(new Date(), 'yyyy-MM-dd')}
							firstDay={1}
							theme={{
								textDayFontFamily: 'objektiv',
								textMonthFontFamily: 'objektiv-semi-bold',
								todayButtonFontFamily: 'objektiv-semi-bold',
								textDayHeaderFontFamily: 'objektiv',
								calendarBackground: fill,
								arrowColor: 'white',
								dayTextColor: 'white',
								textDisabledColor: darkArts,
								monthTextColor: 'white',
								todayTextColor: 'white',
								textSectionTitleColor: chattanoogaTapWater,
								selectedDayTextColor: dichotomousHippopotamus,
								selectedDayBackgroundColor: fill
							}}
							markingType={'period'}
							style={{
								borderRadius: 10,
								width: '75%',
								marginLeft: 'auto',
								marginRight: 'auto'
							}}
							markedDates={markedDates}
							onDayPress={(day) => {
								if (day?.dateString === undefined) return

								const newDate = parseISO(day.dateString)
								if (isFuture(newDate)) return
								updateDates(newDate)
								setIsCalendarOpen(false)
							}}
						/>
					</View>
				)}
			</View>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 60
	}
})
