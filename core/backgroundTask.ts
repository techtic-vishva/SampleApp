import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import { getIdToken } from './Authentication'
import { init as initBluetooth, errorDevices, noAroConnectionActive } from './connectivity/AroBluetooth'
import { appInit } from '../core/services/user'
import { heartbeatTick } from './connectivity/AroDevice'
import { logger as baseLogger, writeLogsToServer } from './logger'
import { manualCleanup } from './services/session'
import { ARO_BLE_HEARTBEAT, deleteString, readString } from './Storage'
import { sleep } from './sleep'

const logger = baseLogger.extend('BGF')

let initComplete = false

const BACKGROUND_FETCH_TASK = 'background-fetch'

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
	logger.info(`Start background task`)

	logger.info(`Initializing bluetooth & app`)
	// android only: this sets up the app to function post boot without opening the app
	await initBluetooth().then(appInit)

	logger.info(`Stuck BTLE Devices: ${JSON.stringify(errorDevices)}`)

	// Ensure token is refreshed
	// Firebase does not do this in the background
	await getIdToken(true)

	// Cleanup Stuck Sessions
	if (noAroConnectionActive()) {
		const heartbeatTimestamp = await readString(ARO_BLE_HEARTBEAT)
		if (heartbeatTimestamp) {
			logger.info(`Cleaning up sessions: ${heartbeatTimestamp}`)

			await manualCleanup({
				voidedReason: 'BG-Task-Cleanup',
				endTime: heartbeatTimestamp || new Date().toISOString()
			})

			await deleteString(ARO_BLE_HEARTBEAT)

			return BackgroundFetch.BackgroundFetchResult.NoData
		}
	} else {
		logger.info(`Connection active, skipping cleanup`)
		await heartbeatTick()
	}

	// Flush Logs
	await writeLogsToServer(true)
		.then(() => logger.info(`Background fetch API call succeeded`))
		.catch(() => logger.error(`Background fetch API call failed`))

	await sleep(2000) // Bluetooth need some time?

	logger.info(`Finish background task`)

	// Be sure to return the successful result type!
	return BackgroundFetch.BackgroundFetchResult.NewData
})

export const initBackgroundFetch = async () => {
	if (initComplete) return
	try {
		const status = await BackgroundFetch.getStatusAsync()

		logger.info(`[initBackgroundFetch] Initalizing [${status && BackgroundFetch.BackgroundFetchStatus[status]}]`)

		await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
			minimumInterval: 60 * 15, // 15 minutes
			stopOnTerminate: false, // android only,
			startOnBoot: true // android only
		})

		initComplete = true
	} catch (error) {
		logger.error(`[initBackgroundFetch] Failed to initialize: ${error}`)
	}
}
