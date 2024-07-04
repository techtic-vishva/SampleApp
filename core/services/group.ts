import { useQuery } from 'react-query'
import { getUser } from '../Authentication'
import { queryClient } from '../queryClient'
import { delete_, get, post, put } from './http'
import * as FileSystem from 'expo-file-system'
import { UserMetrics } from './user-stats'

export function join(inviteCode: string) {
	return post<Partial<JoinGroup>>(`/group/invitation/${inviteCode}/join`)
}

export function leave(groupId: string) {
	return delete_(`/group/${groupId}/membership`)
}

export type GroupUser = {
	fullname: string
	avatar?: string
}
export type JoinGroup = {
	data: Group
	msg?: string
}

export type Group = {
	// Meta
	id: string
	name: string
	inviteCode: string
	type: 'household' | 'standard'
	creator?: string

	// Details
	users: GroupUser[]
	active: boolean
	avatar?: string
}

export function create(group: Partial<Group>) {
	return post<Group>('/group', group)
}

export function update(groupId: string, group: Partial<Group>) {
	return put(`/group/${groupId}`, group)
}

export function deleteGroup(groupId: string) {
	return delete_(`/group/${groupId}`)
}

export type GroupSummaryUser = {
	fullname: string
	avatar?: string
	totalTime: Duration
	totalSessions: number
	active: boolean
	overnightCount: number
	maxStartTime: string
	userid: string
	progress?: number
}

export type GroupSummary = {
	id: string
	name: string
	inviteCode: string
	type: 'household' | 'standard'
	totalTime: Duration
	users: GroupSummaryUser[]
}

export type GroupMember = {
	groupId: string
	userid: string
	fullname: string
	avatar: string
}

export type HouseHoldNotification = {
	userid: string
	enabled: boolean
}

export type LeaderboardUsers = {
	fullname: string
	avatar?: string
	totalTime: Duration
	active: boolean
	overnightCount: number
	maxStartTime: string
	userid: string
	activated: boolean
}

export type Leaderboard = {
	users: LeaderboardUsers[]
}

export type CalenderUsers = {
	userId: string
	totalTime: Duration
}

type CalendarEntry = {
	date: string
	users: CalenderUsers[] | null
	totalDuration: Duration
}

export type GroupSummaryChart = {
	start: string
	end: string
	householdGoal: Duration
	calendar: {
		monday: CalendarEntry
		tuesday: CalendarEntry
		wednesday: CalendarEntry
		thursday: CalendarEntry
		friday: CalendarEntry
		saturday: CalendarEntry
		sunday: CalendarEntry
	}
	users: { userId: string; avatar: string; fullname: string }[]
}

export function readAll() {
	return get<Group[]>('/group')
}

export function useGroups() {
	return useQuery('groups', readAll)
}

export function read(groupId: string) {
	return get<Omit<Group, 'users' | 'active'>>(`/group/${groupId}`)
}

export function useGroup(groupId: string) {
	return useQuery(['group', groupId], () => read(groupId))
}

export function summary(groupId: string, start: string, end: string) {
	return get<GroupSummary>(`/group/summary/${groupId}/${start}/${end}`)
}

export function useSummary(groupId: string, start: string, end: string) {
	return useQuery(['group-summary', groupId, start, end], () => summary(groupId, start, end))
}

export function prefetchSummary(groupId: string, start: string, end: string) {
	return queryClient.prefetchQuery(['group-summary', groupId, start, end], () => summary(groupId, start, end), {
		staleTime: 60000
	})
}

/** Returns Users Except Self */
export function useGroupMembers(groupId: string, excludeSelf: boolean = true) {
	return useQuery(['group-members', groupId, excludeSelf], () => groupMembers(groupId, excludeSelf))
}

export function groupMembers(groupId: string, excludeSelf: boolean = true) {
	return get<GroupMember[]>(`/group/${groupId}/membership?excludeSelf=${excludeSelf}`)
}

export function removeGroupMember(groupId: string, userId: string) {
	return delete_(`/group/${groupId}/membership/${userId}`)
}
export async function notify(groupId: string) {
	return await post(`/group/${groupId}/notify`)
}

export function houseHoldNotifications() {
	return get<HouseHoldNotification[]>('/group/household/user-notification')
}

export default function useHouseHoldNotifications() {
	return useQuery('houshold-notification-settings', houseHoldNotifications)
}

export function userNotification(userId: string, enabled: boolean) {
	return put(`/group/household/user-notification/${userId}/${enabled}`)
}

export async function uploadGroupPhoto({
	fileName,
	uri,
	type,
	groupId
}: {
	fileName: string
	uri: string
	type: string
	groupId: string
}) {
	const file = `group-${groupId}-${fileName}`
	const url = await get<string>(`/user/upload?file=${file}&type=${type}`)

	const result = await FileSystem.uploadAsync(url, uri, {
		headers: { 'Content-Type': type },
		httpMethod: 'PUT'
	})

	if (result.status !== 200) return

	await update(groupId, {
		avatar: `https://storage.googleapis.com/aro-public/avatars/${file}`
	})
}

export function useGroupMetrics(groupId: string, start: string, end: string, includeOvernights: boolean) {
	return useQuery(['group-metrics', groupId, start, end, includeOvernights], () =>
		groupMetrics(groupId, start, end, includeOvernights)
	)
}

export function groupMetrics(groupId: string, start: string, end: string, includeOvernights: boolean) {
	return get<UserMetrics>(
		`/group/${groupId}/metrics/${start}/${end}?includeOvernights=${includeOvernights ? 'Y' : 'N'}`
	)
}

export function getLeaderboard(groupId: string, start: string, end: string) {
	return get<Leaderboard>(`/group/${groupId}/Leaderboard/${start}/${end}`)
}

export function useLeaderboard(groupId: string, start: string, end: string) {
	return useQuery(['group-leaderboard', groupId, start, end], () => getLeaderboard(groupId, start, end))
}

export function getSummaryChart(groupId: string, startDate: string, endDate: string, includeOvernights: boolean) {
	return get<GroupSummaryChart>(
		`/group/${groupId}/summary-chart/${startDate}/${endDate}?includeOvernights=${includeOvernights ? 'Y' : 'N'}`
	)
}

export function useSummaryChart(groupId: string, startDate: string, endDate: string, includeOvernights: boolean) {
	return useQuery(['group-summary-chart', groupId, startDate, endDate, includeOvernights], () =>
		getSummaryChart(groupId, startDate, endDate, includeOvernights)
	)
}
