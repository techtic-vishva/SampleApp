import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { HeaderText } from './StyledText'
import { View, Text } from './Themed'
import SharedStyles from '../constants/Styles'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { useEffect, useState } from 'react'
import { useUser } from '../core/services/user'
import { chattanoogaTapWater } from '../constants/Colors'
import { formatDuration } from '../core/format'
import { Feather } from '@expo/vector-icons'

const toInterval = (date: Date) => `${date.getHours()}:${date.getMinutes()}`
const toDuration = (interval: string) => {
	if (!interval.includes(':')) return {}

	const hours = Number(interval.split(':')[0].trim())
	const minutes = Number(interval.split(':')[1].trim())
	return { hours, minutes }
}
const toDate = ({ hours, minutes }: { hours: number; minutes: number }) => {
	const date = new Date('2022-01-02T00:24:00.000Z')
	date.setHours(hours || 0)
	date.setMinutes(minutes || 0)
	return date
}

const defaultValue = () => {
	let today = new Date()
	today.setHours(1)
	today.setMinutes(0)
	today.setSeconds(0)
	today.setMilliseconds(0)
	return today
}

export default function GoalSelector({
	children,
	onChange,
	value
}: {
	children: React.ReactChild[] | React.ReactChild
	onChange: (date: Date, interval: string) => void
	value?: string
}) {
	const [dateValue, setDate] = useState(defaultValue())
	const { data, isSuccess } = useUser()
	const [hasLoaded, setHasLoaded] = useState(false)
	const [label, setLabel] = useState(' ')
	const [isDatePickerVisible, setDatePickerVisibility] = useState(true)

	// Hack Fix:  https://github.com/react-native-datetimepicker/datetimepicker/issues/30#issuecomment-624228789
	useEffect(() => {
		setTimeout(() => {
			setHasLoaded(true)
		}, 50)
	}, [])

	// Seed initial value from user or override
	useEffect(() => {
		let newDate: Date | undefined = undefined

		if (value) {
			newDate = toDate({ hours: Number(value.split(':')[0].trim()), minutes: Number(value.split(':')[1].trim()) })
		} else if (data?.goal) {
			newDate = toDate(data.goal)
		}

		if (newDate) {
			setDate(newDate)
			if (onChange) onChange(newDate, toInterval(newDate))
		}
	}, [data, isSuccess])

	// Handle new selections
	const onChangeInner = (event: DateTimePickerEvent, date?: Date | undefined) => {
		if (Platform.OS === 'android' && event.type === 'dismissed') {
			// Skip dismiss events on Android
			return
		}

		const currentDate = date || dateValue
		setDate(currentDate)

		if (Platform.OS === 'android') {
			setDatePickerVisibility(false)
		}

		if (onChange) {
			onChange(currentDate, toInterval(currentDate))
		}
	}

	useEffect(() => {
		if (
			data?.goal !== null &&
			data &&
			typeof data?.goal === 'object' &&
			toDate(data.goal).getTime() !== dateValue.getTime()
		) {
			setLabel(`Your current goal is ${formatDuration(data.goal)}.`)
		} else {
			setLabel(' ')
		}
	}, [data, data?.goal, dateValue])

	return (
		<View style={styles.container}>
			<HeaderText style={styles.title}>Set Your Daily Goal</HeaderText>
			<Text style={styles.tagline}>Set this to a target you know you can reach. You can always change this later!</Text>

			{isDatePickerVisible && (
				<DateTimePicker
					is24Hour={true}
					style={{ height: '40%', width: '100%' }}
					display="spinner"
					value={hasLoaded ? dateValue : new Date(0, 0, 0, 0, 1, 5)}
					onChange={onChangeInner}
					//@ts-ignore
					mode={Platform.OS === 'ios' ? 'countdown' : 'time'}
					textColor={'white'}
				/>
			)}
			{Platform.OS === 'android' && (
				<TouchableOpacity
					onPress={() => {
						setDatePickerVisibility(true)
					}}
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						marginTop: 50
					}}>
					<Text style={{ fontFamily: 'objektiv-md', fontSize: 18, color: chattanoogaTapWater }}>
						{formatDuration(toDuration(toInterval(dateValue)))}
					</Text>
					<Feather name="edit" size={18} style={{ marginLeft: 10 }} color={chattanoogaTapWater} />
				</TouchableOpacity>
			)}
			<Text style={{ marginVertical: '4%', fontFamily: 'objektiv-md', fontSize: 16, color: chattanoogaTapWater }}>
				{label}
			</Text>
			{children}
			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</View>
	)
}

const styles = StyleSheet.create({
	tagline: {
		fontSize: 16,
		width: '80%',
		textAlign: 'center'
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 25,
		marginBottom: 10,
		marginTop: 'auto'
	}
})
