import { useQuery } from 'react-query'
import { get } from './http'

export type Challenges = {
	id: string
	title: string
	description: string
	prize: string
	type: string
	data: Data
	status: 'upcoming' | 'in-progress' | 'success' | 'expired'
	start: string
	end: string
	successDescription: string
}

type Data = {
	max: number
	progress: number
	dates: string[]
	sessions?: SessionList[]
}

type SessionList = {
	uuid: string
	userid: string
	email: string
	fullname: string
	internal: boolean
	status: string
	startTimeUtc: string
	endTimeUtc: string
	startTimeLocal: string
	endTimeLocal: string
	duration: Duration
	timeZone: string
	tagId: string
	tagName: string
	tagType: string
	isOvernight: boolean
	deviceId: string
	aroDeviceId: string
	metadata: { [key: string]: any }
}

export function challenges() {
	return get<Challenges[]>(`/challenges`)
}

export function useChallenges() {
	return useQuery(['challenges'], challenges)
}
