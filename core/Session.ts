import { PhoneState } from './connectivity/AroDevice'
import { DeviceConnectionEvent, emitSessionStatus, onDeviceConnection } from './EventBroker'
import { navigateTo } from '../navigation/utils'
import { start, end, buildSessionBase } from './services/session'
import { logger as baseLogger } from './logger'
import { process } from './services/achievement'
import { clearExtraSessionNotifications, sendAchievementNotification, sendLocalNotification } from './Notifications'
import { Sounds } from '../constants/Notifications'
import * as Battery from 'expo-battery'
import * as fastq from 'fastq'
import type { queueAsPromised } from 'fastq'

const logger = baseLogger.extend('SESSION')

type SessionData = {
	sessionId: string
}

const queue: queueAsPromised<DeviceConnectionEvent> = fastq.promise(
	async (event: DeviceConnectionEvent): Promise<void> => {
		try {
			if (event.newState === PhoneState.OUT && event.previousState === PhoneState.IN) {
				await endActiveSession(event?.metadata)
			} else if (event.newState === PhoneState.IN && event.previousState === PhoneState.OUT) {
				await startNewSession(event)
			}
		} catch (error) {
			logger.error(`[onDeviceConnection(${JSON.stringify(event)})] Unexpected error: `, error)
		}
	},
	1
)

onDeviceConnection(queue.push)

export const startNewSession = async (event: DeviceConnectionEvent) => {
	logger.info('[startNewSession] Collect metadata...')
	const base = await buildSessionBase(event.aroFirmwareVersion)

	logger.info('[startNewSession] Start new session...')
	const result = await start({
		...base,
		aroDeviceId: event.aroDeviceId,
		startTime: new Date().toISOString()
	})

	logger.info(`[startNewSession] Session started: ${result.id}`)

	emitSessionStatus('Start')

	const notificationData: SessionData = {
		sessionId: result.id
	}

	// Handle session continuation
	if (!result.isNewSession) {
		logger.info('[startNewSession] Prior session continued...')
		await clearExtraSessionNotifications(notificationData.sessionId)
		navigateTo('Root', {})
	}

	if (!result.notification) {
		logger.info('[startNewSession] No notification returned from API...')
		return
	}

	logger.info('[startNewSession] Sending notification')
	await sendLocalNotification({
		body: result.notification?.body,
		subtitle: result.notification?.subtitle,
		data: notificationData,
		sound: Sounds.sessionStart
	})
}

export const endActiveSession = async (metadata?: { [key: string]: any }) => {
	logger.info(`[endActiveSession] End active session...`)
	const batteryLevelEnd = await Battery.getBatteryLevelAsync()
	logger.info(`[endActiveSession] Battery level at end: ${batteryLevelEnd}`)

	const result = await end({
		endTime: new Date().toISOString(),
		voidedReason: '',
		metadata: metadata ? {
			...metadata, batteryLevelEnd: batteryLevelEnd
		} : {
			batteryLevelEnd: batteryLevelEnd
		}
	})

	logger.info(`[endActiveSession] Session ended: ${result.id}`)

	emitSessionStatus('End')

	if (!result) {
		logger.error('[endActiveSession] Session end failed.')
		return
	}

	if (!result.notification) {
		logger.info('[endActiveSession] No notification returned from API...')
		return
	}

	// Session may have been ommited (minimum duration, error)
	if (result.voidedOn) {
		logger.info('[endActiveSession] Session voided, sending notification')

		await sendLocalNotification({
			body: result.notification.body,
			subtitle: result.notification.subtitle
		})

		return
	}

	const notificationData: SessionData = {
		sessionId: `${result.id}`
	}

	// Navigate to next page if not overnight
	if (result.isOvernight !== true) {
		navigateTo(result.didMeetGoal ? 'GoalMet' : 'EditSession', { uuid: result.uuid })
	}

	// Notify User
	await clearExtraSessionNotifications(notificationData.sessionId)

	logger.info('[endActiveSession] Sending notification')
	await sendLocalNotification({
		body: result.notification.body,
		subtitle: result.notification.subtitle,
		data: notificationData,
		sound: Sounds.sessionEnd
	})

	// New Achievements
	// Todo: Refactor this into proper push notifications?
	const newAchievements = await process()
	if (newAchievements && newAchievements.length) {
		logger.info(`[endActiveSession] New achievements detected [${newAchievements.length}]`)
		const target = newAchievements.pop()
		if (target) sendAchievementNotification(target.displayName, target.code)
	}
}

export const saveSession = () => { }

export const startSessionEventMonitoring = () => { }
