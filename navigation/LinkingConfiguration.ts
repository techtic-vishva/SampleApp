/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications'

import { RootStackParamList } from '../types'

const linking: LinkingOptions<RootStackParamList> = {
	prefixes: [Linking.makeUrl('/'), 'https://*.goaro.com'],
	config: {
		screens: {
			Root: {
				path: '/',
				screens: {
					MotivationTab: {
						path: 'motivation/:initialRouteName?'
					},
					GroupTab: {
						path: 'group'
					},
					FamilyTab: {
						path: 'family/:groupId?/:date?'
					}
				}
			},

			Group: {
				screens: {
					GroupJoin: {
						path: 'group/join/:invite_code'
					},
					GroupSummary: {
						path: 'group/:groupId'
					}
				}
			},
			Profile: {
				screens: {
					WeeklyRecap: {
						path: 'weekly-recap/:endDate'
					},
					ProfileTab: {
						path: 'profile/:initialRouteName?'
					}
				}
			},
			ChallengeScreen: 'challenge/:challengeId',
			GoalModal: {
				path: 'goal/:value'
			},
			AroGo: '/nfc/start',
			NotFound: '*'
		}
	},
	async getInitialURL() {
		// First, you may want to do the default deep link handling
		// Check if app was opened from a deep link
		let url = await Linking.getInitialURL()

		if (url != null) {
			return url
		}

		// Handle URL from expo push notifications
		const response = await Notifications.getLastNotificationResponseAsync()
		if (typeof response?.notification.request.content.data.url === 'string')
			url = response?.notification.request.content.data.url || null

		return url
	},
	subscribe(listener: (arg0: string) => void) {
		// Listen to incoming links from deep linking
		const linkingSubscription = Linking.addEventListener('url', ({ url }: { url: any }) => {
			listener(url)
		})

		// Listen to expo push notifications
		const subscription = Notifications.addNotificationResponseReceivedListener((response: any) => {
			const { url } = response.notification.request.content.data

			// Let React Navigation handle the URL
			if (typeof url === 'string' && url.length > 0) {
				listener(url)
			}
		})

		return () => {
			// Clean up the event listeners
			linkingSubscription.remove()
			subscription.remove()
		}
	}
}

export default linking
