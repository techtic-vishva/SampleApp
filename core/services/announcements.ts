import { useQuery } from 'react-query'
import { hasSeenTour } from '../../hooks/useTour'
import { post, put } from './http'
import { getMetadata } from './http'

export type Announcement = {
	id: number
	title: string
	body: string
	buttonLabel: string
	code: string
	url?: string
}

export async function readAnnouncements() {
	const hasSeenHomeTour = await hasSeenTour('home')
	if (!hasSeenHomeTour) return []

	const metadata = await getMetadata()
	const announcementsData = await post<Announcement[]>('/announcements', metadata)
	return announcementsData
}

export function useAnnouncements() {
	return useQuery('announcements-v2', readAnnouncements)
}

export async function trackAnnouncement(code: string) {
	return put(`/announcements/${code}/track`)
}
