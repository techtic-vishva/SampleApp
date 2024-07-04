import { useState } from 'react'
import { format } from 'date-fns'
import { useInterval } from './useInterval'

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd')

export function useToday() {
	const [today, setToday] = useState(formatDate(new Date()))

	useInterval(() => {
		const newToday = formatDate(new Date())
		if (newToday !== today) setToday(newToday)
	}, 60000)

	return today
}
