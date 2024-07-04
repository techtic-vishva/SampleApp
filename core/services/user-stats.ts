import { useQuery } from 'react-query'
import { get } from './http'

export type OverView = {
	achievements: number
	fullname: string
	avatar?: string
	userGoal: {
		hours: number
		minutes: number
	}
	totalTime: Duration
	streakLength: number
	joinDate: string
}

export type SessionTagAgg = {
	name: string
	duration: Duration
}

export type UserMetrics = {
	averageGoalObtainment: number
	totalSessionCount: number
	sessionTags: SessionTagAgg[]
	totalTime: Duration
}

export type WeeklyRecap = {
	startDate: string
	endDate: string
	totalTime: Duration
	averageTime: Duration
	totalSessions: number
	countGoalMet: number
	topActivities: SessionTagAgg[]
}

export function useOverView(userId: string, includeOvernights: boolean) {
	return useQuery(['user-stats', userId, includeOvernights], () => overView(userId, includeOvernights))
}

export function overView(userId: string, includeOvernights: boolean) {
	return get<OverView>(`/user-stats/${userId}/overview?includeOvernights=${includeOvernights ? 'Y' : 'N'}`)
}

export function useMetrics(userId: string, start: string, end: string, includeOvernights: boolean) {
	return useQuery(['user-stats-metrics', userId, start, end, includeOvernights], () =>
		metrics(userId, start, end, includeOvernights)
	)
}

export function metrics(userId: string, start: string, end: string, includeOvernights: boolean) {
	return get<UserMetrics>(
		`/user-stats/${userId}/metrics/${start}/${end}?includeOvernights=${includeOvernights ? 'Y' : 'N'}`
	)
}

export function useWeeklyRecap(end: string, includeOvernights: boolean) {
	return useQuery(['user-stats-weekly-recaps', end, includeOvernights], () => weeklyRecap(end, includeOvernights))
}

export function weeklyRecap(end: string, includeOvernights: boolean) {
	return get<WeeklyRecap>(`/user-stats/weekly-summary/${end}?includeOvernights=${includeOvernights ? 'Y' : 'N'}`)
}
