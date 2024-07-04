import AsyncStorage from '@react-native-async-storage/async-storage'
export const USER_EMAIL = '@USER_EMAIL'
export const IS_ONBOARDED = '@IS_ONBOARDED'
export const LOG_FILE = '@LOG_FILE'
export const MEMORY_WARNING_TIMESTAMP = '@MEMORY_WARNING_TIMESTAMP'
export const NEVER_SHOW_CONNECTIVITY_TIP = '@NEVER_SHOW_CONNECTIVITY_TIP_V3'
export const ARO_BLE_HEARTBEAT = '@ARO_BLE_HEARTBEAT'
export const SHOULD_PROMPT_FOR_REVIEW = '@SHOULD_PROMPT_FOR_REVIEW_V0'
export const CONNECTIVITY_TIP_COUNT = '@CONNECTIVITY_TIP'
export const NFC_ENABLE = '@NFC_ENABLE'
export const NFC_TOGGLE = '@NFC_TOGGLE'

export async function storeString(key: string, value: string) {
	await AsyncStorage.setItem(key, value)
}

export async function readString(key: string) {
	return AsyncStorage.getItem(key)
}

export async function deleteString(key: string) {
	return AsyncStorage.removeItem(key)
}

const deprecatedKeys = ['@NEVER_SHOW_CONNECTIVITY_TIP_V2']
export async function cleanupDeprecatedKeys() {
	try {
		for (const key of deprecatedKeys) {
			await AsyncStorage.removeItem(key)
		}
	} catch (_) {}
}
