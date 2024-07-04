import { StyleSheet, Image, ActivityIndicator } from 'react-native'
import { Text, View } from '../components/Themed'
import { RootStackScreenProps } from '../types'
import SharedStyles from '../constants/Styles'
import OrangeButton from '../components/OrangeButton'
import { useEffect, useState } from 'react'
import { emitDeviceConnection } from '../core/EventBroker'
import { PhoneState } from '../core/connectivity/AroDevice'
import { HeaderText } from '../components/StyledText'
import { useAppState } from '../hooks/useAppState'
import { getBrightnessSync } from 'react-native-device-info'
import { chattanoogaTapWater, dichotomousHippopotamus, vitaminCBathwater, fill } from '../constants/Colors'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { useInterval } from '../hooks/useInterval'
import { useKeepAwake } from 'expo-keep-awake'
import { useActiveTime } from '../hooks/useActiveTime'
import { intervalToDuration } from 'date-fns/esm'
import Loading from '../components/Loading'
import { init as initDeviceMotion, on as onDeviceMotion } from '../core/AroDeviceMotion'

export default function AroGoScreen({ navigation }: RootStackScreenProps<'AroGo'>) {
	useKeepAwake()
	// const appState = useAppState()
	const [state, setState] = useState<'start' | 'in-progress' | 'end'>('start')
	const [count, setCount] = useState(0)
	const [start, setStart] = useState<Date | undefined>()
	const [activeTime, setActiveTime] = useState('00:00:00')

	function close() {
		navigation.replace('Root')
	}

	function endSession() {
		setState('end')
		emitDeviceConnection({
			newState: PhoneState.OUT,
			previousState: PhoneState.IN,
			aroDeviceId: 'aro-go',
			metadata: { manualEnd: true }
		})
	}

	function startSession() {
		setCount(0)
		setState('in-progress')
		emitDeviceConnection({
			newState: PhoneState.IN,
			previousState: PhoneState.OUT,
			aroDeviceId: 'aro-go'
		})
		setStart(new Date())
	}

	initDeviceMotion()

	useEffect(
		() =>
			onDeviceMotion(() => {
				setCount(count + 1)
			}),
		[]
	)

	useInterval(() => {
		if (state === 'in-progress' && typeof start === 'object') {
			console.log(`count: ${count}, ${count > 1 ? 'end session' : 'reset count'}`)

			if (count > 0) {
				endSession()
			}

			const duration = intervalToDuration({
				start: start,
				end: new Date()
			})

			setActiveTime(
				`${(duration.hours || 0).toString().padStart(2, '0')}:${(duration.minutes || 0).toString().padStart(2, '0')}:${(
					duration.seconds || 0
				)
					.toString()
					.padStart(2, '0')}`
			)
		}
	}, 1000)

	return (
		<View style={styles.container}>
			{state === 'start' && (
				<CountdownCircleTimer
					isPlaying
					duration={10}
					colors={[chattanoogaTapWater, dichotomousHippopotamus, fill, vitaminCBathwater]}
					onComplete={startSession}
					colorsTime={[10, 6, 3, 0]}>
					{({ remainingTime }) => (
						<View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ marginBottom: 10 }}>Get Ready!</Text>
							<Text style={{ fontSize: 20 }}>{remainingTime}</Text>
						</View>
					)}
				</CountdownCircleTimer>
			)}

			{state === 'in-progress' && (
				<View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size={'large'} style={{ marginBottom: 40 }} />
					<Text style={{ color: dichotomousHippopotamus, fontSize: 26, marginBottom: 10 }}>Session In-progress:</Text>
					<Text style={{ fontSize: 20, color: chattanoogaTapWater }}>{activeTime}</Text>
				</View>
			)}

			{state === 'end' && (
				<View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					<Text style={{ color: 'green', fontSize: 26, marginBottom: 10 }}>Session Complete!</Text>
					<Text style={{ fontSize: 20, color: chattanoogaTapWater }}>{activeTime}</Text>
				</View>
			)}

			<Text style={{ marginBottom: 25, textAlign: 'center', width: '90%' }}></Text>
			<OrangeButton
				outterStyle={{ width: '90%', marginTop: 25 }}
				title={state === 'in-progress' ? 'End Session' : state === 'end' ? 'Return Home' : 'Cancel'}
				onPress={() => {
					state === 'in-progress' ? endSession() : close()
				}}
			/>
			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	},
	title: {
		fontSize: 20,
		marginBottom: 25,
		width: '90%',
		textAlign: 'center'
	},
	link: {
		marginTop: 15,
		paddingVertical: 15
	},
	linkText: {
		fontSize: 14,
		color: '#2e78b7'
	}
})
