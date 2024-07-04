import { FontAwesome } from '@expo/vector-icons'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { isAuthenticationReady } from '../core/Authentication'
import { initializationComplete } from '../core/GlobalState'
import { startSessionEventMonitoring } from '../core/Session'
import { logger } from '../core/logger'
import {
	readString,
	MEMORY_WARNING_TIMESTAMP,
	deleteString,
	ARO_BLE_HEARTBEAT,
	cleanupDeprecatedKeys
} from '../core/Storage'
import { manualCleanup } from '../core/services/session'
import { noAroConnectionActive } from '../core/connectivity/AroBluetooth'
import { Image } from 'react-native'
import { WelcomeScreenBackgroundImages } from '../screens/onboarding/WelcomeScreen'

async function logMemoryWarningTimestamp() {
	try {
		const timestamp = await readString(MEMORY_WARNING_TIMESTAMP)
		if (timestamp) {
			logger.info(`Boot - Previous Memory Warning: ${timestamp}`)
			await deleteString(MEMORY_WARNING_TIMESTAMP)
		}
	} catch { }
}

async function endPreviousAbandonedSessions() {
	try {
		const heartbeatTimestamp = await readString(ARO_BLE_HEARTBEAT)
		if (heartbeatTimestamp && noAroConnectionActive()) {
			logger.info(`Cleaning up sessions: ${heartbeatTimestamp}`)
			await manualCleanup({
				endTime: heartbeatTimestamp,
				voidedReason: 'Boot-Cleanup'
			})
			await deleteString(ARO_BLE_HEARTBEAT)
		}
	} catch { }
}

export default function useCachedResources() {
	const [isLoadingComplete, setLoadingComplete] = useState(false)

	// Load any resources or data that we need prior to rendering the app
	useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHideAsync()

				// Load fonts and image assets
				await Promise.all([
					Font.loadAsync({
						...FontAwesome.font,
						'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
						'objektiv-semi-bold': require('../assets/fonts/ObjektivMk2_SBd.ttf'),
						'objektiv-semi-bold-italic': require('../assets/fonts/ObjektivMk3_SBdIt.ttf'),
						'objektiv-md': require('../assets/fonts/ObjektivMk2_Md.ttf'),
						'objektiv-md-italic': require('../assets/fonts/ObjektivMk2_MdIt.ttf'),
						objektiv: require('../assets/fonts/Objektiv.ttf')
					}),
					...WelcomeScreenBackgroundImages.map((image) => Image.prefetch(image))
				])

				// 1: Init
				await Promise.all([
					isAuthenticationReady(),
					initializationComplete,
					logMemoryWarningTimestamp(),
					cleanupDeprecatedKeys()
				])

				// 2: Init post-auth
				await Promise.all([endPreviousAbandonedSessions()])

				await startSessionEventMonitoring() // Register Event Broker Listeners
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e)
			} finally {
				setLoadingComplete(true)
			}
		}

		loadResourcesAndDataAsync()
	}, [])

	return isLoadingComplete
}
