import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Linking, Platform } from 'react-native'
import { markAsRead } from './services/notifications'
import { Channels, Sounds } from '../constants/Notifications'
import { logger as baseLogger } from './logger'

const logger = baseLogger.extend('NOTIFICATIONS')

const SoundChannelMap = new Map<string, string>()
const setNotificationChannelAsync = async (
	id: string,
	channel: Notifications.NotificationChannelInput
): Promise<Notifications.NotificationChannel | null> => {
	if (channel.sound) {
		SoundChannelMap.set(channel.sound as string, id)
	}

	const notificationChannel = await Notifications.setNotificationChannelAsync(id, channel)

	if (!notificationChannel) {
		logger.error(`[setNotificationChannelAsync] Could not set channel ${channel.name}`)
		return null
	}

	return notificationChannel
}

export const init = () => {
	// Foreground Notification Handling
	Notifications.setNotificationHandler({
		handleNotification: async (notification: Notifications.Notification) => {
			logger.info(
				`[handleNotification] Id: ${notification.request.identifier} Content: ${JSON.stringify(
					notification.request.content
				)}`
			)

			return {
				shouldPlaySound: true,
				shouldSetBadge: true,
				shouldShowAlert: true
			}
		}
	})

	// Default Link Handler
	Notifications.addNotificationResponseReceivedListener((event) => {
		logger.info(`[notificationResponseReceived] ${JSON.stringify(event)})`)

		const { url, externalURL, pushNotificationId } = event.notification.request.content.data

		// Tracking
		if (typeof pushNotificationId === 'string') {
			markAsRead(pushNotificationId).catch(() => {})
		}

		if (typeof url === 'string' && url.length > 0) {
			// handled in `LinkingConfiguration.ts`
			return
		}

		if (typeof externalURL === 'string' && externalURL.length > 0) {
			Linking.openURL(externalURL)
			return
		}
	})
}

export const getPushToken = async (): Promise<Notifications.ExpoPushToken | { data: string }> => {
	if (Platform.OS === 'android') {
		await Promise.all([
			setNotificationChannelAsync(Channels.sessionStart, {
				name: 'Session Start notifications',
				sound: Sounds.sessionStart,
				importance: Notifications.AndroidImportance.MAX,
				lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC
			}),
			setNotificationChannelAsync(Channels.sessionEnd, {
				name: 'Session End notifications',
				sound: Sounds.sessionEnd,
				importance: Notifications.AndroidImportance.MAX,
				lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC
			})
		])
	}

	if (!Device.isDevice) return { data: 'SIMULATOR' }

	return await Notifications.getExpoPushTokenAsync({
		experienceId: '@aro-technology/aro-mobile'
	})
}

export async function sendLocalNotification({
	title,
	body,
	subtitle,
	delaySeconds,
	data,
	sound
}: {
	title?: string
	body: string
	subtitle: string
	delaySeconds?: number
	sound?: string
	data?: { [key: string]: unknown }
}) {
	const content: Notifications.NotificationContentInput = {
		title: title || 'Aro',
		subtitle,
		body,
		data,
		sound: Platform.OS === 'android' ? true : sound
	}
	const channelId = SoundChannelMap.get(sound as string)
	const trigger = Platform.select<Notifications.NotificationTriggerInput>({
		default: delaySeconds ? { seconds: delaySeconds } : null,
		android: delaySeconds ? { channelId, seconds: delaySeconds } : { channelId }
	})

	const notificationId = await Notifications.scheduleNotificationAsync({ content, trigger })

	return notificationId
}

export async function clearExtraSessionNotifications(sessionId: string) {
	try {
		const currentNotifications = await Notifications.getPresentedNotificationsAsync()

		const relevantNotifications = currentNotifications
			.filter((cn) => cn.request.content.data?.sessionId === sessionId)
			.sort((cn) => cn.date)
			.reverse()

		// Only a start notification is present
		if (relevantNotifications.length <= 1) {
			return
		}

		// Dismiss extra notifications, skip first as it is the start
		for (let i = 1; i < relevantNotifications.length; i++) {
			logger.info(
				`[clearExtraSessionNotifications] Dismissing notification ${relevantNotifications[i].request.identifier}`
			)

			await Notifications.dismissNotificationAsync(relevantNotifications[i].request.identifier)
		}
	} catch (error) {
		logger.error('[clearExtraSessionNotifications] Error caught: ', error)
	}
}

export const sendAchievementNotification = async (displayName?: string, code?: string) => {
	await sendLocalNotification({
		body: `You've earned the ${displayName} badge, nice work!`,
		subtitle: 'New Achievement',
		delaySeconds: 15,
		data: {
			type: 'achievement',
			highlightAchievementCode: code
		}
	})
}
