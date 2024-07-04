import NfcManager, { NfcTech, Ndef, NfcError } from 'react-native-nfc-manager'
import { logger as baseLogger } from './logger'

const logger = baseLogger.extend('NFC')

export const scan = async () => {
	logger.info(`[scan] Scanning for Aro tags`)

	try {
		await NfcManager.requestTechnology(NfcTech.Ndef, {
			alertMessage: 'Scan your Aro tag to start a new session.'
		})
		const tag = await NfcManager.getTag()

		const message = Ndef.decodeMessage(tag?.ndefMessage[0]?.payload || [])[0]

		logger.info('[scan] Found tag with message:', message)

		return message
	} catch (error) {
		if (error instanceof NfcError.UserCancel) {
			logger.warn('[scan] Received user cancellation')
		} else {
			logger.error('[scan] Error caught:', error)
		}
	} finally {
		await NfcManager.cancelTechnologyRequest()
	}

	return null
}
