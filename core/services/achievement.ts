import { post, get, put, delete_ } from './http'
import { useQuery } from 'react-query'
import { sendAchievementNotification } from '../Notifications'
import { GlobalState } from '../GlobalState'

export type Achievement = {
	id: number
	code: string
	displayName: string
	badgeUrl: string
	type: string
}

export type AchievementMark = {
	marked: boolean
	achievement: Achievement
}

export function process() {
	return post<Achievement[]>(`/achievement/process`)
}

export function useUserAchievements() {
	type UserAchievement = {
		achievementId: number
		insertedOn: string
	}

	return useQuery('user-achievements', () => {
		return get<UserAchievement[]>(`/achievement/user`)
	})
}

export function useAchievements() {
	return useQuery('achievements', () => {
		return get<Achievement[]>(`/achievement/all`)
	})
}

export async function mark(code: string) {
	const result = await post<AchievementMark>(`/achievement/mark/${code}`)

	if (result.marked && GlobalState.isOnboarded) {
		sendAchievementNotification(result.achievement?.displayName, result.achievement?.code)
	}
}
