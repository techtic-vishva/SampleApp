import { useEffect, useRef, useState } from 'react'
import Fuse from 'fuse.js'

export function useFuse<T>(search: string, items: T[], options = {}) {
	const fuseRef = useRef<Fuse<T> | null>()
	const [suggestions, setSuggestions] = useState<Fuse.FuseResult<T>[]>([])

	useEffect(() => {
		fuseRef.current = new Fuse(items, options)
	}, [items, options])

	useEffect(() => {
		const items = fuseRef.current?.search(search)
		setSuggestions(items ?? [])
	}, [search])

	return suggestions
}
