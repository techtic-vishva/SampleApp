export const ARO_BTLE_SERVICE_GUID = 'A1745771-A5B8-11E5-A837-0800200C9A66'.toLowerCase() // yes
export const ARO_BOX_ID_CHARACTERISTIC_GUID = '8C0F449D-F9BE-52B9-4545-DCBE4D55A5FA'.toLowerCase()
export const ARO_HEARTBEAT_CHARACTERISTIC_GUID = 'A1745773-A5B8-11E5-A837-0800200C9A66'
export const ARO_CONNECTION_NAME_CHARACTERISTIC_GUID = 'DC5D2707-334C-27AD-8D42-BD07358BFC46'.toLowerCase()
export const DEVICE_SERVICE_GUID = 'D2874E7E-863F-B09A-FD4C-0E4A33EDAB24'
export const DEVICE_VERSION_CHARACTERISTIC_GUID = '85152A5C-4922-6CB2-5D41-1B297CCDB02C'
export const ADVERTISED_UUID = '6cef0442-a4c6-048c-8148-02b134e65fc6' // yes
export const BTLE_POWER_CHARACTERISTIC_UUID = 'C8228C7D-C93B-EB89-45B8-457A497F9D3D'.toLowerCase()

export enum DeviceType {
	Lighthouse = 'ARO',
	Landmark1 = 'ARO-LM1',
	Landmark2 = 'ARO-LM2',
	Unknown = 'Unknown'
}

export enum State {
	Off = 'off',
	TurningOff = 'turning_off',
	On = 'on',
	TurningOn = 'turning_on',
	Unauthorized = 'unauthorized',
	Unknown = 'unknown',
	Unsupported = 'unsupported'
}

export const isStateValid = (state: State) => {
	return ![State.Off, State.TurningOff, State.Unauthorized, State.Unsupported].includes(state)
}
