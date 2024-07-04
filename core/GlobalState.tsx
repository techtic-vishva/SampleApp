import {
	IS_ONBOARDED,
	NEVER_SHOW_CONNECTIVITY_TIP,
	readString,
	storeString,
	SHOULD_PROMPT_FOR_REVIEW,
	CONNECTIVITY_TIP_COUNT,
	NFC_ENABLE,
	NFC_TOGGLE
} from './Storage'
import { emitIsOnboarded, emitNfcToggle } from './EventBroker'
import { logger } from './logger'

export const GlobalState: {
	isOnboarded: boolean
	neverShowConnectivityTip: boolean
	isFirstExperience: boolean
	shouldPromptForReview?: boolean
	activationCode?: string
	connectivityTipCount: number
	nfc: {
		enable: boolean
		toggle: boolean
	}
} = {
	isOnboarded: false,
	neverShowConnectivityTip: false,
	isFirstExperience: false,
	shouldPromptForReview: undefined,
	activationCode: '',
	connectivityTipCount: 0,
	nfc: {
		enable: false,
		toggle: false
	}
}

// Restore from Persisted Storage
export const initializationComplete = (async () => {
	const shouldPromptForReview = await readString(SHOULD_PROMPT_FOR_REVIEW)
	if (typeof shouldPromptForReview === 'string') {
		GlobalState.shouldPromptForReview = shouldPromptForReview === 'true'
	}

	GlobalState.isOnboarded = (await readString(IS_ONBOARDED)) === 'true'
	GlobalState.neverShowConnectivityTip = (await readString(NEVER_SHOW_CONNECTIVITY_TIP)) === 'true'
	GlobalState.isFirstExperience = !GlobalState.isOnboarded // if not onboarded, then first experience
	GlobalState.connectivityTipCount = Number(await readString(CONNECTIVITY_TIP_COUNT))
	GlobalState.nfc = {
		enable: (await readString(NFC_ENABLE)) === 'true',
		toggle: (await readString(NFC_TOGGLE)) === 'true'
	}

	logger.info('Global State Bootstraped')
})()

export async function setIsOnboarded(value: boolean, persist: boolean = true) {
	GlobalState.isOnboarded = value
	if (persist) {
		await storeString(IS_ONBOARDED, value.toString())
	}
	emitIsOnboarded(value)
}

export async function setNeverShowConnectivityTip(value: boolean) {
	GlobalState.neverShowConnectivityTip = value
	await storeString(NEVER_SHOW_CONNECTIVITY_TIP, value.toString())
}

export async function setShouldPromptForReview(value: boolean) {
	// Initialize
	if (GlobalState.shouldPromptForReview === undefined && value === true) {
		GlobalState.shouldPromptForReview = value
		await storeString(SHOULD_PROMPT_FOR_REVIEW, value.toString())
	}

	// Track seen
	if (GlobalState.shouldPromptForReview === true && value === false) {
		GlobalState.shouldPromptForReview = value
		await storeString(SHOULD_PROMPT_FOR_REVIEW, value.toString())
	}
}

export async function setActivationCode(value: string) {
	GlobalState.activationCode = value
}

export async function incrementConnectivityTipCount() {
	await storeString(CONNECTIVITY_TIP_COUNT, (GlobalState.connectivityTipCount + 1).toString())
}

export async function setNfcEnable(value: boolean) {
	GlobalState.nfc.enable = value
	await storeString(NFC_ENABLE, value.toString())
}

export async function setNfcToggle(value: boolean) {
	GlobalState.nfc.toggle = value
	await storeString(NFC_TOGGLE, value.toString())
	emitNfcToggle(value)
}
