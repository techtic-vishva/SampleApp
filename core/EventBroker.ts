import { State } from '../constants/Bluetooth'
import { TinyEmitter } from 'tiny-emitter'
import { PhoneState } from '../core/connectivity/AroDevice'

const emitter = new TinyEmitter()

const DeviceConnection = 'device-connection'
export type DeviceConnectionEvent = {
	aroDeviceId: string
	aroFirmwareVersion?: string
	previousState: PhoneState
	newState: PhoneState
	metadata?: { [key: string]: any }

}

export const emitDeviceConnection = (event: DeviceConnectionEvent) => {
	emitter.emit(DeviceConnection, event)
}

export const onDeviceConnection = (callback: (event: DeviceConnectionEvent) => void) => {
	emitter.on(DeviceConnection, callback)
	return () => {
		emitter.off(DeviceConnection, callback)
	}
}

const SessionStatus = 'session-status'
export type SessionStatusEvent = 'Start' | 'End'

export const emitSessionStatus = (event: SessionStatusEvent) => {
	emitter.emit(SessionStatus, event)
}

export const onSessionStatus = (callback: (event: SessionStatusEvent) => void) => {
	emitter.on(SessionStatus, callback)
	return () => {
		emitter.off(SessionStatus, callback)
	}
}

const BluetoothStatus = 'bluetooth-status'

export const emitBluetoothStatus = (event: State) => {
	emitter.emit(BluetoothStatus, event)
}

export const onBluetoothStatus = (callback: (event: State) => void) => {
	emitter.on(BluetoothStatus, callback)
	return () => {
		emitter.off(BluetoothStatus, callback)
	}
}

const IsOnboarded = 'is-onboarded'

export const emitIsOnboarded = (event: boolean) => {
	emitter.emit(IsOnboarded, event)
}

export const onIsOnboarded = (callback: (event: boolean) => void) => {
	emitter.on(IsOnboarded, callback)
	return () => {
		emitter.off(IsOnboarded, callback)
	}
}

const NfcToggle = 'nfc-toggle'

export const emitNfcToggle = (event: boolean) => {
	emitter.emit(NfcToggle, event)
}

export const onNfcToggle = (callback: (event: boolean) => void) => {
	emitter.on(NfcToggle, callback)
	return () => {
		emitter.off(NfcToggle, callback)
	}
}

const LocationPermissionStatus = 'location-permission-status'

export const emitLocationPermissionStatus = (foreground: boolean, background: boolean) => {
	emitter.emit(LocationPermissionStatus, foreground, background)
}

export const onLocationPermissionStatus = (callback: (foreground: boolean, background: boolean) => void) => {
	emitter.on(LocationPermissionStatus, callback)
	return () => {
		emitter.off(LocationPermissionStatus, callback)
	}
}
