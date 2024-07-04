import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Linking, Platform, StyleSheet } from 'react-native'
import OrangeButton from '../components/OrangeButton'
import { HeaderText } from '../components/StyledText'
import { Text, View } from '../components/Themed'
import { dichotomousHippopotamus } from '../constants/Colors'
import { useBluetoothState } from '../hooks/useBluetoothState'
import { State } from '../constants/Bluetooth'

export default function BluetoothRequiredScreen() {
	const bluetoothState = useBluetoothState()

	const unauthorizedMessage = Platform.select({
		ios: 'Please allow Aro to access Bluetooth.',
		android: 'Please enable "nearby devices" permission for Aro.'
	})

	return (
		<View style={[styles.container, {}]}>
			<Feather size={70} style={{ marginTop: 'auto', color: dichotomousHippopotamus }} name={'bluetooth'} />

			<HeaderText style={[styles.title, { marginTop: 40 }]}>Bluetooth Required</HeaderText>
			<Text style={[styles.tagline, {}]}>
				We use Bluetooth to connect to the Aro hardware——so we know when your phone is here and you're present.{'\n\n'}
				{bluetoothState === State.Unauthorized && unauthorizedMessage}
			</Text>
			<View style={styles.buttonContainer}>
				<View style={styles.buttonRowContainer}>
					<OrangeButton
						onPress={() => {
							if (bluetoothState === State.Unauthorized) {
								Linking.openSettings()
							} else if (Platform.OS === 'ios') {
								Linking.openURL('App-Prefs:Bluetooth')
							} else {
								Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS')
							}
						}}
						outterStyle={styles.buttonStyleBase}
						title="Enable Bluetooth to Continue"
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
