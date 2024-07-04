import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Dimensions, Pressable } from 'react-native'
import { View, Text } from './Themed'
import DateCircle from './DateCircle'

type CalendarEntry = {
	date: string
	isOvernight: boolean
	progress: number
}

const size = Dimensions.get('window').width * 0.1
const r = size * 0.4

function Day({
	label,
	entry,
	selected,
	onPress
}: {
	label: string
	entry: CalendarEntry
	selected: boolean
	onPress: (dateString: string) => void
}) {
	return (
		<Pressable
			onPress={() => onPress(entry.date)}
			style={{
				flex: 1,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'transparent'
			}}>
			<View style={{ height: 12, backgroundColor: 'transparent' }}>
				{entry?.isOvernight && <Ionicons name={'ios-moon'} size={9} color={'white'} />}
			</View>
			<DateCircle progress={entry?.progress || 0} lineWidth={3} widthPercent={0.1} />
			<View
				style={{
					position: 'absolute',
					width: size,
					height: size,
					backgroundColor: 'transparent',
					alignItems: 'center',
					justifyContent: 'center',
					display: 'flex',
					paddingLeft: 1
				}}>
				<Text style={{ fontFamily: 'objektiv-semi-bold' }}>{label}</Text>
			</View>
			<View style={{ height: 12, backgroundColor: 'transparent' }}>
				{selected && <Ionicons name={'caret-up'} size={9} color={'white'} style={{ paddingTop: 2 }} />}
			</View>
		</Pressable>
	)
}

const EmptyDataEntry: CalendarEntry = {
	date: '0000-00-00',
	isOvernight: false,
	progress: 0
}

const EmptyData = [
	EmptyDataEntry,
	EmptyDataEntry,
	EmptyDataEntry,
	EmptyDataEntry,
	EmptyDataEntry,
	EmptyDataEntry,
	EmptyDataEntry
]

export default function WeekTracker({
	selectedDate,
	data,
	onPress,
	onTouchStart,
	onTouchEnd
}: {
	selectedDate: string
	data?: CalendarEntry[]
	onPress: (dateString: string) => void
	onTouchStart: (e: any) => void
	onTouchEnd: (e: any) => void
}) {
	if (!Array.isArray(data) || data.length !== 7) data = EmptyData

	return (
		<View
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			style={{
				width: '90%',
				display: 'flex',
				flexDirection: 'row',
				height: '10%',
				justifyContent: 'space-between',
				marginTop: 10,
				backgroundColor: 'transparent'
			}}>
			<Day label="M" entry={data[0]} selected={data[0]?.date?.substring(0, 10) === selectedDate} onPress={onPress} />
			<Day label="T" entry={data[1]} selected={data[1]?.date?.substring(0, 10) === selectedDate} onPress={onPress} />
			<Day label="W" entry={data[2]} selected={data[2]?.date?.substring(0, 10) === selectedDate} onPress={onPress} />
			<Day label="T" entry={data[3]} selected={data[3]?.date?.substring(0, 10) === selectedDate} onPress={onPress} />
			<Day label="F" entry={data[4]} selected={data[4]?.date?.substring(0, 10) === selectedDate} onPress={onPress} />
			<Day label="S" entry={data[5]} selected={data[5]?.date?.substring(0, 10) === selectedDate} onPress={onPress} />
			<Day label="S" entry={data[6]} selected={data[6]?.date?.substring(0, 10) === selectedDate} onPress={onPress} />
		</View>
	)
}
