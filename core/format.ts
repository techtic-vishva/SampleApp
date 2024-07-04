import { format, intervalToDuration, parseISO } from 'date-fns'

type DurationFormatted = Duration & {
	months?: number
	years?: number
}

type Duration = {
	days?: number
	hours?: number
	minutes?: number
	seconds?: number
}

export const parseDuration = (duration: Duration) => {
	let label = 'min',
		count = 0

	if (duration.days && duration.days > 0) {
		count = duration.days
		label = `day${count > 1 ? 's' : ''}`
	} else if (duration.hours && duration.hours > 0) {
		count = duration.hours
		label = `hour${count > 1 ? 's' : ''}`
	} else if (duration.minutes && duration.minutes > 0) {
		count = duration.minutes
		label = `min${count > 1 ? 's' : ''}`
	}

	return [label, count]
}

const padTimePart = (minutes?: number) => {
	return `${minutes || 0}`.padStart(2, '0')
}

export const daysHoursMinutes = (duration: Duration) => {
	return `${padTimePart(duration.days)}:${padTimePart(duration.hours)}:${padTimePart(duration.minutes)}`
}

export const formatLocalTimeWithoutSeconds = (date: Date) => {
	return format(date, 'h:mm a')
}

export const timeRange = (startISO: string, endISO: string) => {
	const start = new Date(startISO)
	const end = new Date(endISO)

	return `${formatLocalTimeWithoutSeconds(start)} to ${formatLocalTimeWithoutSeconds(end)}`
}

export const formatDurationSeparate = (duration: Duration, maxTimeParts: number = 3) => {
	const formattedDuration: DurationFormatted = duration
	const parts = []
	const maxPartsLength = maxTimeParts * 2

	// Pre-format
	if (formattedDuration.hours && formattedDuration.hours > 99) {
		formattedDuration.days = (formattedDuration.days || 0) + Math.floor(formattedDuration.hours / 24)
		formattedDuration.hours = formattedDuration.hours % 24
	}

	if (formattedDuration.days && formattedDuration.days > 99) {
		formattedDuration.months = (formattedDuration.months || 0) + Math.floor(formattedDuration.days / 30)
		formattedDuration.days = formattedDuration.days % 30
	}

	// Process
	if (formattedDuration.months && formattedDuration.months > 0 && parts.length < maxPartsLength) {
		parts.push(formattedDuration.months)
		parts.push(`mnth`)
	}

	if (formattedDuration.days && formattedDuration.days > 0 && parts.length < maxPartsLength) {
		parts.push(formattedDuration.days)
		parts.push(formattedDuration.days > 1 ? `days` : `day`)
	}

	if (formattedDuration.hours && formattedDuration.hours > 0 && parts.length < maxPartsLength) {
		parts.push(formattedDuration.hours)
		parts.push(`hr`)
	}

	if (formattedDuration.minutes && formattedDuration.minutes > 0 && parts.length < maxPartsLength) {
		parts.push(formattedDuration.minutes)
		parts.push(`min`)
	}

	if (formattedDuration.seconds && formattedDuration.seconds > 0 && parts.length < maxPartsLength) {
		parts.push(formattedDuration.seconds)
		parts.push(`sec`)
	}

	if (parts.length === 0) return [0, 'min']

	return parts
}
export function toMinutes(duration: Duration | undefined | string) {
	if (!duration) return 0
	if (typeof duration !== 'string') duration = `${duration.hours || 0}:${duration.minutes || 0}:00}`
	let [hours, minutes, seconds] = (duration as string).split(':').map((s) => parseInt(s, 10))
	return (minutes ?? 0) + (hours ?? 0) * 60
}
export const formatDuration = (duration: Duration, maxTimeParts: number = 3) => {
	return formatDurationSeparate(duration, maxTimeParts).join(' ')
}

export function activeTime(start: string) {
	if (!start || !start.length) return ''

	const result = formatDuration(
		intervalToDuration({
			start: new Date(start),
			end: new Date()
		}),
		2
	)

	return result === '0 min' ? '---' : result
}

export function toTitleCase(title: string) {
	return title?.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	})
}

export function getISO(date: Date) {
	return format(date, 'yyyy-MM-dd')
}

export function getFirstName(name: string) {
	if (!name) return ''
	return name.split(' ')[0]
}

export function stripTimestampAndParseDate(date: string) {
	return parseISO(date.replace(/T.*/, ''))
}
