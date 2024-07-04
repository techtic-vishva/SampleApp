import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'
import { QueryClientProvider } from 'react-query'
import { queryClient } from './core/queryClient'
import 'expo-dev-client'
import { LogBox, AppState, Text, TextInput } from 'react-native'
import { useCallback } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { logger as baseLogger, writeLogsToServer } from './core/logger'
import { MEMORY_WARNING_TIMESTAMP, storeString } from './core/Storage'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

// @ts-ignore
if (Text.defaultProps == null) Text.defaultProps = {}
// @ts-ignore
Text.defaultProps.allowFontScaling = false
// @ts-ignore
if (TextInput.defaultProps == null) TextInput.defaultProps = {}
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false

const logger = baseLogger.extend('APP')
AppState.addEventListener('change', (newAppState) => {
	logger.info(`New AppState: ${newAppState}`)
})

AppState.addEventListener('memoryWarning', () => {
	storeString(MEMORY_WARNING_TIMESTAMP, new Date().toISOString())
	logger.error('Memory Warning Received')
	writeLogsToServer(true).catch(() => {})
})

LogBox.ignoreLogs([
	// https://docs.expo.dev/versions/latest/sdk/splash-screen/#animating-the-splash-screen
	// https://github.com/expo/expo/issues/14824
	`'SplashScreen.show' has already been called for given view controller.`,

	// https://stackoverflow.com/a/69649068
	`new NativeEventEmitter`
])

export default function App() {
	// Load Resources Required at Boot
	const isLoadingComplete = useCachedResources()
	let colorScheme = useColorScheme()

	colorScheme = 'dark'

	const onLayoutRootView = useCallback(async () => {
		if (isLoadingComplete) {
			// Show app
			await SplashScreen.hideAsync()
		}
	}, [isLoadingComplete])

	if (!isLoadingComplete) {
		return null
	} else {
		return (
			<SafeAreaProvider onLayout={onLayoutRootView}>
				<ActionSheetProvider>
					<QueryClientProvider client={queryClient}>
						<Navigation colorScheme={colorScheme} />
						<StatusBar />
					</QueryClientProvider>
				</ActionSheetProvider>
			</SafeAreaProvider>
		)
	}
}
