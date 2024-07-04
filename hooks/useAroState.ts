import { useEffect, useState } from 'react'
import { SessionStatusEvent, onSessionStatus } from '../core/EventBroker'

export function useAroState() {
	const [inner, setInner] = useState<undefined | SessionStatusEvent>(undefined)

	useEffect(() => {
		function callback(event: SessionStatusEvent) {
			setInner(event)
		}

		return onSessionStatus(callback)
	}, [])

	return inner
}
