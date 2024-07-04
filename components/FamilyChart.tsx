import React, { useEffect, useState } from 'react'
import {
	VictoryChart,
	VictoryStack,
	VictoryBar,
	VictoryAxis,
	VictoryLine,
	VictoryTheme,
	VictoryScatter,
	VictoryLabel,
	VictoryClipContainer
} from 'victory-native'
import { useSummaryChart } from '../core/services/group'
import { View } from './Themed'
import { Dimensions } from 'react-native'
import { chattanoogaTapWater, fill, vitaminCBathwater } from '../constants/Colors'
import Loading from './Loading'
import { HeaderText } from './StyledText'
import UserAvatar from '../components/UserAvatar'
import { formatDuration, toMinutes } from '../core/format'
import { useIsFocused } from '@react-navigation/native'

export function durationToStackLabel(duration: Duration | undefined | string) {
	if (!duration) return 0
	if (typeof duration !== 'string') duration = `${duration.hours || 0}:${duration.minutes || 0}:00}`
	let [hours, minutes, seconds] = (duration as string).split(':').map((s) => parseInt(s, 10))

	// No data, then no label
	if (hours === 0 && minutes === 0) return ''

	let minutes_string = minutes ? (minutes / 60).toFixed(1).split('.')[1] : '0'
	return `${hours}.${minutes_string} hr`
}

const chartTheme = Object.assign({}, VictoryTheme.grayscale)
// @ts-ignore
chartTheme.axis.style.tickLabels.fill = 'white'
// @ts-ignore
chartTheme.axis.style.axis.stroke = 'transparent'
// @ts-ignore
chartTheme.axis.style.grid.stroke = 'transparent'

export default function ({
	startDate,
	groupId,
	endDate,
	userColorMap
}: {
	startDate: string
	groupId: string
	endDate: string
	userColorMap: { [key: string]: string }
}) {
	const [includeOvernight, setIncludeOvernight] = useState(false)
	const { data, isLoading, refetch } = useSummaryChart(groupId, startDate, endDate, includeOvernight)
	const { width } = Dimensions.get('window')
	const [chartSeries, setChartSeries] = useState<{ userId: string; series: { x: string; y: number }[] }[]>()
	const [lables, setLables] = useState<string[]>()
	const isFocused = useIsFocused()

	useEffect(() => {
		if (isFocused) refetch()
	}, [isFocused])

	useEffect(() => {
		if (!data || isLoading || !data.users) return

		const charUserSeries = data.users.map((user) => {
			const series = [
				{
					x: 'M',
					y: toMinutes(data?.calendar?.monday?.users?.find((u) => u.userId === user.userId)?.totalTime)
				},
				{
					x: 'T',
					y: toMinutes(data?.calendar?.tuesday?.users?.find((u) => u.userId === user.userId)?.totalTime)
				},
				{
					x: 'W',
					y: toMinutes(data?.calendar?.wednesday?.users?.find((u) => u.userId === user.userId)?.totalTime)
				},
				{
					x: 'TH',
					y: toMinutes(data?.calendar?.thursday?.users?.find((u) => u.userId === user.userId)?.totalTime)
				},
				{
					x: 'F',
					y: toMinutes(data?.calendar?.friday?.users?.find((u) => u.userId === user.userId)?.totalTime)
				},
				{
					x: 'S',
					y: toMinutes(data?.calendar?.saturday?.users?.find((u) => u.userId === user.userId)?.totalTime)
				},
				{
					x: 'SU',
					y: toMinutes(data?.calendar?.sunday?.users?.find((u) => u.userId === user.userId)?.totalTime)
				}
			]

			return { series, userId: user.userId }
		})
		const chartLables = [
			durationToStackLabel(data.calendar.monday.totalDuration).toString(),
			durationToStackLabel(data.calendar.tuesday.totalDuration).toString(),
			durationToStackLabel(data.calendar.wednesday.totalDuration).toString(),
			durationToStackLabel(data.calendar.thursday.totalDuration).toString(),
			durationToStackLabel(data.calendar.friday.totalDuration).toString(),
			durationToStackLabel(data.calendar.saturday.totalDuration).toString(),
			durationToStackLabel(data.calendar.sunday.totalDuration).toString()
		]
		setLables(chartLables)
		setChartSeries(charUserSeries)
	}, [data])

	const familyGoal = data?.householdGoal ? toMinutes(data.householdGoal) : 0
	const showLoadingIndicator = isLoading || !data || !data.calendar

	return (
		<View
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				backgroundColor: fill,
				paddingTop: 15,
				marginVertical: 20
			}}>
			<View
				style={{
					backgroundColor: 'transparent',
					display: 'flex',
					flexDirection: 'row',
					width: '90%'
				}}>
				<HeaderText
					style={{
						color: chattanoogaTapWater,
						fontSize: 17,
						fontFamily: 'objektiv-semi-bold'
					}}>
					Intentional Time
				</HeaderText>
			</View>

			{showLoadingIndicator && (
				<View style={{ width, height: width * 0.6, backgroundColor: 'transparent' }}>
					<Loading />
				</View>
			)}

			{!showLoadingIndicator && (
				<VictoryChart width={width} height={width * 0.6} domainPadding={{ x: 20 }} theme={chartTheme}>
					<VictoryLine
						data={[
							{
								x: 'M',
								y: familyGoal
							},
							{ x: 'SU', y: familyGoal }
						]}
						groupComponent={<VictoryClipContainer clipPadding={{ left: 40, right: 40 }} />}
						domainPadding={{ x: -80 }}
						style={{
							data: { stroke: vitaminCBathwater, strokeWidth: 2, strokeDasharray: 3, strokeOpacity: 0.5, width }
						}}
					/>
					<VictoryStack
						labels={lables}
						animate
						labelComponent={
							<VictoryLabel
								inline
								textAnchor="middle"
								style={[{ fill: 'white', fontFamily: 'objektiv-semi-bold', fontSize: 9 }]}
							/>
						}>
						{chartSeries?.map((series, index) => {
							return (
								<VictoryBar
									cornerRadius={{
										top: (barData) => {
											// Does another bar exist above this one?
											return chartSeries.some(
												(cs, searchIndex) =>
													searchIndex > index && cs.series.some((cs) => cs.x === barData.datum.x && cs.y > 0)
											)
												? 0
												: 2
										},
										bottom: (barData) => {
											// Does another bar exist below this one?
											return chartSeries.some(
												(cs, searchIndex) =>
													searchIndex < index && cs.series.some((cs) => cs.x === barData.datum.x && cs.y > 0)
											)
												? 0
												: 2
										}
									}}
									data={series.series}
									key={index}
									style={{
										data: {
											fill: userColorMap[series.userId]
										}
									}}
								/>
							)
						})}
					</VictoryStack>
					<VictoryScatter
						data={[{ x: 'M', y: familyGoal }]}
						labels={() => ['Goal']}
						style={{ data: { fill: 'transparent' } }}
						labelComponent={
							<VictoryLabel
								style={[{ fill: vitaminCBathwater, fontFamily: 'objektiv-semi-bold', fontSize: 12 }]}
								inline
								dx={-60}
								textAnchor="start"
								verticalAnchor="middle"
							/>
						}
					/>
					<VictoryScatter
						data={[{ x: 'SU', y: familyGoal }]}
						labels={() => [formatDuration(data?.householdGoal)]}
						style={{ data: { fill: 'transparent' } }}
						labelComponent={
							<VictoryLabel
								style={[{ fill: vitaminCBathwater, fontFamily: 'objektiv-semi-bold', fontSize: 12 }]}
								inline
								textAnchor="end"
								dx={60}
								verticalAnchor="middle"
							/>
						}
					/>
					<VictoryAxis tickFormat={['M', 'T', 'W', 'T', 'F', 'S', 'S']} />
				</VictoryChart>
			)}
		</View>
	)
}
