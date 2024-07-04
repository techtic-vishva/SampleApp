import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { format, startOfYear, subDays } from 'date-fns'
import { useEffect, useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import { chattanoogaTapWater, dichotomousHippopotamus, fill } from '../constants/Colors'
import { SessionTagAgg, UserMetrics } from '../core/services/user-stats'
import BaseScreen from '../screens/BaseScreen'
import DateCircle from './DateCircle'
import { Text, View } from './Themed'
import { getUser } from '../core/Authentication'
import TagListItem from './TagListItem'
import { formatDuration } from '../core/format'
import { UseQueryResult } from 'react-query'
import { useIsFocused } from '@react-navigation/native'

export function getISO(date: Date) {
	return format(date, 'yyyy-MM-dd')
}

export const trailing30Days = () => getISO(subDays(new Date(), 30))
export const today = () => getISO(new Date())

export default function GroupUserMetrics({
	isMyStatsView,
	dataProvider,
	usingCustomDates,
	noDataComponent
}: {
	isMyStatsView: boolean
	dataProvider: (start: string, end: string) => UseQueryResult<UserMetrics, unknown>
	usingCustomDates?: boolean
	noDataComponent?: JSX.Element
}) {
	const [index, setIndex] = useState(0)
	const firebaseUser = getUser()
	const [start, setStartDate] = useState(trailing30Days())
	const [end, setEndDate] = useState(today())
	const { data, isFetched, isSuccess, refetch } = dataProvider(start, end)
	const [tagListData, setTagListData] = useState<SessionTagAgg[]>()
	const isFocused = useIsFocused()

	useEffect(() => {
		if (isFocused) refetch()
	}, [isFocused])

	useEffect(() => {
		refreshDates()
	}, [index])

	useEffect(() => {
		if (data === undefined || !Array.isArray(data?.sessionTags)) return

		setTagListData(data.sessionTags)
	}, [isSuccess, isFetched, data])

	function refreshDates() {
		// Past 30 days
		if (index === 0) {
			setStartDate(trailing30Days())
			setEndDate(today())
		} else if (index == 1) {
			// Year-to-Date
			setStartDate(getISO(startOfYear(new Date())))
			setEndDate(today())
		} else {
			// All Time
			setStartDate(getISO(new Date(firebaseUser?.metadata.creationTime || '2022-01-01')))
			setEndDate(today())
		}
	}

	return (
		<BaseScreen>
			<View style={styles.container}>
				{usingCustomDates !== true && (
					<SegmentedControl
						values={['Past 30 Days', 'YTD', 'All Time']}
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
						tintColor={chattanoogaTapWater}
						style={styles.tabStyle}
					/>
				)}

				{/* No Data */}
				{(data?.totalSessionCount ?? 0) == 0 && noDataComponent === undefined && (
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
						<View
							style={{
								position: 'relative',
								top: 100,
								zIndex: 999,
								backgroundColor: fill,
								padding: 10,
								borderRadius: 15,
								width: '90%'
							}}>
							{isMyStatsView && (
								<Text style={{ textAlign: 'center' }}>
									🔒 &nbsp;&nbsp; Record your first Aro Session to unlock{' '}
									<Text style={{ fontFamily: 'objektiv-semi-bold-italic' }}>My Stats ⚡️</Text> for the selected time
									period.
								</Text>
							)}
							{!isMyStatsView && (
								<Text style={{ textAlign: 'center', paddingHorizontal: 5 }}>
									ℹ️ &nbsp;&nbsp; No Aro Sessions have been recorded during the selected time period.
								</Text>
							)}
						</View>
						<Image
							source={require('../assets/images/my-stats-placeholder.png')}
							resizeMode="cover"
							blurRadius={7}
							style={{ width: '100%', height: '100%', opacity: 0.5 }}
						/>
					</View>
				)}

				{/* No Data */}
				{(data?.totalSessionCount ?? 0) == 0 && noDataComponent !== undefined && noDataComponent}

				{/* Total Time */}
				{data?.totalTime && (
					<View style={{ width: '100%', flexDirection: 'column', marginTop: 18 }}>
						<Text style={[styles.countTxtStyle, { textAlign: 'center' }]}>{formatDuration(data.totalTime, 2)}</Text>
						<Text style={[styles.titleStyle, { marginTop: 0, textAlign: 'center' }]}>TOTAL ARO TIME</Text>
					</View>
				)}
				{/* Session Status */}
				{(data?.totalSessionCount ?? 0) != 0 && (
					<View style={styles.rowView}>
						<View style={styles.rowContainer}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image
									source={require('../assets/images/logo.png')}
									resizeMode="contain"
									style={{ height: 16, width: 16, alignSelf: 'center', tintColor: dichotomousHippopotamus }}
								/>
								<Text style={styles.countTxtStyle}>{data?.totalSessionCount ?? 0}</Text>
							</View>
							<Text style={styles.titleStyle}>NUMBER OF</Text>
							<Text style={styles.subTitleStyle}>SESSIONS</Text>
						</View>

						<View style={[styles.rowContainer]}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<DateCircle
									progress={0}
									goalProgress={parseInt(`${data?.averageGoalObtainment || 0}`, 10)}
									lineWidth={2}
									widthPercent={0.04}
								/>

								<Text style={styles.countTxtStyle}>
									{data?.averageGoalObtainment || '0'}
									<Text style={styles.unitTextStyle}>%</Text>
								</Text>
							</View>
							<Text style={styles.titleStyle}>AVERAGE</Text>
							<Text style={styles.subTitleStyle}>GOAL OBTAINED</Text>
						</View>
					</View>
				)}
				{/* Tag List */}
				{(data?.totalSessionCount ?? 0) != 0 && (
					<View style={{ width: '85%', flex: 1, marginTop: '5%' }}>
						{tagListData &&
							tagListData.map((item, index) => <TagListItem index={index} sessiogTagAgg={item} key={index} />)}
					</View>
				)}
			</View>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'center',
		flex: 1,
		width: '100%'
	},
	tabTxtStyle: {
		color: 'white',
		fontFamily: 'objektiv-semi-bold',
		fontSize: 16
	},
	tabStyle: {
		width: '80%',
		borderRadius: 10,
		height: 35,
		marginTop: '5%',
		backgroundColor: '#171513'
	},
	rowView: {
		flexDirection: 'row',
		backgroundColor: 'transparent',
		width: '80%',
		marginVertical: 18,
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	rowContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	countTxtStyle: {
		color: 'white',
		fontFamily: 'objektiv-semi-bold',
		fontSize: 25,
		marginStart: '5%'
	},
	titleStyle: {
		color: chattanoogaTapWater,
		textAlign: 'center',
		fontFamily: 'objektiv-semi-bold',
		fontSize: 12,
		opacity: 0.6,
		marginTop: '6%'
	},
	subTitleStyle: {
		color: 'white',
		textAlign: 'center',
		fontFamily: 'objektiv-semi-bold',
		fontSize: 12
	},
	unitTextStyle: {
		fontFamily: 'objektiv-semi-bold',
		fontSize: 16
	}
})
