import { get } from './http'

export function markAsRead(id: string) {
	return get(`/notification/tracking/${id}/read`)
}
