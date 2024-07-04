import { post } from './http'
import { isAuthenticated } from '../Authentication'

export type NavigationAction = {
	previousRouteName: string
	currentRouteName: string
}
export type UserActions = { code: string; metadata: { [key: string]: any } }

export async function trackUserNavigation(navigation: NavigationAction) {
	if (isAuthenticated()) {
		post('/track/navigation', navigation)
	}
}

export async function logAction(userActions: UserActions) {
	post('/track/action', userActions)
}
