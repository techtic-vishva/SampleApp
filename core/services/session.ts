import { post, get, put, delete_, getMetadata } from './http'
import { useQuery, useInfiniteQuery } from 'react-query'
import { queryClient } from '../queryClient'
import { logger as baseLogger } from '../logger'
import { getTimeZone } from 'react-native-localize'
import * as Battery from 'expo-battery'

// FIX ME:  Use Native Module for RFC Compliance
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

export const logger = baseLogger.extend('HTTP')

export type Stats = {
	year: number
	month?: number
	duration: {
		days: number
		hours: number
		minutes: number
	}
	sessions: number
}

export type Session = {
	id: number
	uuid: string
	userid: string
	deviceId: string
	aroDeviceId: string
	tagId: number
	startTime: string
	endTime: string
	duration: {
		days: number
		hours: number
		minutes: number
	}
	isOvernight: boolean
	timeZone: string
	metadata: { [key: string]: any }
	voidedReason: string
}

export type StartSession = Pick<Session, 'uuid' | 'startTime' | 'aroDeviceId' | 'timeZone' | 'metadata'>
export type EndSession = Pick<Session, 'endTime' | 'voidedReason' | 'metadata'>
export type UpdateSession = Partial<Pick<Session, 'tagId' | 'startTime' | 'endTime' | 'isOvernight'>>
export type CreateSession = Partial<
	Pick<Session, 'uuid' | 'startTime' | 'endTime' | 'timeZone' | 'metadata' | 'tagId' | 'isOvernight' | 'aroDeviceId'>
>

export type Page<T> = {
	data: T[]
	nextPage: number | undefined
}

export type Tag = {
	id: number
	name: string
	type: string
	retiredOn: string
}

export type CalendarEntry = {
	date: string
	isOvernight: boolean
	progress: number
}

export type TagStreak = {
	tagId: number
	days: number
}

export type Summary = {
	goal: Duration
	achieved: Duration
	progress: number
	sessions: Session[]
	weekdays: CalendarEntry[]
	streakLength: number
	tagStreaks: TagStreak[]
}
export type MonthlySummary = { month: string; entries: CalendarEntry[] }

export type SessionEndEvent = Pick<Session, 'id' | 'uuid' | 'duration' | 'isOvernight'> & {
	didMeetGoal: boolean
	goalMetStreak: number
	notification?: PushNotification
	voidedOn?: string
}

export async function buildSessionBase(firmware?: string) {
	const [metadata, batteryLevel] = await Promise.all([getMetadata(), Battery.getBatteryLevelAsync()])

	return {
		uuid: uuidv4(),
		timeZone: getTimeZone(),
		metadata: {
			aroFirmwareVersion: firmware,
			batteryLevel: batteryLevel,
			...metadata
		}
	}
}

export type PushNotification = {
	body: string
	subtitle: string
}

export async function start(session: StartSession) {
	return post<{ isNewSession: boolean; id: string; notification?: PushNotification }>(`/session/start`, session)
}

export async function create(session: CreateSession) {
	return post<{ error?: string, didMeetGoal?: boolean }>(`/session/`, session)
}

export async function end(session: EndSession) {
	return post<SessionEndEvent>('/session/end', session)
}

export async function manualCleanup(session: EndSession) {
	return post<SessionEndEvent>('/session/manual-cleanup', session)
}

export async function update(sessionId: string, session: UpdateSession) {
	return put(`/session/${sessionId}`, session)
}

export async function deletes(sessionId: string, reason?: string) {
	const query = reason ? `?reason=${reason}` : ''
	return delete_(`/session/${sessionId}${query}`)
}

export async function stats(type: 'year' | 'month') {
	return get<Stats[]>(`/session/stats/${type}`)
}

export async function search({ page }: { page: number }) {
	return get<Page<Session>>(`/session`, { page })
}

async function read(sessionId: string) {
	return get<Session>(`/session/${sessionId}`)
}

export async function setGoal(interval: string) {
	post('/user/setting/goal', { interval })
}

export function useSession(sessionId: string) {
	return useQuery(['session', sessionId], () => read(sessionId))
}

export function useSessionStats(type: 'year' | 'month') {
	return useQuery(['session-stats', type], () => stats(type))
}

export function useInfiniteSessionList() {
	return useInfiniteQuery('sessions', (context) => search({ page: context.pageParam ?? 1 }), {
		getNextPageParam: (lastPage, pages) => lastPage.nextPage
	})
}

export function summary(date: string, includeInProgress: boolean) {
	return get<Summary>(`/session/summary/${date}?includeInProgress=${includeInProgress}`)
}

export function useSummary(date: string, includeInProgress: boolean) {
	return useQuery(['session-summary', date, includeInProgress], () => summary(date, includeInProgress))
}

export function prefetchSummary(date: string) {
	return queryClient.prefetchQuery(['session-summary', date], () => summary(date, false), {
		staleTime: 60000
	})
}

export function useTags() {
	return useQuery('session-tags', () => {
		return get<Tag[]>(`/session-tag`)
	})
}

export function useRecentTags() {
	return useQuery('session-tags-recent', () => {
		type recentTag = { tagId: number; count: number }
		return get<recentTag[]>('/session-tag/recent')
	})
}

export async function createTag(name: string) {
	return post<{ id: number }>('/session-tag', { name })
}

export async function deleteTag(id: number) {
	return delete_(`/session-tag/${id}`)
}

export async function updateTag(tag: Pick<Tag, 'id' | 'name'>) {
	return put(`/session-tag/${tag.id}`, tag)
}

export function monthSummary(month: string) {
	return get<MonthlySummary>(`/session/month-summary/${month}`)
}

export function useMonthSummary(month: string) {
	return useQuery(['month-summary', month], () => monthSummary(month))
}
