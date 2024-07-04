import { emitLocationPermissionStatus } from './EventBroker'
import { AppState } from 'react-native'
import * as Location from 'expo-location'

AppState.addEventListener('change', async () => {
	const { granted: foregroundGranted } = await Location.getForegroundPermissionsAsync()
	const { granted: backgroundGranted } = await Location.getBackgroundPermissionsAsync()

	emitLocationPermissionStatus(foregroundGranted, backgroundGranted)
})

export const init = async () => {
	// Foreground permission is a prereq for background
	let { granted: foregroundGranted, canAskAgain: foregroundCanAskAgain } =
		await Location.getForegroundPermissionsAsync()

	// Background permission is needed to scan Bluetooth devices in background
	let { granted: backgroundGranted, canAskAgain: backgroundCanAskAgain } =
		await Location.getBackgroundPermissionsAsync()

	// Request
	if (!foregroundGranted && foregroundCanAskAgain) {
		let response = await Location.requestForegroundPermissionsAsync()

		foregroundGranted = response.granted

		if (foregroundGranted) {
			if (!backgroundGranted && backgroundCanAskAgain) {
				response = await Location.requestBackgroundPermissionsAsync()

				backgroundGranted = response.granted
			}
		}
	}

	emitLocationPermissionStatus(foregroundGranted, backgroundGranted)
}
