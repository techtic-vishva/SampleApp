import { Feather } from '@expo/vector-icons'
import React, { useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native'
import OrangeButton from '../components/OrangeButton'
import { HeaderText } from '../components/StyledText'
import { Text, View } from '../components/Themed'
import { chattanoogaTapWater, fill } from '../constants/Colors'
import { GlobalState, incrementConnectivityTipCount, setNeverShowConnectivityTip } from '../core/GlobalState'
import goBackOrHome from '../navigation/goBackOrHome'
import { RootStackScreenProps } from '../types'

const titles = ['Get Credit for Intentional Time', 'Never Miss a Session', 'Connectivity Tip', 'Did You Know?']
const messages = [
	'To get the most out of Aro, you should leave the app running to ensure seamless communication between the app and the Aro Home device. Swiping up to close the app will result in missed sessions until you reopen it.',
	'For the best experience, keep the Aro app running to ensure automatic Bluetooth connection with your Aro Home device.  Killing the app will result in missed sessions.',
	'The Aro app must be running in the background to automatically connect to the Aro Home device.  The process of swiping up to close the app will result in missed sessions until you reopen it.',
	'Aro can automatically start sessions if the app is running in the background.  The process of swiping up to close the app will result in missed sessions until you reopen it.',
	'Keep the Aro app open in the background in order to ensure a successful connection with the Aro Home device.  Closing the app fully will result in missed sessions.'
]

const getRandonItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

export default function ConnectivityTipScreen({ navigation }: RootStackScreenProps<'ConnectivityTip'>) {
	const title = useRef(getRandonItem(titles))
	const message = useRef(getRandonItem(messages))
	const [checked, setChecked] = useState(false)

	async function onContinuePress() {
		await setNeverShowConnectivityTip(checked)
		await incrementConnectivityTipCount()
		goBackOrHome(navigation)
	}

	return (
		<View style={styles.container}>
			<View style={[styles.container, { width: '100%', flex: 1 }]}>
				<HeaderText
					numberOfLines={1}
					adjustsFontSizeToFit
					style={{ paddingBottom: 30, color: chattanoogaTapWater, fontSize: 30, marginHorizontal: 30 }}>
					{title.current}
				</HeaderText>
				<Text style={styles.paragraph}>{message.current}</Text>
			</View>

			<View style={styles.buttonContainer}>
				{GlobalState.connectivityTipCount > 3 && (
					<TouchableOpacity
						onPress={() => {
							setChecked(!checked)
						}}
						style={styles.checkContainer}>
						<Feather size={22} name={checked ? 'check-circle' : 'circle'} color={chattanoogaTapWater} />
						<Text style={styles.checkTxt}>Don't show this message anymore</Text>
					</TouchableOpacity>
				)}
				<OrangeButton outterStyle={{ width: '80%', marginBottom: 30 }} title="Got it!" onPress={onContinuePress} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: fill
	},
	paragraph: {
		fontSize: 22,
		width: '84%',
		textAlign: 'center'
	},
	buttonContainer: {
		backgroundColor: fill,
		marginTop: 'auto',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		marginBottom: 30
	},
	checkContainer: {
		width: '80%',
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 15,
		marginHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	checkTxt: {
		color: chattanoogaTapWater,
		fontSize: 15,
		marginStart: 10
	}
})
