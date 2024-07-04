import BackgroundGeolocation from 'react-native-background-geolocation'
import { Platform } from 'react-native'
import { logger as baseLogger } from './logger'

const logger = baseLogger.extend('GEO')

export const init = async () => {
	if (Platform.OS === 'android') {
		return
	}

	BackgroundGeolocation.onActivityChange((event) => {
		// uncomment to debug
		// logger.info('Activity', event)
	})

	BackgroundGeolocation.onHeartbeat((event) => {
		// uncomment to debug
		// logger.info('Heartbeat', event)
	})

	await BackgroundGeolocation.ready({
		// Geolocation Config
		desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
		distanceFilter: 1,
		disableElasticity: true,
		// Activity Recognition
		stopTimeout: 2 / 60, // 2 seconds
		// Application config
		debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
		logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
		stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
		heartbeatInterval: 1,
		preventSuspend: true,
		startOnBoot: true // <-- Auto start tracking when device is powered-up.
	})

	await BackgroundGeolocation.start()
}
