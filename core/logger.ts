import { logger as _logger, consoleTransport, fileAsyncTransport, transportFunctionType } from 'react-native-logs'
import * as FileSystem from 'expo-file-system'
import { post, getMetadata } from '../core/services/http'
import { AppState } from 'react-native'

AppState.addEventListener('change', (newState) => {
	if (newState === 'active' || newState === 'background') writeLogsToServer(true)
})

let interval: NodeJS.Timer[] | undefined
function startInterval() {
	if (interval) return
	const Hour = 3600000
	interval = []

	// File system flush
	interval.push(
		setInterval(async () => {
			try {
				await clearFileSystemLogs().catch(() => {})
			} catch (err) {}
		}, Hour * 3)
	)
}

let cache: string[] = []
let threshold = 50
let lock = false

const serverTransport: transportFunctionType = async (props) => {
	cache.push(props.msg)

	if (cache.length >= threshold && AppState.currentState === 'active') {
		writeLogsToServer()
	}

	return true
}

export const writeLogsToServer = async (force = false) => {
	if (!cache || cache.length === 0) return
	if (lock) return
	else lock = true

	try {
		if (force || (cache && cache.length >= threshold)) {
			await post('/log/device', {
				logs: cache,
				metadata: await getMetadata()
			})

			cache = []
		}
	} catch (err) {
	} finally {
		cache = cache.slice(-50) // Memory Mgmt
		lock = false
	}
}

const dynamicTransport: transportFunctionType = async (props) => {
	if (!interval) {
		await startInterval()
	}

	// Console Output on Dev
	if (__DEV__) {
		consoleTransport(props)
	}

	// Always Write to File & Server
	fileAsyncTransport(props)
	serverTransport(props)
}

let today = new Date()
let date = today.getDate()
let month = today.getMonth() + 1
let year = today.getFullYear()

const config = {
	levels: {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3
	},
	dateFormat: 'iso',
	transport: dynamicTransport,
	transportOptions: {
		colors: {
			info: 'blueBright',
			warn: 'yellowBright',
			error: 'redBright'
		},
		extensionColors: {
			root: 'magenta',
			home: 'green'
		},
		FS: FileSystem,
		// fileName: `logs_${date}-${month}-${year}`, // Create a new file every day
		fileName: `logs`
	}
}

const logger = _logger.createLogger(config)
const readFileSystemLogs = async () => {
	return FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'logs', { encoding: 'utf8' })
}

const clearFileSystemLogs = async () => {
	return FileSystem.deleteAsync(FileSystem.documentDirectory + 'logs')
}

export { logger, readFileSystemLogs, clearFileSystemLogs }
