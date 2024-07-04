jest.mock('@react-native-async-storage/async-storage', () => ({
	setItem: jest.fn(() => Promise.resolve()),
	getItem: jest.fn(() => Promise.resolve())
}))
jest.mock('@react-native-firebase/crashlytics', () => ({
	log: jest.fn(),
	recordError: jest.fn(),
	setUserId: jest.fn().mockReturnValue('123')
}))

jest.mock('@expo/vector-icons', () => {
	const { View, NativeEventEmitter } = require('react-native')
	return {
		Feather: View,
		Ionicons: View
	}
})
jest.mock('react-native-device-info', () => {
	return {
		getVersion: () => 4
	}
})

jest.mock('react-native-localize', () => {
	getTimeZone: jest.fn()
})

jest.mock('firebase/auth/react-native', () => ({
	auth: {
		GoogleAuthProvider: {
			credential: jest.fn().mockReturnValue('123')
		}
	}
}))

global.__reanimatedWorkletInit = () => {}
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
