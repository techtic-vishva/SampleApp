import React, { useMemo, useState, useRef } from 'react'
import {
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Pressable,
	Share,
	Modal,
	GestureResponderEvent,
	Image,
	Platform
} from 'react-native'
import { Text, View } from '../components/Themed'
import { ProfileTabScreenProps } from '../types'
import BaseScreen from './BaseScreen'
import { useWeeklyRecap } from '../core/services/user-stats'
import Loading from '../components/Loading'
import { chattanoogaTapWater, dichotomousHippopotamus, darkArts, fill } from '../constants/Colors'
import { format, isSameMonth } from 'date-fns'
import { formatDuration } from '../core/format'
import { previousMonday, previousSunday } from 'date-fns'
import { Feather, Ionicons } from '@expo/vector-icons'
import TagListItem from '../components/TagListItem'
import { WeeklyRecap } from '../core/services/user-stats'
import OrangeButton from '../components/OrangeButton'
import ViewShot from 'react-native-view-shot'
import { useUser } from '../core/services/user'
import UserAvatar from '../components/UserAvatar'
import { mark } from '../core/services/achievement'

function buildDates(params: Readonly<{ startDate: string; endDate: string }>): [string, string] {
	const isLatest = params.endDate === 'latest'
	if (!isLatest) return [params.startDate, params.endDate]

	const end = previousSunday(new Date())
	const start = previousMonday(end)

	return [start.toISOString(), end.toISOString()]
}

export default function WeeklyRecapScreen({ navigation, route }: ProfileTabScreenProps<'WeeklyRecap'>) {
	const [startOf, endOf] = useMemo(() => buildDates(route.params), [route.params])
	const [includeOvernight, setIncludeOvernight] = useState(false)
	const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false)

	const { data, isSuccess } = useWeeklyRecap(endOf, includeOvernight)
	if (!isSuccess) return <Loading />

	const startDate = new Date(startOf)
	const endDate = new Date(endOf)
	const dateRangeTitle = `${format(startDate, 'MMM d')} - ${
		isSameMonth(startDate, endDate) ? format(endDate, 'd') : format(endDate, 'MMM d')
	}`

	return (
		<BaseScreen>
			<WeeklyRecapPreview
				includeOvernight={includeOvernight}
				includeOvernightPress={() => {
					setIncludeOvernight(!includeOvernight)
				}}
				dateRangeTitle={dateRangeTitle}
				data={data}
				isFullRendering={true}
				onShareClick={() => setIsCapturingScreenshot(true)}
			/>

			<ShareModal
				includeOvernight={includeOvernight}
				includeOvernightPress={() => {
					setIncludeOvernight(!includeOvernight)
				}}
				dateRangeTitle={dateRangeTitle}
				data={data}
				isVisible={isCapturingScreenshot}
				onDismiss={() => setIsCapturingScreenshot(false)}
			/>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 90,
		alignItems: 'center'
	},
	dateTxtStyle: {
		fontSize: 16,
		fontFamily: 'objektiv-md',
		color: dichotomousHippopotamus
	},
	regainedTxtStyle: {
		fontSize: 18,
		fontFamily: 'objektiv-md',
		color: 'white',
		marginTop: '15%',
		textAlign: 'center'
	},
	rowContainer: {
		flexDirection: 'row',
		backgroundColor: 'transparent',
		width: '95%'
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

function WeeklyRecapPreview({
	includeOvernight,
	includeOvernightPress,
	dateRangeTitle,
	data,
	isFullRendering,
	onShareClick
}: {
	includeOvernight: boolean
	includeOvernightPress?: (event: GestureResponderEvent) => void
	dateRangeTitle: string
	data: WeeklyRecap
	isFullRendering: boolean
	onShareClick?: (event: GestureResponderEvent) => void
}) {
	const { data: userData } = useUser()
	const isSharePreview = !isFullRendering

	return (
		<View style={isFullRendering ? styles.container : { flex: 1, alignItems: 'center', paddingTop: 10 }}>
			{/* Inject title into share preview */}
			{isSharePreview && (
				<Text style={{ fontFamily: 'objektiv-semi-bold', fontSize: 16, marginBottom: '3%' }}>Weekly Recap</Text>
			)}

			{/* Add logo to share preview */}
			{isSharePreview && (
				<Image
					source={require('../assets/images/wordmark-white.png')}
					resizeMode="contain"
					style={{ position: 'absolute', right: 10, top: 10, height: 15, width: 40 }}
				/>
			)}

			{/* Add Avatar to Share Preview */}
			{isSharePreview && (
				<UserAvatar
					style={{ position: 'absolute', top: 10, left: 10 }}
					user={{ avatar: userData?.avatar, fullname: userData?.fullname ?? '' }}
					size="medium"
				/>
			)}

			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '85%'
				}}>
				{/* Share icon */}
				{
					<TouchableOpacity
						disabled={isSharePreview || Platform.OS === 'android'}
						onPress={onShareClick}
						style={{ flex: 1 }}>
						{isFullRendering && Platform.OS !== 'android' && (
							<Feather name={'share'} size={22} color={chattanoogaTapWater} />
						)}
					</TouchableOpacity>
				}

				<Text style={[styles.dateTxtStyle, { flex: 2, textAlign: 'center' }]}>{dateRangeTitle}</Text>
				<Pressable
					style={{
						display: 'flex',
						flexDirection: 'row',
						zIndex: 100,
						flex: 1
					}}
					disabled={isSharePreview}
					onPress={includeOvernightPress}>
					<View style={{ flex: 1, backgroundColor: 'transparent' }}>
						{isFullRendering && (
							<>
								<Text style={{ fontSize: 8, color: chattanoogaTapWater, paddingRight: 5, textAlign: 'right' }}>
									Include
								</Text>
								<Text style={{ fontSize: 8, color: chattanoogaTapWater, paddingRight: 5, textAlign: 'right' }}>
									Overnights
								</Text>
							</>
						)}
					</View>
					<Ionicons
						style={{ marginLeft: 'auto', marginRight: '5%' }}
						name={includeOvernight ? 'ios-moon' : 'ios-moon-outline'}
						size={22}
						color={includeOvernight ? dichotomousHippopotamus : chattanoogaTapWater}
					/>
				</Pressable>
			</View>

			<View style={{ marginTop: 30, height: 1, width: '80%' }} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

			<ScrollView>
				<View style={isFullRendering ? [styles.container, { paddingTop: 30 }] : { flex: 1, display: 'flex' }}>
					<View style={[styles.rowContainer, { marginTop: '5%' }]}>
						<View style={{ width: '55%' }}>
							<Text style={styles.titleStyle}>YOU REGAINED</Text>
							<Text style={styles.subTitleStyle}>{data.totalTime ? formatDuration(data.totalTime) : '0 min'}</Text>
						</View>
						<View>
							<Text style={styles.titleStyle}>TOTAL SESSIONS</Text>
							<Text style={styles.subTitleStyle}>{data.totalSessions || 0}</Text>
						</View>
					</View>

					<View style={[styles.rowContainer, { marginTop: '10%', marginBottom: 30 }]}>
						<View style={{ width: '55%' }}>
							<Text style={styles.titleStyle}>AVG. DAILY TIME</Text>
							<Text style={styles.subTitleStyle}>{data.averageTime ? formatDuration(data.averageTime) : '0 min'}</Text>
						</View>
						<View>
							<Text style={styles.titleStyle}>GOAL MET</Text>
							<Text style={styles.subTitleStyle}>{`${data.countGoalMet || 0} days`}</Text>
						</View>
					</View>

					{data.topActivities.length != 0 && (
						<Text
							style={[
								styles.regainedTxtStyle,
								{ marginBottom: '7%', marginTop: '7%' },
								{ color: chattanoogaTapWater }
							]}>
							Your Top Phone-Free Activities
						</Text>
					)}
					{data.topActivities.length != 0 &&
						data.topActivities.map((item, index) => <TagListItem index={index} sessiogTagAgg={item} key={index} />)}
				</View>
			</ScrollView>
		</View>
	)
}

function ShareModal({
	includeOvernight,
	includeOvernightPress,
	dateRangeTitle,
	data,
	isVisible,
	onDismiss
}: {
	includeOvernight: boolean
	includeOvernightPress?: (event: GestureResponderEvent) => void
	dateRangeTitle: string
	data: WeeklyRecap
	isVisible: boolean
	onDismiss: () => void
}) {
	const viewShotRef = useRef<ViewShot>()

	function onSharePress() {
		const instance = viewShotRef.current
		if (instance === undefined || instance.capture === undefined) return

		instance
			.capture()
			.then((uri) => {
				return Share.share({ url: uri })
			})
			.then(async (result) => {
				if (result.action !== Share.dismissedAction) {
					await mark('first-share')
				}
			})
			.finally(onDismiss)
	}

	return (
		<Modal visible={isVisible} onDismiss={onDismiss} animationType="slide" transparent={true} style={{}}>
			<>
				<View
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						bottom: 0,
						borderRadius: 15,

						position: 'absolute',
						backgroundColor: fill
					}}>
					<TouchableOpacity onPress={onDismiss} style={{ position: 'absolute', top: 10, left: 10 }}>
						<Feather name="x" color={darkArts} size={18} />
					</TouchableOpacity>
					<View
						style={{
							width: '87%',
							height: 420,
							alignItems: 'center',
							margin: 20,
							alignSelf: 'center',
							marginTop: 30,
							borderRadius: 15
						}}>
						<ScrollView>
							<ViewShot ref={(ref) => (viewShotRef.current = ref || undefined)} options={{ format: 'png' }}>
								<WeeklyRecapPreview
									includeOvernight={includeOvernight}
									includeOvernightPress={includeOvernightPress}
									dateRangeTitle={dateRangeTitle}
									data={data}
									isFullRendering={false}
									onShareClick={() => {}}
								/>
							</ViewShot>
						</ScrollView>
					</View>
					<OrangeButton
						onPress={onSharePress}
						title="Share"
						outterStyle={{ marginBottom: 50, marginTop: 10, width: '87%', alignSelf: 'center' }}
					/>
				</View>
			</>
		</Modal>
	)
}
