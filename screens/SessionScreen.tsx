import { Feather, Ionicons } from '@expo/vector-icons'
import { MenuView } from '@react-native-menu/menu'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { CompositeNavigationProp, useIsFocused } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { format } from 'date-fns'
import LottieView from 'lottie-react-native'
import React, { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import Loading from '../components/Loading'
import { Text, View } from '../components/Themed'
import { chattanoogaTapWater, dichotomousHippopotamus, fill } from '../constants/Colors'
import SharedStyles from '../constants/Styles'
import { PhoneState } from '../core/connectivity/AroDevice'
import { emitDeviceConnection } from '../core/EventBroker'
import { formatDuration, formatLocalTimeWithoutSeconds, parseDuration, timeRange } from '../core/format'
import { Session, Tag, TagStreak, useInfiniteSessionList, useSessionStats, useTags } from '../core/services/session'
import { useActiveTime } from '../hooks/useActiveTime'
import { useSwipe } from '../hooks/useSwipe'
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types'
import BaseScreen from './BaseScreen'

export function Empty() {
	return (
		<View style={{ width: '100%', flex: 1, marginTop: 100 }}>
			<Text style={{ color: chattanoogaTapWater, textAlign: 'center', fontSize: 20 }}>Welcome to Aro!</Text>
			<Text style={{ color: chattanoogaTapWater, textAlign: 'center', fontSize: 15, padding: 10 }}>
				Get started with your first session.
			</Text>
		</View>
	)
}

function Month({
	navigation
}: {
	navigation: CompositeNavigationProp<
		BottomTabNavigationProp<RootTabParamList, 'SessionTab'>,
		NativeStackNavigationProp<RootStackParamList, 'Root'>
	>
}) {
	const { data, refetch, isRefetching, isLoading } = useSessionStats('month')

	return <StatsList isLoading={isLoading} refreshing={isRefetching} data={data} onRefresh={refetch} />
}

function Year({
	navigation
}: {
	navigation: CompositeNavigationProp<
		BottomTabNavigationProp<RootTabParamList, 'SessionTab'>,
		NativeStackNavigationProp<RootStackParamList, 'Root'>
	>
}) {
	const { data, refetch, isRefetching, isLoading } = useSessionStats('year')

	return <StatsList isLoading={isLoading} refreshing={isRefetching} data={data} onRefresh={refetch} />
}

type navType = CompositeNavigationProp<
	BottomTabNavigationProp<RootTabParamList, 'SessionTab'>,
	NativeStackNavigationProp<RootStackParamList, 'Root'>
>

export function DayComponent({
	item,
	navigate,
	tags,
	tagsStreak,
	setDeleteModalVisible,
	setDeleteUUID,
	setOverNightPress
}: {
	item: Session
	navigate: (id: string, param: any) => void
	tags: Tag[]
	tagsStreak: TagStreak[]
	setDeleteModalVisible: (isDeleteModelVisible: boolean) => void
	setDeleteUUID: (uuid: string) => void
	setOverNightPress: (item: Session) => void
}) {
	const tag = tags?.find((t) => t.id === item.tagId)
	const tagStreak = tagsStreak?.find((streak) => streak.tagId === item.tagId)
	const isInProgress = !item.endTime
	const activeTime = useActiveTime(item.startTime, isInProgress)

	if (!isInProgress)
		return (
			<MenuView
				onPressAction={({ nativeEvent }) => {
					switch (nativeEvent.event) {
						case 'edit-session':
							navigate('EditSession', { uuid: item.uuid })
							break
						case 'delete-session':
							setDeleteModalVisible(true)
							setDeleteUUID(item.uuid)
							break
						case 'set-overnight':
							setOverNightPress(item)
							break
					}
				}}
				actions={[
					{
						id: 'set-overnight',
						title: `Toggle Overnight`,
						image: item.isOvernight ? 'moon.fill' : 'moon'
					},
					{
						id: 'delete-session',
						title: 'Delete Session',
						image: 'trash'
					},
					{
						id: 'edit-session',
						title: 'Edit Session',
						image: 'pencil'
					}
				]}
				shouldOpenOnLongPress={true}>
				<View style={{ backgroundColor: 'transparent' }}>
					<TouchableOpacity
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							backgroundColor: fill,
							paddingHorizontal: 20,
							paddingVertical: 15,
							borderRadius: 15,
							marginVertical: 10
						}}
						onLongPress={() => {}}
						onPress={() => {
							navigate('EditSession', { uuid: item.uuid })
						}}>
						<View style={{ flex: 1, backgroundColor: fill, justifyContent: 'center', paddingRight: 5 }}>
							<Text numberOfLines={1} style={{ fontSize: 18, fontFamily: 'objektiv-md' }}>
								{tag?.name}
							</Text>
						</View>

						{(tagStreak?.days || 0) > 1 && (
							<View
								style={{
									marginLeft: 'auto',
									marginRight: 10,
									backgroundColor: 'transparent',
									alignItems: 'center'
								}}>
								<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
									<Text
										style={{
											fontSize: 14,
											color: chattanoogaTapWater,
											fontFamily: 'objektiv-semi-bold'
										}}>
										{tagStreak?.days}
									</Text>
									<Text style={{ fontSize: 10, paddingLeft: 2 }}>🔥</Text>
								</View>
								<Text style={{ color: chattanoogaTapWater, fontSize: 8 }}>Streak</Text>
							</View>
						)}

						<View style={{ backgroundColor: fill, alignItems: 'flex-end' }}>
							<Text style={{ fontSize: 14, fontFamily: 'objektiv-semi-bold' }}>
								{item.duration ? formatDuration(item.duration) : '---'}
							</Text>
							<Text style={{ fontSize: 8, fontFamily: 'objektiv', color: chattanoogaTapWater }}>
								{timeRange(item.startTime, item.endTime)}
							</Text>
						</View>

						{item.isOvernight && (
							<Ionicons
								name={'ios-moon'}
								size={12}
								color={dichotomousHippopotamus}
								style={{ position: 'absolute', right: 5, top: 5 }}
							/>
						)}
					</TouchableOpacity>
				</View>
			</MenuView>
		)

	return (
		<MenuView
			onPressAction={async ({ nativeEvent }) => {
				if (nativeEvent.event == '1') {
					emitDeviceConnection({
						newState: PhoneState.OUT,
						previousState: PhoneState.IN,
						aroDeviceId: 'unknown',
						metadata: { manualEnd: true }
					})
				}
			}}
			actions={[
				{
					id: '2',
					title: 'Cancel',
					attributes: {
						destructive: true
					}
				},
				{
					id: '1',
					title: 'End Session'
				}
			]}
			shouldOpenOnLongPress={false}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					backgroundColor: fill,
					paddingHorizontal: 20,
					paddingVertical: 15,
					borderRadius: 15,
					marginVertical: 10,
					borderColor: dichotomousHippopotamus,
					borderWidth: 2
				}}>
				<View style={{ backgroundColor: fill, justifyContent: 'center' }}>
					<Text style={{ fontSize: 18, fontFamily: 'objektiv-md-italic' }}>{'In Progress'}</Text>
				</View>

				<View
					style={{
						backgroundColor: fill,
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'row'
					}}>
					<View style={{ paddingRight: 10, backgroundColor: 'tansparent' }}>
						<Text style={{ fontSize: 14, fontFamily: 'objektiv-semi-bold', paddingRight: 10 }}>{activeTime}</Text>
						<Text style={{ fontSize: 8, fontFamily: 'objektiv', color: chattanoogaTapWater }}>
							{formatLocalTimeWithoutSeconds(new Date(item.startTime))}
						</Text>
					</View>
					<LottieView
						source={require('../assets/animations/pulese.min.json')}
						style={{ width: 34, height: 34 }}
						loop={true}
						autoPlay={true}
					/>
				</View>
			</View>
		</MenuView>
	)
}

export function Day({ navigation }: { navigation: navType }) {
	const { data: tags } = useTags()
	const { fetchNextPage, data, refetch, isRefetching, isLoading, isFetching, isStale, hasNextPage } =
		useInfiniteSessionList()

	const flatData: Session[] = []
	for (const page of data?.pages || []) {
		flatData.push(...page.data)
	}

	if (isLoading) {
		return <Loading />
	}

	return (
		<FlatList
			ListEmptyComponent={Empty}
			onRefresh={refetch}
			refreshing={false}
			onEndReached={() => (hasNextPage ? fetchNextPage() : () => {})}
			onEndReachedThreshold={0.3}
			style={{ width: '90%', paddingTop: 30 }}
			contentContainerStyle={{ paddingBottom: 50 }}
			keyExtractor={(item) => `${item.id}`}
			data={flatData}
			renderItem={({ item, index }) => {
				let showDayDivider = false
				if (item.endTime) {
					if (index === 0) showDayDivider = true
					else if (flatData && flatData[index - 1]?.endTime)
						showDayDivider =
							format(new Date(flatData[index - 1]?.endTime), 'yyyy-MM-dd') !==
							format(new Date(item.endTime), 'yyyy-MM-dd')
				}

				const tag = tags?.find((t) => t.id === item.tagId)

				return (
					<>
						{showDayDivider && (
							<View
								style={{
									paddingHorizontal: 30,
									paddingBottom: 10,
									paddingTop: index === 0 ? undefined : 30,
									flexDirection: 'row',
									alignItems: 'center',
									backgroundColor: 'transparent'
								}}>
								<Text>{format(new Date(item.endTime), 'EEEE, MMMM do')}</Text>
								<Text style={{ marginLeft: 'auto', color: chattanoogaTapWater, fontSize: 10 }}>
									{format(new Date(item.endTime), 'yyyy')}
								</Text>
							</View>
						)}
						{/* @ts-ignore */}
						<DayComponent tags={tags || []} item={item} navigate={navigation.navigate} />
					</>
				)
			}}
		/>
	)
}

function StatsList({
	isLoading,
	refreshing,
	data,
	onRefresh
}: {
	isLoading: boolean
	refreshing: boolean
	data: any[] | undefined
	onRefresh: () => {}
}) {
	if (isLoading) {
		return <Loading />
	}
	return (
		<FlatList
			ListEmptyComponent={Empty}
			onRefresh={onRefresh}
			refreshing={false}
			style={{ width: '90%', paddingTop: 30 }}
			contentContainerStyle={{ paddingBottom: 50 }}
			keyExtractor={(item) => `${item.year}|${item.month || -1}`}
			data={data}
			renderItem={({ item, index }) => {
				const [label, count] = parseDuration(item.duration)

				let showMonthDivider = false
				if (item.month) {
					if (index === 0) showMonthDivider = true
					else if (data) showMonthDivider = data[index - 1]?.year !== item.year
				}

				return (
					<>
						{showMonthDivider && (
							<View
								style={{
									paddingLeft: 30,
									paddingBottom: 10,
									paddingTop: index === 0 ? undefined : 30
								}}>
								<Text>{item.year}</Text>
							</View>
						)}
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								backgroundColor: fill,
								padding: 30,
								borderRadius: 15,
								marginVertical: 10
							}}>
							<View style={{ backgroundColor: fill }}>
								<Text style={{ fontSize: 20, fontFamily: 'objektiv-md' }}>
									{(item.month && format(new Date(`2022-${item.month + 1}-01`), 'MMM')) || item.year}
								</Text>
								<Text style={{ fontSize: 16, color: chattanoogaTapWater }}>
									{item.sessions} session{item.sessions > 1 ? 's' : ''}
								</Text>
							</View>
							<View style={{ backgroundColor: fill, alignItems: 'center' }}>
								<Text style={{ fontSize: 16, fontFamily: 'objektiv-semi-bold' }}>{count}</Text>
								<Text style={{ fontSize: 16, fontFamily: 'objektiv-semi-bold' }}>{label}</Text>
							</View>
						</View>
					</>
				)
			}}
		/>
	)
}

const values = ['Years', 'Months', 'Days']

export default function SessionsScreen({ navigation }: RootTabScreenProps<'SessionTab'>) {
	const [index, setIndex] = useState(2)
	const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight)
	const isFocued = useIsFocused()

	function onSwipeRight() {
		if (index > 0) setIndex(index - 1)
	}

	function onSwipeLeft() {
		if (index < 2) setIndex(index + 1)
	}

	let Component = Year
	if (index === 1) Component = Month
	else if (index === 2) Component = Day

	return (
		<BaseScreen>
			<View style={styles.container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
				<SegmentedControl
					values={values}
					selectedIndex={index}
					onChange={(event) => setIndex(event.nativeEvent.selectedSegmentIndex)}
					fontStyle={{
						color: chattanoogaTapWater,
						fontFamily: 'objektiv-md',
						fontSize: 14
					}}
					activeFontStyle={{
						color: fill
					}}
					tintColor={dichotomousHippopotamus}
					style={{ width: '90%', marginTop: 90, borderRadius: 0, height: 40 }}
				/>

				{isFocued && <Component navigation={navigation} />}

				<View style={[SharedStyles.glowTop, { zIndex: -1 }]} />
			</View>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center'
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%'
	}
})
