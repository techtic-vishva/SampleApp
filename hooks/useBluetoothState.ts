import { useEffect, useState } from 'react'
import { State } from '../constants/Bluetooth'
import { onBluetoothStatus } from '../core/EventBroker'
import { getState } from '../core/connectivity/AroBluetooth'

export function useBluetoothState() {
	const state = getState()
	const [inner, setInner] = useState<State>(state)

	useEffect(() => {
		setInner(state)

		function callback(event: State) {
			setInner(event)
		}

		return onBluetoothStatus(callback)
	}, [state])

	return inner
}
