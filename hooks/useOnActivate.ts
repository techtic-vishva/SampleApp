import { useEffect, useRef } from 'react'
import { useAppState } from './useAppState'

type CallbackFunction = () => void

export function useOnActivate(callback: CallbackFunction, enabled: boolean = true) {
	const savedCallback = useRef<CallbackFunction>(() => {})
	const appState = useAppState()

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback
	}, [callback])

	// On active, invoke callback
	useEffect(() => {
		if (enabled && appState === 'active') savedCallback.current()
	}, [appState])
}
