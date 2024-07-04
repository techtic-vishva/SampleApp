import { Platform } from 'react-native'
import BackgroundTimer from 'react-native-background-timer'

export async function sleep(ms: number) {
	return new Promise((resolve) => {
		if (Platform.OS === 'ios') {
			setTimeout(resolve, ms)
		} else {
			// when in background, android executes the callback of the react native setTimeout function only when the app resumes
			BackgroundTimer.setTimeout(resolve, ms)
		}
	})
}
