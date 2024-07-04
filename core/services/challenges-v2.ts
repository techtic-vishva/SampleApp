import { useQuery } from 'react-query'
import { getV2, putV2, delete_V2 } from './http'

export type ChallengesV2 = {
	id: number
	title: string
	description: string
	start: string
	end: string
	max: number
	successDescription: string
	achievementId: number
	valueDescription: string
	criteria: string[]
	progressQuery?: string
	badgeUrl: string
	shortDescription: string
	count: number
	thumbnailUrl: string
	status: 'success' | 'in-progress' | 'expired' | 'upcoming'
	leaderboardEnabled: boolean
	members: number
}

export type ChallengeLeaderboard = {
	name: string
	avatarUrl: string
	count: number
	userid: string
}

export function getChallenges(active?: boolean) {
	return getV2<ChallengesV2[]>(`/challenges?active=${active ? 'Y' : 'N'}`)
}

export function useChallenges(active?: boolean) {
	return useQuery(['challenges', active], () => getChallenges(active))
}

export function getChallenge(id: number) {
	return getV2<ChallengesV2 & { userHasJoined: boolean }>(`/challenges/${id}`)
}

export function useChallenge(id: number) {
	return useQuery(['challenge', id], () => getChallenge(id))
}

export function joinChallenge(id: number) {
	return putV2(`/challenges/${id}/join`)
}

export function myChallenges(active?: boolean) {
	return getV2<ChallengesV2[]>(`/challenges/user?active=${active ? 'Y' : 'N'}`)
}

export function useMyChallenges(active?: boolean) {
	return useQuery(['my-challenges', active], () => myChallenges(active))
}

export function leaveChallenge(id: number) {
	return delete_V2(`/challenges/${id}/leave`)
}

export function getLeaderboard(challengeId: number) {
	return getV2<ChallengeLeaderboard[]>(`/challenges/${challengeId}/leaderboard`)
}

export function useLeaderboard(challengeId: number) {
	return useQuery(['challenge-leaderboard', challengeId], () => getLeaderboard(challengeId))
}
