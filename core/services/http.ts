import axios, { AxiosRequestConfig } from 'axios'
import { AppState, Platform } from 'react-native'
import {
	getBrand,
	getDeviceId,
	getFontScale,
	getManufacturer,
	getModel,
	getReadableVersion,
	getSystemName,
	getSystemVersion,
	getUniqueId
} from 'react-native-device-info'
import { getTimeZone } from 'react-native-localize'
import Config from '../../constants/Config'
import { getIdToken } from '../Authentication'
import { addMinutes, isAfter } from 'date-fns'
import { sleep } from '../sleep'

let nextRefresh: undefined | Date = undefined

async function getAuthotization(forceRefresh: boolean) {
	const maxRetries = 2

	// Adding retry logic as a workaround for network errors noticed when app is in background
	for (let i = 1; i <= maxRetries; i++) {
		try {
			return (await getIdToken(forceRefresh)) || ''
		} catch (error) {
			// Exponential backoff
			await sleep(1000 * (2 ^ i))
			if (i === maxRetries) throw error
		}
	}
}

async function buildDefaults(version: string = 'v1'): Promise<AxiosRequestConfig<any>> {
	/**
	 * HACK:  Seeing 401 expired tokens on the API periodically
	 * Seems to be an issue with `getIdToken` reliably returning fresh tokens
	 * Forcing a refresh every 15 minutes (25% of token life) for now
	 */
	const forceRefresh = nextRefresh === undefined || isAfter(new Date(), nextRefresh)
	if (forceRefresh) {
		nextRefresh = addMinutes(new Date(), 15)
	}

	return {
		baseURL: `${Config.baseURL}/${version}`, // ENV Variable
		headers: {
			DeviceId: getUniqueId(),
			Authorization: await getAuthotization(forceRefresh),
			TimeZone: getTimeZone(),
			OperatingSystem: Platform.OS
		}
	}
}

export async function get<T>(url: string, params?: any) {
	const defaults = await buildDefaults()
	const response = await axios.get<T>(url, { ...defaults, params })
	return response?.data
}

export async function put<T>(url: string, data?: any) {
	const defaults = await buildDefaults()
	const response = await axios.put<T>(url, data, { ...defaults })
	return response?.data
}

export async function post<T>(url: string, data?: any) {
	const defaults = await buildDefaults()
	const response = await axios.post<T>(url, data, { ...defaults })
	return response?.data
}

export async function delete_<T>(url: string) {
	const defaults = await buildDefaults()
	const response = await axios.delete<T>(url, { ...defaults })
	return response?.data
}

export async function delete_V2<T>(url: string) {
	const defaults = await buildDefaults('v2')
	const response = await axios.delete<T>(url, { ...defaults })
	return response?.data
}

export async function getV2<T>(url: string, params?: any) {
	const defaults = await buildDefaults('v2')
	const response = await axios.get<T>(url, { ...defaults, params })
	return response?.data
}

export async function putV2<T>(url: string, data?: any) {
	const defaults = await buildDefaults('v2')
	const response = await axios.put<T>(url, data, { ...defaults })
	return response?.data
}

export async function getMetadata() {
	const [deviceManufacturer, fontScale] = await Promise.all([getManufacturer(), getFontScale()])

	return {
		deviceBrand: getBrand(),
		deviceManufacturer,
		fontScale,
		appVersion: getReadableVersion(),
		systemName: getSystemName(),
		systemVersion: getSystemVersion(),
		appState: AppState.currentState,
		modelId: getDeviceId(),
		modelName: getModel(),
		os: Platform.OS
	}
}
