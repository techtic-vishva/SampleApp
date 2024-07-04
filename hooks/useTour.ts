import { useIsFocused } from '@react-navigation/native'
import { useEffect } from 'react'
import { useTourGuideController } from 'rn-tourguide'
import { readString, storeString } from '../core/Storage'

type tours = 'home' | 'group'

function buildStorageKey(tourKey: tours) {
	return `TOUR:V1:${tourKey}`
}

export async function hasSeenTour(tourKey: tours) {
	const storageKey = buildStorageKey(tourKey)
	const tourSeen = !!(await readString(storageKey))
	return tourSeen
}

export default function useTour(tourKey: tours, autoStart?: boolean | (() => boolean)) {
	const storageKey = buildStorageKey(tourKey)
	const shouldAutoStart =
		typeof autoStart === 'boolean' ? autoStart : typeof autoStart === 'function' ? autoStart() : false

	const { start, canStart, TourGuideZone, eventEmitter } = useTourGuideController(tourKey)

	// Early bail for non-render locations
	if (!shouldAutoStart) return { canStart, start, TourGuideZone }

	// Setup render hooks
	const isFocused = useIsFocused()

	async function onCanStart() {
		if (!canStart || !isFocused) return

		const tourSeen = await hasSeenTour(tourKey)
		if (tourSeen) {
			return
		}

		start()
	}

	useEffect(() => {
		onCanStart().catch(() => {})
	}, [canStart, isFocused])

	useEffect(() => {
		const handleStop = async () => {
			storeString(storageKey, 'true')
		}

		eventEmitter?.on('stop', handleStop)
		return () => eventEmitter?.off('stop', handleStop)
	}, [canStart, eventEmitter])

	return {
		canStart,
		start,
		TourGuideZone
	}
}
