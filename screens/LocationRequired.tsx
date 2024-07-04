import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Linking, Platform, StyleSheet } from 'react-native'
import OrangeButton from '../components/OrangeButton'
import { HeaderText } from '../components/StyledText'
import { Text, View } from '../components/Themed'
import { dichotomousHippopotamus } from '../constants/Colors'
import { emitLocationPermissionStatus } from '../core/EventBroker'
import * as Location from 'expo-location'

export default function LocationRequiredScreen() {
	const [foregroundLocation, requestForegroundLocation, getForegroundLocation] = Location.useForegroundPermissions()
	const [backgroundLocation, requestBackgroundLocation, getBackgroundLocation] = Location.useBackgroundPermissions()

	const canAskAgain = foregroundLocation?.granted ? backgroundLocation?.canAskAgain : foregroundLocation?.canAskAgain

	const instructions = Platform.select({
		ios: canAskAgain
			? 'When prompted, please set location permission to "Allow all the time"'
			: 'Tap "Enable Location to Continue"\nNavigate to "Location"\nSelect "Always"',
		android: canAskAgain
			? 'When prompted, please set location permission to "Allow all the time"'
			: 'Tap "Enable Location to Continue"\nFind "Location" permision\nSelect "Allow all the time"'
	})

	return (
		<View style={[styles.container, {}]}>
			<Feather size={70} style={{ marginTop: 'auto', color: dichotomousHippopotamus }} name={'map-pin'} />

			<HeaderText style={[styles.title, { marginTop: 40 }]}>Location Required</HeaderText>
			<Text style={[styles.tagline, {}]}>
				We use Location to connect to the Aro hardware even when the app is closed or not in use——so we know when your
				phone is here and you're present.{'\n\n'}
				{instructions}
			</Text>
			<View style={styles.buttonContainer}>
				<View style={styles.buttonRowContainer}>
					<OrangeButton
						onPress={async () => {
							let openSettings: boolean = false

							if (!foregroundLocation?.granted) {
								if (foregroundLocation?.canAskAgain) {
									await requestForegroundLocation()
								} else {
									openSettings = true
								}
							}

							if (!backgroundLocation?.granted) {
								if (backgroundLocation?.canAskAgain) {
									await requestBackgroundLocation()
								} else {
									openSettings = true
								}
							}

							if (openSettings) {
								await Linking.openSettings()
							}

							const { granted: foregroundGranted } = await getForegroundLocation()
							const { granted: backgroundGranted } = await getBackgroundLocation()

							emitLocationPermissionStatus(foregroundGranted, backgroundGranted)
						}}
						outterStyle={styles.buttonStyleBase}
						title="Enable Location to Continue"
					/>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	tagline: {
		fontSize: 16,
		width: '80%',
		textAlign: 'center'
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonStyleBase: {
		marginHorizontal: 20,
		marginBottom: 60,
		flex: 1
	},
	buttonContainer: {
		marginTop: 'auto',
		width: '100%',
		display: 'flex',
		alignItems: 'center'
	},
	buttonRowContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 30
	},
	title: {
		fontSize: 25,
		marginBottom: 10,
		marginTop: 'auto'
	}
})
