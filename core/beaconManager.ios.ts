import Beacons from '@martinmanzo/react-native-beacons-manager'
import { logger as baseLogger } from '../core/logger'
import { init } from './connectivity/AroBluetooth'
import { startSessionEventMonitoring } from '../core/Session'

const logger = baseLogger.extend('BEACON')

let isInitalized = false

export const initBeacons = () => {
	if (isInitalized) return
	isInitalized = true

	try {
		logger.info('Initializing')

		Beacons.requestAlwaysAuthorization()
		Beacons.shouldDropEmptyRanges(true)

		const region = { identifier: 'Aro Box iBeacon', uuid: '738d7766-b93e-4459-b8d8-ce3a708d49f7' }

		Beacons.startMonitoringForRegion(region)
			.then(() => logger.info('Beacons monitoring started succesfully'))
			.catch((error) => logger.info(`Beacons monitoring not started, error: ${error}`))

		Beacons.startUpdatingLocation()

		//@ts-ignore
		Beacons.BeaconsEventEmitter.addListener('regionDidEnter', (args) => {
			logger.info(`regionDidEnter ${JSON.stringify(args)}`)
			init()
		})

		//@ts-ignore
		Beacons.BeaconsEventEmitter.addListener('regionDidExit', (args) => {
			logger.info(`regionDidExit ${JSON.stringify(args)}`)
			init()
		})
	} catch (error) {
		logger.error(`Error initalizing beacons ${error}`)
	}
}
