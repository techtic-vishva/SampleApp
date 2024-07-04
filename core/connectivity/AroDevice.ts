import { emitDeviceConnection } from '../EventBroker'
import { ARO_BLE_HEARTBEAT, storeString } from '../Storage'

export enum PhoneState {
	OUT,
	IN,
	UNKNOWN
}

export const heartbeatTick = async () => {
	return storeString(ARO_BLE_HEARTBEAT, new Date().toISOString())
}

export class AroDevice {
	// Phone
	ConnectionStatus: PhoneState = PhoneState.OUT

	// Box
	Landmarks: Map<string, { device: any; isConnected: () => Promise<boolean> }> = new Map<
		string,
		{ device: any; isConnected: () => Promise<boolean> }
	>()
	Lighthouse: any | undefined = undefined
	AroDeviceId: string
	AroFirmwareVersion: string | undefined

	// Debug
	log: (msg: string) => void = () => {}

	constructor(aroDeviceId: string, log: (msg: string) => void, firmwareVersion: string) {
		this.AroDeviceId = aroDeviceId
		this.log = log || this.log
		this.AroFirmwareVersion = firmwareVersion
	}

	// Events
	async updateStatus() {
		let newConnectionStatus = this.ConnectionStatus

		const landmarks = Array.from(this.Landmarks.values())
		const eachLandmarkStatus = await Promise.all(landmarks.map((landmark) => landmark?.isConnected() || false))

		// One connected, then in
		if (eachLandmarkStatus.some((status) => status === true)) {
			newConnectionStatus = PhoneState.IN
		} else {
			// Otherwise, out
			newConnectionStatus = PhoneState.OUT
		}

		/**
		 * Deprecated with speaker removal
		 */
		// if (landmarkOneConnected == false && landmarkTwoConnected == false) {
		// 	newConnectionStatus = PhoneState.OUT
		// 	this.log('Phone Out Of Box')
		// } else if (landmarkOneConnected && landmarkTwoConnected) {
		// 	newConnectionStatus = PhoneState.IN
		// 	this.log('Phone In Box')
		// } else {
		// 	this.log('One landmark connected, noop')
		// 	// noop, transitioning
		// }

		if (newConnectionStatus !== this.ConnectionStatus) {
			this.log('Connection transition')

			// Share the news with the world!
			emitDeviceConnection({
				previousState: this.ConnectionStatus,
				newState: newConnectionStatus,
				aroDeviceId: this.AroDeviceId,
				aroFirmwareVersion: this.AroFirmwareVersion
			})

			this.ConnectionStatus = newConnectionStatus

			if (newConnectionStatus === PhoneState.IN) {
				await heartbeatTick()
			}
		}
	}

	addLandmark<Device>(deviceId: string, device: Device, isConnected: () => Promise<boolean>) {
		this.Landmarks.set(deviceId, { device, isConnected })
	}

	getLandmarks<Device>() {
		return Array.from(this.Landmarks.values()).map((v: { device: any }) => v.device as Device)
	}

	getLighthouse<Device>() {
		return this.Lighthouse as Device
	}
}
