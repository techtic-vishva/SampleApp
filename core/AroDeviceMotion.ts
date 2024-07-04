import { Subscription } from 'expo-modules-core'
import { DeviceMotion } from 'expo-sensors'
import { AppState } from 'react-native'
import { logger as baseLogger } from './logger'

const logger = baseLogger.extend('MOTION')

let subscriptions: Array<DeviceMotionSubscription> = new Array<DeviceMotionSubscription>()

AppState.addEventListener('change', () => {
	subscriptions.forEach((subscription) => {
		subscription.restart()
	})
})

export class DeviceMotionSubscription {
	private static readonly motionThreshold = 4
	private static readonly requiredAxisDimmensions = 2
	private static readonly requiredMotionDurationMs = 1000

	private _subscription: Subscription
	private _callback: () => void
	private _lastTriggerEpoch: number = 0

	constructor(callback: () => void) {
		this._callback = callback

		this._subscription = this.addListener()
	}

	remove() {
		this._subscription.remove()

		const index = subscriptions.indexOf(this)
		if (index > -1) {
			subscriptions.splice(index, 1)
		}
	}

	restart() {
		this._subscription.remove()
		this._subscription = this.addListener()
	}

	private addListener() {
		return DeviceMotion.addListener((measurement) => {
			if (!measurement.acceleration) {
				return
			}

			if (
				[
					Math.abs(measurement.acceleration.x) > DeviceMotionSubscription.motionThreshold,
					Math.abs(measurement.acceleration.y) > DeviceMotionSubscription.motionThreshold,
					Math.abs(measurement.acceleration.z) > DeviceMotionSubscription.motionThreshold
				].filter(Boolean).length >= DeviceMotionSubscription.requiredAxisDimmensions
			) {
				const previousTriggerEpoch = this._lastTriggerEpoch
				this._lastTriggerEpoch = Date.now()

				if (this._lastTriggerEpoch - previousTriggerEpoch < DeviceMotionSubscription.requiredMotionDurationMs) {
					this._callback()
				}
			}
		})
	}
}

const checkPermissions = async () => {
	let permissions = await DeviceMotion.getPermissionsAsync()

	if (permissions.granted) {
		return permissions.granted
	}

	if (permissions.canAskAgain) {
		permissions = await DeviceMotion.requestPermissionsAsync()
	}

	return permissions.granted
}

export const init = async () => {
	if (!(await DeviceMotion.isAvailableAsync())) {
		logger.error('[addListener] Device motion not available')
		return
	}

	if ((await checkPermissions()) !== true) {
		logger.error('[addListener] Permission to use device motion denied')
		return
	}
}

export const on = (callback: () => void) => {
	logger.info('[addListener] Adding device motion listener')

	const deviceMotionSubscription = new DeviceMotionSubscription(callback)

	subscriptions.push(deviceMotionSubscription)

	return () => {
		deviceMotionSubscription.remove()
	}
}
