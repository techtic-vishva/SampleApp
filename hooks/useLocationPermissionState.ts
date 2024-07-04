import { useEffect, useState } from 'react'
import { onLocationPermissionStatus } from '../core/EventBroker'
import * as Location from 'expo-location'

export function useLocationPermissionState() {
	const [foreground] = Location.useForegroundPermissions()
	const [background] = Location.useBackgroundPermissions()

	const [inner, setInner] = useState<boolean>(true)

	useEffect(() => {
		setInner((foreground?.granted && background?.granted) || false)

		function callback(foreground: boolean, background: boolean) {
			setInner(foreground && background)
		}

		return onLocationPermissionStatus(callback)
	}, [foreground, background])

	return inner
}
