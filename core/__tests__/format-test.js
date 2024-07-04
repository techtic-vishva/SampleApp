import {
	activeTime,
	formatLocalTimeWithoutSeconds,
	parseDuration,
	daysHoursMinutes,
	timeRange,
	formatDuration,
	formatDurationSeparate
} from '../format'

describe('activeTime', function () {
	it('should return duration if the passed date is correct', function () {
		var date = new Date()

		expect(activeTime(date))
	})
})

describe('formatLocalTimeWithoutSeconds', function () {
	it('should return formated time if the passed date is correct', function () {
		var date = new Date()

		expect(formatLocalTimeWithoutSeconds(date))
	})
})

describe('parseDuration', function () {
	it('should return days/hours/minutes count or lable', function () {
		expect(parseDuration({ days: 1, hours: 2, minutes: 0, seconds: 0 }))
	})
})

describe('daysHoursMinutes', function () {
	it('should return padTimePart if duration is valid', function () {
		expect(daysHoursMinutes({ days: 0, hours: 2, minutes: 0, seconds: 0 }))
	})
})

describe('timeRange', function () {
	it('should return timerange between two dates', function () {
		var date = new Date()

		expect(timeRange(date.toISOString(), date.toISOString()))
	})
})

describe('formatDuration', function () {
	it('should return a timeparts', function () {
		expect(formatDuration({ days: 0, hours: 2, minutes: 0, seconds: 0 }, 2))
	})
})

describe('formatDurationSeparate', function () {
	it('should return correctly', function () {
		expect(formatDurationSeparate({ days: 55, hours: 12 })).toEqual([55, 'days', 12, 'hr'])
		expect(formatDurationSeparate({ minutes: 55 })).toEqual([55, 'min'])
		expect(formatDurationSeparate({ hours: 12, minutes: 55 })).toEqual([12, 'hr', 55, 'min'])
		expect(formatDurationSeparate({ days: 13, hours: 12, minutes: 55 }, 2)).toEqual([13, 'days', 12, 'hr'])
		expect(formatDurationSeparate({ hours: 100, minutes: 34 }, 2)).toEqual([4, 'days', 4, 'hr'])
		expect(formatDurationSeparate({ hours: 100, minutes: 34 })).toEqual([4, 'days', 4, 'hr', 34, 'min'])
		expect(formatDurationSeparate({ days: 100, hours: 3 }, 2)).toEqual([3, 'mnth', 10, 'days'])
		expect(formatDurationSeparate({ days: 100, hours: 3 })).toEqual([3, 'mnth', 10, 'days', 3, 'hr'])
	})
})
