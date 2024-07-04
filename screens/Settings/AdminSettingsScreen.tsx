import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet } from 'react-native'
import { Text, View } from '../../components/Themed'
import { dichotomousHippopotamus } from '../../constants/Colors'
import { SettingsTabScreenProps } from '../../types'
import { signOut } from '../../core/Authentication'
import { setIsOnboarded } from '../../core/GlobalState'
import { readPowerLevels, connectedLandmarks, readDeviceState } from '../../core/connectivity/AroBluetooth'
import { PhoneState } from '../../core/connectivity/AroDevice'
import SettingGroup from '../../components/settings/group'
import SettingItem from '../../components/settings/item'
import { clearFileSystemLogs, readFileSystemLogs } from '../../core/logger'
import { useInterval } from '../../hooks/useInterval'
import { writeLogsToServer } from '../../core/logger'
import BaseScreen from '../BaseScreen'
import crashlytics from '@react-native-firebase/crashlytics'

export default function AdminSettingsScreen({ navigation }: SettingsTabScreenProps<'SettingsRoot'>) {
	const [lms, setlms] = useState('NONE')
	const [rf, setrf] = useState({})
	const [state, setstate] = useState(PhoneState.OUT)
	const [logs, setLogs] = useState('')

	useInterval(async () => {
		const lms = await connectedLandmarks()
		setlms(lms?.sort().join(', ') || 'NONE')

		const rf = await readPowerLevels()
		setrf(rf || {})

		const phoneState = await readDeviceState()
		setstate(phoneState ?? PhoneState.UNKNOWN)
	}, 1000)

	useInterval(() => {
		readFileSystemLogs()
			.then((stringData) => {
				const logsData = stringData.split('\n').reverse().slice(0, 250)
				setLogs(logsData.join('\n\n'))
			})
			.catch((error) => {
				if (error?.message) setLogs(error.message)
				else if (error) setLogs(JSON.stringify(error))
				else setLogs('Error reading logs...')
			})
	}, 5000)

	function resetLogs() {
		clearFileSystemLogs()
			.then(() => setLogs(''))
			.catch((error) => {
				if (error?.message) setLogs(error.message)
				else if (error) setLogs(JSON.stringify(error))
				else setLogs('Error clearing logs...')
			})
	}

	return (
		<BaseScreen>
			<View style={styles.container}>
				<SettingGroup>
					<SettingItem label="Reset" onClick={() => Promise.all([setIsOnboarded(false, true), signOut()])} />
					<SettingItem label="Clear Onboarding" onClick={() => setIsOnboarded(false, true)} />
					<SettingItem label="Simulate" onClick={() => navigation.navigate('AdminSimulate')} />
					<SettingItem label="Crash" last onClick={() => crashlytics().crash()} />
				</SettingGroup>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						width: '100%'
					}}>
					<Text style={{ paddingVertical: 10, fontSize: 12 }}>
						<Text style={styles.title}>State:</Text> {state === PhoneState.IN ? 'IN' : 'OUT'}
					</Text>
					<Text style={{ paddingVertical: 10, fontSize: 12 }}>
						<Text style={styles.title}>Landmarks:</Text> {lms}
					</Text>
					<Text style={{ paddingVertical: 10, fontSize: 12 }}>
						<Text style={styles.title}>DEV:</Text> {__DEV__ ? 'Y' : 'N'}
					</Text>
				</View>
				<View>
					<Text style={{ paddingVertical: 0 }}>{JSON.stringify(rf, undefined, 10)}</Text>
				</View>
				<View
					style={{
						marginTop: 30,
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-around',
						width: '100%'
					}}>
					<Pressable onPress={resetLogs}>
						<Text>Clear Logs</Text>
					</Pressable>
					<Pressable onPress={() => writeLogsToServer(true)}>
						<Text style={{}}>Persist Logs</Text>
					</Pressable>
				</View>
				<ScrollView style={{ width: '100%' }}>
					<Text style={{ fontSize: 10 }}>{logs}</Text>
				</ScrollView>
			</View>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 20,
		paddingTop: 30
	},
	title: {
		fontWeight: 'bold',
		color: dichotomousHippopotamus
	}
})
