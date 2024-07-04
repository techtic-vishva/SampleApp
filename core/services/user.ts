import { post, put, get, delete_, getMetadata } from './http'
import { useQuery } from 'react-query'
import * as FileSystem from 'expo-file-system'
import { getUser } from '../Authentication'
import { getPushToken } from '../Notifications'

let appInitResponse: AppInitResponse

export type UserUpdate = {
	fullName?: string
	persona?: string[]
	avatar?: string
	metadata?: { [key: string]: any }
}

export type AppInitRequest = {
	pushToken: string
}

export type AppInitResponse = {
	shouldPromptForReview: boolean
	enableNfc: boolean
}

export type AppUser = {
	userid: string
	email: string
	fullname: string
	householdGroupId: string
	persona: string[]
	goal: {
		hours: number
		minutes: number
	}
	avatar?: string
	householdInviteCode: string
	guestInviteCode: string
	referralInviteCode: string
	userRole: string
	referralCount: number
	metadata?: { [key: string]: any }
}

export type Survey = {
	id: number
	name: string
	type: string
	role: string
	questions: SurveyQuestions[]
}
export type SurveyQuestions = {
	id: number
	question: string
}

export async function update(update: UserUpdate) {
	return put('/user', update)
}

export async function appInit() {
	if (appInitResponse) {
		return appInitResponse
	}

	let token = await getPushToken()
	appInitResponse = await post<AppInitResponse>(`/user/app/init`, {
		pushToken: token.data,
		metadata: await getMetadata()
	})

	return appInitResponse
}

export function getAppUser() {
	return get<AppUser>('/user/self')
}

export async function setGoal(interval: string) {
	post('/user/setting/goal', { interval })
}

export async function deleteUser() {
	delete_('/user/self')
}

export function useUser() {
	return useQuery('user', getAppUser)
}

export function activate(code: string) {
	return post<{ success: boolean }>(`/user/register/${code}`)
}

export function autoActivate() {
	return post<{ success: boolean }>(`/user/auto-register/`)
}

export async function logout() {
	return get(`/user/logout`)
}

export async function uploadProfilePhoto({ fileName, uri, type }: { fileName: string; uri: string; type: string }) {
	const user = getUser()
	const file = `${user?.uid}-${fileName}`
	const url = await get<string>(`/user/upload?file=${file}&type=${type}`)

	const result = await FileSystem.uploadAsync(url, uri, {
		headers: { 'Content-Type': type },
		httpMethod: 'PUT'
	})

	if (result.status !== 200) return

	await update({
		avatar: `https://storage.googleapis.com/aro-public/avatars/${file}`
	})
}

export function getSurveyQuestions(surveyId: number) {
	return get<Survey>(`/user/survey/${surveyId}`)
}

export function useSurveyQuestions(surveyId: number) {
	return useQuery(['survey-question', surveyId], () => getSurveyQuestions(surveyId))
}

export function setSurveyResponse(surveyId: number, questionId: number, answer: boolean) {
	return put(`/user/survey/${surveyId}/question/${questionId}`, { answer: answer })
}

export async function setGoalWithType(interval: string, goalType: string) {
	post('/user/setting/goal', { interval, goalType })
}

export async function houseHoldInvite(
	userList: {
		name: string
		role: string
		email: string
	}[],
	invitedFrom: string
) {
	return post(`/user/household/invite?invitedFrom=${invitedFrom}`, userList)
}

export async function searchSurvey(type: string, role: string) {
	return get<Survey[]>(`/user/survey/search/${type}/${role}`)
}
