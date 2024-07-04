import { Feather, Ionicons } from '@expo/vector-icons'
import { MenuAction, MenuView } from '@react-native-menu/menu'
import { useIsFocused } from '@react-navigation/native'
import { addDays, format, isFuture, isToday, parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'
import {
	FlatList,
	Platform,
	Pressable,
	SafeAreaView,
	Share,
	StyleSheet,
	TouchableOpacity,
	useWindowDimensions
} from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import AroModal from '../components/AroModal'
import RingProgress from '../components/RingProgress'
import { Text, View } from '../components/Themed'
import UserAvatar from '../components/UserAvatar'
import WeekTracker from '../components/WeekTracker'
import { chattanoogaTapWater, darkArts, dichotomousHippopotamus, fill } from '../constants/Colors'
import SharedStyles from '../constants/Styles'
import {
	deletes,
	MonthlySummary,
	prefetchSummary,
	Session,
	update,
	useMonthSummary,
	useSummary,
	useTags
} from '../core/services/session'
import { useUser } from '../core/services/user'
import { useAroState } from '../hooks/useAroState'
import { useInterval } from '../hooks/useInterval'
import { useSwipe } from '../hooks/useSwipe'
import { RootTabScreenProps } from '../types'
import BaseScreen from './BaseScreen'
import { DayComponent } from './SessionScreen'
import { GlobalState } from '../core/GlobalState'
import { Calendar } from 'react-native-calendars'
import DateCircle from '../components/DateCircle'
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking'
import { useAnnouncements } from '../core/services/announcements'
import { useAppState } from '../hooks/useAppState'
import { useChallenges } from '../core/services/challenges'
import { tabMap } from './MotivationScreen'
import { scan as scanNfc } from '../core/AroNfc'

const timeName = (date: Date) => {
	const hours = date.getHours()
	if (hours < 12) return 'morning'
	if (hours < 17) return 'afternoon'
	return 'evening'
}

function TodayEmpty() {
	return (
		<View style={{ width: '100%', flex: 1, marginTop: 100, backgroundColor: 'transparent' }}>
			<Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Good {timeName(new Date())}!</Text>
			<Text style={{ color: 'white', textAlign: 'center', fontSize: 15, padding: 10 }}>
				Get started with your first session of the day.
			</Text>
		</View>
	)
}

export function Empty({ date }: { date: Date }) {
	return (
		<View style={{ width: '100%', flex: 1, marginTop: 100, backgroundColor: 'transparent' }}>
			<Text style={{ color: 'white', textAlign: 'center', fontSize: 15, padding: 10 }}>No sessions recorded.</Text>
		</View>
	)
}

function getISO(date: Date) {
	return format(date, 'yyyy-MM-dd')
}

type EnhancedMarkedDate = { isOvernight: boolean; progress: number } & MarkingProps
type MarkedDateCollection = { [key: string]: EnhancedMarkedDate }

const generateMarkedDates = (
	init: MarkedDateCollection,
	selectedDate: Date,
	monthSummary: MonthlySummary | undefined
) => {
	const mark: MarkedDateCollection = { ...init }
	const selectedValue = format(selectedDate, 'yyyy-MM-dd')

	for (const entry of monthSummary?.entries || []) {
		mark[entry.date] = {
			marked: true,
			selected: entry.date === selectedValue,
			...entry
		} as EnhancedMarkedDate
	}

	return mark
}

export default function HomeScreen({ navigation }: RootTabScreenProps<'HomeTab'>) {
	const [date, setDate] = useState(new Date())
	const [maxAllowedISO, setMaxAllowedISO] = useState(getISO(date))
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)
	const { data, refetch, isFetching, isSuccess } = useSummary(getISO(date), isToday(date))
	const { data: tags } = useTags()
	const isFocsued = useIsFocused()
	const progress = useSharedValue(0)
	let next = addDays(date, 1)
	const aroState = useAroState()
	const [calendarMonth, setCalendarMonth] = useState(format(date, 'yyyy-MM'))
	const { data: monthSummary, refetch: monthRefetch } = useMonthSummary(calendarMonth)
	const [markedDates, setMarkedDate] = useState<MarkedDateCollection>(generateMarkedDates({}, date, monthSummary))
	const { onTouchStart, onTouchEnd } = useSwipe(onNext, onPrevious)
	const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
	const [deleteUUID, setDeleteUUID] = useState('')
	const { data: appUser } = useUser()
	const [menuAction, setMenuAction] = useState<MenuAction[]>()
	const { data: announcements, refetch: checkAnnouncements } = useAnnouncements()
	const { data: challenges } = useChallenges()
	const appState = useAppState()

	function onPrevious() {
		if (isFetching) return
		setDate(addDays(date, -1))
	}

	function onNext() {
		if (isFuture(addDays(date, 1))) return
		setDate(addDays(date, 1))
	}

	useEffect(() => {
		if (Array.isArray(announcements) && announcements.length > 0) {
			navigation.navigate('Announcement')
		}
	}, [announcements])

	useEffect(() => {
		if (!isFetching && isFocsued) {
			refresh()
		}
	}, [isFocsued, aroState])

	useEffect(() => {
		if (appState === 'active' && isFocsued) {
			checkAnnouncements()
		}
	}, [appState, isFocsued])

	useInterval(() => {
		const now = new Date()
		const newMaxISO = getISO(now)

		// Roll-forward end date and jump to today
		if (newMaxISO !== maxAllowedISO) {
			setMaxAllowedISO(newMaxISO)
			setDate(now)
		}
	}, 30000)

	// Pre-fetch previous summaries on init and change
	useEffect(() => {
		prefetchSummary(getISO(addDays(date, -1)))
		prefetchSummary(getISO(addDays(date, -2)))
		prefetchSummary(getISO(addDays(date, -3)))
		setCalendarMonth(format(date, 'yyyy-MM'))
	}, [date, isSuccess])

	progress.value = Number.isFinite(data?.progress) ? (data?.progress || 0) * 100 : progress.value

	async function toggleConfirmDelete() {
		if (isDeleteModalVisible) {
			refresh()
		}
		setDeleteModalVisible(!isDeleteModalVisible)
	}

	async function setOverNightPress(item: Session) {
		const newIsOvernight = !item.isOvernight
		await update(item.uuid, {
			tagId: newIsOvernight ? 22 : item.tagId,
			isOvernight: newIsOvernight
		})
		refresh()
	}
	const refresh = () => {
		refetch()
		monthRefetch()
	}

	const startNfcScan = async () => {
		const message = await scanNfc()

		// Navigate to AroGo
		if (message) {
			navigation.navigate('AroGo')
		}
	}

	useEffect(() => {
		setMarkedDate(generateMarkedDates(markedDates, date, monthSummary))
	}, [monthSummary, date])

	useEffect(() => {
		const menuAction = [
			{
				id: 'add-session',
				title: 'Add Session',
				image: 'hourglass.badge.plus'
			}
		]

		// if (appUser?.guestInviteCode) {
		// 	menuAction.push({
		// 		id: 'invite-guest',
		// 		title: 'Invite Guest',
		// 		image: 'person.badge.plus'
		// 	})
		// }

		if (appUser?.householdInviteCode) {
			menuAction.push({
				id: 'invite-household',
				title: 'Invite User',
				image: 'person.badge.plus'
			})
		}

		setMenuAction(menuAction)
	}, [appUser])

	return (
		<BaseScreen>
			<Pressable style={styles.container} onPress={() => setIsCalendarOpen(false)}>
				{/* Scan NFC */}
				{GlobalState.nfc.enable && GlobalState.nfc.toggle && (
					<TouchableOpacity
						onPress={() => startNfcScan()}
						style={{
							flexDirection: 'row-reverse',
							top: 45,
							backgroundColor: dichotomousHippopotamus,
							zIndex: 1000,
							left: '6%',
							position: 'absolute',
							padding: 4,
							borderRadius: 50,
							marginEnd: 15,
							width: 34,
							height: 34,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							shadowColor: darkArts,
							shadowRadius: 7,
							shadowOffset: { width: 0, height: 0 },
							shadowOpacity: 1,
							marginVertical: 10,
							transform: [{ rotate: '90deg' }]
						}}>
						<Feather name="wifi" size={20} color="white" />
					</TouchableOpacity>
				)}

				{/* Profile */}
				<TouchableOpacity
					onPress={() => navigation.navigate('Profile')}
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
					<UserAvatar size="medium" user={{ fullname: appUser?.fullname ?? '', avatar: appUser?.avatar }} />
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
							{isToday(date) ? 'Today' : format(date, 'eee,  MMM d')}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={onNext} disabled={isFuture(next)}>
						<Feather name="chevron-right" size={22} color={isFuture(next) ? 'gray' : 'white'} />
					</TouchableOpacity>
				</View>
				{/* Progress Indicator */}
				<View onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ backgroundColor: 'transparent' }}>
					<RingProgress
						onChallengePress={() => {
							//@ts-ignore
							navigation.navigate('MotivationTab', { screen: tabMap.challenges })
						}}
						progress={progress}
						goal={data?.goal || { hours: 1 }}
						achieved={data?.achieved}
						challenges={challenges ?? []}
						sessionCount={data?.sessions?.length || 0}
						onEditGoal={() => navigation.navigate('GoalModal', {})}
						streakLength={isToday(date) ? data?.streakLength : undefined}
					/>
				</View>

				<WeekTracker
					onTouchStart={onTouchStart}
					onTouchEnd={onTouchEnd}
					selectedDate={getISO(date)}
					data={data?.weekdays}
					onPress={(dateString: string) => {
						const newDate = parseISO(dateString)
						if (isFuture(newDate)) return
						setDate(newDate)
						setCalendarMonth(format(date, 'yyyy-MM'))
					}}
				/>

				{/* Action Menu */}
				<SafeAreaView
					style={{
						bottom: 20,
						zIndex: 99999,
						position: 'absolute',
						width: 60,
						right: 0,
						flexDirection: 'row-reverse',
						display: 'flex'
					}}>
					<MenuView
						onPressAction={async ({ nativeEvent }) => {
							const { event } = nativeEvent
							if (event === 'add-session') {
								navigation.navigate('EditSession', { uuid: '' })
							} else if (event === 'invite-guest') {
								Share.share({
									message: `Join me as a guest on Aro with invite code: ${appUser?.guestInviteCode}`
								})
							} else if (event === 'invite-household') {
								// @ts-ignore
								navigation.navigate('Group', {
									screen: 'GroupInvite',
									params: { groupId: appUser?.householdGroupId }
								})
							}
						}}
						actions={menuAction || []}
						shouldOpenOnLongPress={false}>
						<TouchableOpacity
							style={{
								backgroundColor: dichotomousHippopotamus,
								padding: 4,
								borderRadius: 30,
								marginEnd: 15,
								width: 40,
								height: 40,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								shadowColor: darkArts,
								shadowRadius: 7,
								shadowOffset: { width: 0, height: 0 },
								shadowOpacity: 1,
								marginVertical: 10
							}}>
							<Feather name="plus" size={20} color={fill} />
						</TouchableOpacity>
					</MenuView>
				</SafeAreaView>
				{/* Session List */}
				<FlatList
					ListEmptyComponent={isToday(date) ? TodayEmpty : Empty({ date })}
					refreshing={false}
					style={{ width: '90%', marginTop: 10 }}
					contentContainerStyle={{ paddingBottom: 20 }}
					onRefresh={refresh}
					keyExtractor={(item) => `${item.id}`}
					data={data?.sessions}
					showsVerticalScrollIndicator={false}
					renderItem={({ item, index }) => {
						return (
							<DayComponent
								tagsStreak={data?.tagStreaks ?? []}
								item={item}
								tags={tags ?? []}
								navigate={navigation.navigate}
								setDeleteModalVisible={toggleConfirmDelete}
								setDeleteUUID={(uuid) => setDeleteUUID(uuid)}
								setOverNightPress={setOverNightPress}
							/>
						)
					}}
				/>
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
							markedDates={markedDates}
							initialDate={format(date, 'yyyy-MM-dd')}
							enableSwipeMonths={true}
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
							style={{
								borderRadius: 10,
								width: '75%',
								marginLeft: 'auto',
								marginRight: 'auto'
							}}
							onMonthChange={(day) => {
								setCalendarMonth(format(new Date(day.dateString), 'yyyy-MM'))
							}}
							dayComponent={({ date, state, marking }) => {
								const enhancedMarking = marking as MarkingProps & { isOvernight: boolean; progress: number }

								const { width } = useWindowDimensions()
								const xy = width * 0.08

								return (
									<TouchableOpacity
										onPress={() => {
											if (date?.dateString === undefined) return

											const newDate = parseISO(date.dateString)
											if (isFuture(newDate)) return
											setDate(newDate)
											setIsCalendarOpen(false)
										}}
										style={{ backgroundColor: 'transparent' }}>
										<View style={{ alignItems: 'center', backgroundColor: 'transparent', marginTop: '-17%' }}>
											<View style={{ height: 14, backgroundColor: 'transparent' }}>
												{enhancedMarking?.isOvernight && (
													<Ionicons name={'ios-moon'} size={8} color={'white'} style={{}} />
												)}
											</View>
											<View
												style={{
													backgroundColor: 'transparent',
													justifyContent: 'center',
													alignItems: 'center',
													width: xy,
													height: xy
												}}>
												<Text
													style={{
														display: 'flex',
														position: 'absolute',
														textAlign: 'center',
														color:
															state === 'disabled'
																? 'black'
																: enhancedMarking?.selected
																? dichotomousHippopotamus
																: 'white'
													}}>
													{date?.day}
												</Text>
												<View
													style={{
														display: state !== 'disabled' && enhancedMarking?.marked ? 'flex' : 'none',
														backgroundColor: 'transparent'
													}}>
													<DateCircle progress={enhancedMarking?.progress || 0} lineWidth={3} widthPercent={0.1} />
												</View>
											</View>
										</View>
									</TouchableOpacity>
								)
							}}
						/>
					</View>
				)}
				{/* Delete Sesssion Model */}
				{isDeleteModalVisible && ConfirmDeleteModal(toggleConfirmDelete, deleteUUID)}

				<View style={[SharedStyles.glowTop, { zIndex: -1, opacity: 0.5 }]} />
			</Pressable>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		//justifyContent: 'center',
		paddingTop: 60
	}
})

async function onDeleteSession(uuid: string) {
	await deletes(uuid, 'UserDelete')
}

function ConfirmDeleteModal(dismiss: () => void, uuid: string) {
	async function onDelete() {
		await onDeleteSession(uuid)
		await dismiss()
	}

	return (
		<AroModal
			title="Are you sure you want to delete this session?"
			actionBtnTxt="Delete"
			cancelBtnText="Cancel"
			onActionPress={onDelete}
			onCancelPress={dismiss}
			isCancleBtnDisable={false}
		/>
	)
}
