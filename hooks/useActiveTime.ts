import { useIsFocused } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { activeTime } from '../core/format'
import { useInterval } from './useInterval'

export function useActiveTime(startTime: string, enabled: boolean) {
	const isFocused = useIsFocused()
	const [currentActiveTime, setActiveTime] = useState(activeTime(startTime))

	const tickActiveTime = () => setActiveTime(activeTime(startTime))
	useInterval(
		() => {
			tickActiveTime()
		},
		enabled ? 5000 : null
	)

	useEffect(() => {
		tickActiveTime()
	})

	useEffect(() => {
		tickActiveTime()
	}, [isFocused])

	return currentActiveTime
}
