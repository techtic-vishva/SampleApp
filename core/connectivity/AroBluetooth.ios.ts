import { BleError, BleManager, Device, State, Subscription } from 'react-native-ble-plx'
import { encode, toByteArray } from './Base64'
import { AroDevice, PhoneState, heartbeatTick } from './AroDevice'
import { logger as baseLogger } from '../logger'
import { emitBluetoothStatus, onNfcToggle } from '../EventBroker'
import { sleep } from '../sleep'
import { GlobalState } from '../GlobalState'

const logger = baseLogger.extend('BTLE')

import {
	ARO_BTLE_SERVICE_GUID,
	ARO_HEARTBEAT_CHARACTERISTIC_GUID,
	BTLE_POWER_CHARACTERISTIC_UUID,
	DeviceType,
	State as AroState
} from '../../constants/Bluetooth'

const KnownAroDevices = new Map<string, AroDevice>()
let ActiveAroDeviceId: string
const getAroDevice = (id: string, firmwareVersion: string): AroDevice => {
	if (!KnownAroDevices.has(id)) {
		KnownAroDevices.set(id, new AroDevice(id, logger.info, firmwareVersion))
	}

	return KnownAroDevices.get(id) as AroDevice
}

export const noAroConnectionActive = () => {
	if (KnownAroDevices.size === 0) return true
	if (Array.from(KnownAroDevices.values()).every((ad) => ad.ConnectionStatus == PhoneState.OUT)) return true
	return false
}

export const errorDevices: string[] = []
function errorDevicesAdd(id: string) {
	if (errorDevices.includes(id)) return
	errorDevices.push(id)
}

function errorDevicesRemove(id: string) {
	if (errorDevices.includes(id)) errorDevices.splice(errorDevices.indexOf(id), 1)
}

function randomIntFromInterval(min: number, max: number) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function logError(method: string, error: any, logDetails?: string) {
	if (!error) {
		return
	}

	if (error instanceof BleError) {
		logBleError(method, error, logDetails)
	} else {
		logger.error(`[${method}] Error caught: ${logDetails}`, error)
	}
}

function logBleError(method: string, error: BleError | null, logDetails?: string) {
	if (!error) {
		return
	}

	const errorCode = error.iosErrorCode?.toString()

	if (logDetails) {
		logDetails += ' '
	}

	logger.error(`[${method}] Error caught (code: ${errorCode}, reason: ${error.reason}): ${logDetails}`, error)
}

let manager: BleManager | null
let bluetoothState: AroState = AroState.Unknown

onNfcToggle((toggle: boolean) => {
	if (toggle) {
		destroy()
	} else {
		init()
	}
})

let devicesToRestore: Device[] = []
const restore = (devices: Device[]) => {
	if (!devices || devices.length === 0) {
		return
	}

	logger.info(`Restoring previously known devices (${devicesToRestore.length})`)

	for (const device of devices) {
		if (Object.values(DeviceType).includes(device.name as DeviceType)) {
			// Causes race conditions with device scan
			// connectToDevice(device, device.name as DeviceType, 'state-restore')
		}
	}
}

export const init = async () => {
	if (manager || GlobalState.nfc.toggle) return

	// Bootstrap
	manager = new BleManager({
		restoreStateIdentifier: ARO_BTLE_SERVICE_GUID,
		restoreStateFunction: async (restoredState) => {
			if (restoredState == null) {
				logger.info('Bootstrapped empty state')
			} else {
				logger.info('Bootstrapped restored state')
				const devices = restoredState.connectedPeripherals || []
				const managerState = await manager?.state()

				if (managerState !== State.PoweredOn) {
					devicesToRestore = devices
				} else {
					restore(devices)
				}
			}
		}
	})

	// Bluetooth Availability Hooks
	manager.onStateChange((newState) => {
		bluetoothState = toAroState(newState)

		// Power `useBluetoothState`
		emitBluetoothStatus(bluetoothState)

		logger.info(`New state: ${newState}`)
		if (newState === State.PoweredOn) {
			if (devicesToRestore && devicesToRestore.length) {
				restore(devicesToRestore)
				devicesToRestore = []
			}

			startLandmarkDeviceScan()
		} else {
			// Won't stop, can't stop
			// manager.stopDeviceScan()
		}
	}, true)
}

const destroy = async () => {
	if (!manager) {
		return
	}

	logger.info('Destroying BLE manager')

	manager.destroy()
	manager = null
}

const toAroState = (state: State) => {
	switch (state) {
		case State.PoweredOn:
			return AroState.On
		case State.Unsupported:
			return AroState.Unsupported
		case State.Unauthorized:
			return AroState.Unauthorized
		case State.Unknown:
			return AroState.Unknown
		case State.PoweredOff:
		default:
			return AroState.Off
	}
}

/**
 * SCAN FOR LANDMARKS
 */
const scannedDevices = new Set<string>()

const startLandmarkDeviceScan = async () => {
	logger.info('Landmark scanning started')

	manager?.startDeviceScan([ARO_BTLE_SERVICE_GUID], { allowDuplicates: false }, async (error, device) => {
		// Errors can happen from missing permissions
		if (error !== null || !device) {
			// Todo:  How do we recover from this?
			logError('deviceScanCallback', error)

			return
		}

		if (scannedDevices.has(device.id)) {
			return
		} else {
			scannedDevices.add(device.id)
		}

		try {
			logger.info(`[deviceScanCallback] New device: ${device.name} [${device.id}]`)

			if (!device.manufacturerData) {
				logger.error(`[deviceScanCallback] Missing manufacturer data: ${device.name} [${device.id}]`)
				return
			}

			// Identify Landmark
			const [deviceType, aroDevice] = identifyLandmark(device)

			if (!aroDevice) {
				logger.error('[deviceScanCallback] Unable to establish an Aro Device')
				return
			}

			// Establish Disconnect Handler
			manager?.onDeviceDisconnected(device.id, async (error, _device) => {
				if (error) {
					logError('deviceDisconnectCallback', error)
				}

				const nap = randomIntFromInterval(1000, 2500)

				logger.info(
					`[onDeviceDisconnected] Reconnecting to device after ${nap}: ${device.name} [${device.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
				)

				// Take a breath
				await sleep(nap)

				await onLandmarkDisconnect(aroDevice, device, deviceType)
			})

			// Connect to Landmark
			logger.info(
				`[deviceScanCallback] Initial connection to device: ${device.name} [${device.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
			)
			await connectToLandmark(device, aroDevice, deviceType)
		} catch (err) {
			logError('startLandmarkDeviceScan', err)
			scannedDevices.delete(device.id)
			errorDevicesAdd(device.id)
		}
	})
}

const identifyLandmark = (device: Device): [DeviceType, AroDevice] | [null, null] => {
	if (!device.manufacturerData) return [null, null]

	const unit8bytes = toByteArray(device.manufacturerData)
	const firmwareVersion = `${unit8bytes[4]}.${unit8bytes[5]}.${unit8bytes[6]}`
	const dataview = new DataView(unit8bytes.buffer)
	const boxId = dataview.getUint32(0, true) & 0x0000ffff
	/**
	 * const hardwareVersion = `${unit8bytes[7]}`
	 * const _ = dataview.getUint32(0, true) & 0xffff0000;
	 */
	const deviceTypeIdentifier = Math.abs(dataview.getUint32(0, true) >> 30)

	let deviceType =
		deviceTypeIdentifier === 1
			? DeviceType.Landmark1
			: deviceTypeIdentifier === 2
			? DeviceType.Landmark2
			: DeviceType.Unknown

	const relatedAroDevice = getAroDevice(`${boxId}`, firmwareVersion)

	return [deviceType, relatedAroDevice]
}

const heartbeatSubscription = new Map<string, Subscription>()
const pendingLandmarkConnections = new Set<string>()

const connectToLandmark = async (device: Device, aroDevice: AroDevice, deviceType: DeviceType) => {
	try {
		// Connect
		if ((await device.isConnected()) === false) {
			logger.info(
				`[connectToLandmark] Connecting to device: ${device.name} [${device.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
			)

			// Connection Already Pending
			if (pendingLandmarkConnections.has(device.id)) {
				logger.error(
					`[connectToLandmark] Already connecting, skipping. ${device.name} [${device.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
				)
				return
			}

			// Lock & connect
			pendingLandmarkConnections.add(device.id)
			await device.connect()
			pendingLandmarkConnections.delete(device.id)
		} else {
			logger.info(
				`[connectToLandmark] Already connected: ${device.name} [${device.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
			)
		}

		// Success, register device and notify
		aroDevice.addLandmark(device.id, device, () => device.isConnected())
		logger.info(
			`[connectToLandmark] Updating aro status: ${device.name} [${device.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
		)
		await aroDevice.updateStatus()

		// Discover
		// logger.info(
		// 	`[connectToLandmark] Discovering services and characteristics: ${device.name} [${device.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
		// )
		// await device.discoverAllServicesAndCharacteristics()

		/**
		 *    Deprecated with speaker removal
		 *
		 * */

		// Send Device Name to Landmark
		// logger.info(
		// 	`[connectToLandmark] Writing device name ${getUniqueId()} to characteristic: ${device.name} [${
		// 		device.id
		// 	}] {${deviceType}} <${aroDevice.AroDeviceId}>`
		// )
		// await device.writeCharacteristicWithResponseForService(
		// 	ARO_BTLE_SERVICE_GUID,
		// 	ARO_CONNECTION_NAME_CHARACTERISTIC_GUID,
		// 	encode(getUniqueId())
		// )

		errorDevicesRemove(device.id)

		// Update Status
		// logger.info(
		// 	`[connectToLandmark] Updating aro status (2/2): ${device.name} [${device.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
		// )
		// await aroDevice.updateStatus()

		// Subscribe to Heartbeat
		if (heartbeatSubscription.has(device.id)) {
			heartbeatSubscription.get(device.id)?.remove()
		}
		// if (deviceType === DeviceType.Landmark1) {
		// 	const newHeartbeatSubscription = await device.monitorCharacteristicForService(
		// 		ARO_BTLE_SERVICE_GUID,
		// 		ARO_HEARTBEAT_CHARACTERISTIC_GUID,
		// 		() => {
		// 			heartbeatTick().finally(() => {
		// 				logger.info(`Characteristic tick ${device.id}`)
		// 			})
		// 		}
		// 	)
		// 	heartbeatSubscription.set(device.id, newHeartbeatSubscription)
		// }
	} catch (error) {
		logError('connectToLandmark', error, `${device.name} [${device.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`)

		pendingLandmarkConnections.delete(device.id)
		errorDevicesAdd(device.id)
	}
}

const onLandmarkDisconnect = async (aro: AroDevice, device: Device, deviceType: DeviceType) => {
	try {
		// Update Device Status
		logger.info(
			`[onLandmarkDisconnect] Updating aro status: ${device.name} [${device.id}] {${deviceType}} <${aro.AroDeviceId}>`
		)
		await aro.updateStatus()

		// Clean up Heartbeat Subscription
		if (heartbeatSubscription.has(device.id)) {
			heartbeatSubscription.get(device.id)?.remove()
		}
	} catch (err) {
		logError(`onDeviceDisconnect`, err)
	} finally {
		// Queue Reconnect
		logger.info(
			`[onLandmarkDisconnect] Reconnecting to device: ${device.name} [${device.id}] {${deviceType}} <${aro.AroDeviceId}>`
		)
		await connectToLandmark(device, aro, deviceType)
	}
}

const getDebugBoxId = () => {
	if (ActiveAroDeviceId) return ActiveAroDeviceId
	const boxIds = Array.from(KnownAroDevices.keys())
	if (!boxIds.length) return ''
	return boxIds[0] // todo: multi-box support
}

const powerLevels = ['-12 dBm', '-9 dBm', '-6 dBm', '-3 dBm', '0 dBm', '3 dBm', '6 dBm', '9 dBm']
export const readPowerLevels = async (boxId?: string) => {
	boxId = boxId || getDebugBoxId()
	if (!boxId) return

	const aroDevice = getAroDevice(boxId, '')
	if (!aroDevice) return

	const lighthouse = aroDevice.getLighthouse<Device>()
	if (!lighthouse) return

	if (!(await lighthouse.isConnected())) return

	const services = await lighthouse.services()
	const lighthouseService = services.find((s) => s.uuid === ARO_BTLE_SERVICE_GUID)
	if (!lighthouseService) return

	const data = await lighthouseService.readCharacteristic(BTLE_POWER_CHARACTERISTIC_UUID)
	if (!data.value) return

	const unit8bytes = toByteArray(data?.value)

	return {
		lha: powerLevels[unit8bytes[0]],
		lhc: powerLevels[unit8bytes[1]],
		lm1a: powerLevels[unit8bytes[2]],
		lm1c: powerLevels[unit8bytes[3]],
		lm2a: powerLevels[unit8bytes[4]],
		lm2c: powerLevels[unit8bytes[5]]
	}
}

export const connectedLandmarks = async (boxId?: string) => {
	boxId = boxId || getDebugBoxId()
	if (!boxId) return

	const connected = []

	const aroDevice = getAroDevice(boxId, '')
	if (!aroDevice) return

	for (const device of aroDevice.getLandmarks<Device>()) {
		if ((await device?.isConnected()) ?? false) {
			connected.push(device.name)
		}
	}

	return connected
}

export const readDeviceState = async (boxId?: string) => {
	boxId = boxId || getDebugBoxId()
	if (!boxId) return

	const aroDevice = getAroDevice(boxId, '')
	return aroDevice?.ConnectionStatus
}

export const getState = () => bluetoothState
