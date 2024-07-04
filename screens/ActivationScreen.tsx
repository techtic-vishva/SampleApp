import { StyleSheet, TextInput, Platform, TouchableOpacity } from 'react-native'
import { HeaderText } from '../components/StyledText'
import { View, KeyboardAvoidingView, Text } from '../components/Themed'
import SharedStyles from '../constants/Styles'
import OrangeButton from '../components/OrangeButton'
import React, { useEffect, useState } from 'react'
import { chattanoogaTapWater, fill, vitaminCBathwater } from '../constants/Colors'
import { isActive, signOut } from '../core/Authentication'
import { ActivationTabScreenProps } from '../types'
import { activate, autoActivate } from '../core/services/user'
import Loading from '../components/Loading'
import { GlobalState } from '../core/GlobalState'
import * as Linking from 'expo-linking'
import { useAppState } from '../hooks/useAppState'

export default function ActivationScreen({ navigation }: ActivationTabScreenProps<'Activation'>) {
	const [error, setError] = useState(false)
	const [code, setCode] = useState(GlobalState.activationCode || '')
	const [trimmedCode, setTrimmedCode] = useState('')
	const [isContinueDisabled, setIsContinueDisabled] = useState(false)
	const [hasAttemptedAutoActivation, setHasAttemptedAutoActivation] = useState(!!code)
	const appState = useAppState()

	function tryAutoActivation() {
		return autoActivate().then((result) => {
			if (result.success) {
				return isActive(true)
			}
		})
	}

	// Auto-activate
	useEffect(() => {
		if (hasAttemptedAutoActivation) return

		tryAutoActivation().finally(() => {
			setHasAttemptedAutoActivation(true)
		})
	}, [])

	useEffect(() => {
		setTrimmedCode(code?.trim() ?? '')
	}, [code])

	useEffect(() => {
		// Refresh activation state on app open;  ensure invites are captured
		if (appState === 'active' && hasAttemptedAutoActivation) {
			tryAutoActivation().catch(() => {})
		}
	}, [appState])

	async function next() {
		if (isContinueDisabled) return
		setIsContinueDisabled(true)
		try {
			const result = await activate(trimmedCode)
			if (result.success) {
				// Refresh state
				await isActive(true)
			} else {
				// Try again
				setError(true)
			}
		} finally {
			setIsContinueDisabled(false)
		}
	}

	if (!hasAttemptedAutoActivation) {
		return <Loading />
	}

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<View style={[{ width: '90%', marginTop: 100, alignItems: 'center' }]}>
				<HeaderText style={styles.title}>Activate your account.</HeaderText>
				<Text style={styles.tagline}>Enter your activation code or request an invitation from a family member.</Text>
			</View>
			<View style={styles.inputGroup}>
				<Text style={{ textAlign: 'center', color: chattanoogaTapWater, paddingBottom: 5 }}>
					Activation codes are case-sensitive.
				</Text>
				<TextInput
					onChangeText={setCode}
					value={code}
					placeholder="a3Z-Q4d"
					style={styles.input}
					autoFocus={true}
					focusable={true}
					autoCapitalize={'none'}></TextInput>
				<Text style={styles.error}>{error ? 'Activation code invalid, please try again.' : ''}</Text>
			</View>

			<OrangeButton
				disabled={!trimmedCode || isContinueDisabled}
				onPress={next}
				outterStyle={styles.button}
				icon="arrow-right"
				title="Continue"
			/>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '88%',
					justifyContent: 'space-between',
					marginBottom: 30
				}}>
				<TouchableOpacity
					onPress={() => {
						Linking.openURL('https://support.goaro.com/hc/en-us/articles/5312385239956-Frequently-Asked-Questions')
					}}>
					<Text
						style={{
							textDecorationLine: 'underline',
							color: chattanoogaTapWater,
							fontSize: 12
						}}>
						Where's my Activation Code?
					</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={signOut}>
					<Text style={{ textDecorationLine: 'underline', color: chattanoogaTapWater, fontSize: 12 }}>Logout</Text>
				</TouchableOpacity>
			</View>
			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</KeyboardAvoidingView>
	)
}

const width = '90%'

const styles = StyleSheet.create({
	input: {
		backgroundColor: fill,
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		color: 'white',
		textAlign: 'center',
		fontFamily: 'objektiv-semi-bold'
	},
	inputGroup: {
		width,
		justifyContent: 'center',
		flex: 1
	},
	error: {
		textAlign: 'center',
		color: vitaminCBathwater,
		height: 25 // Prevent-layout shift when text is added
	},
	container: {
		width: '100%',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 25,
		marginBottom: 10
	},
	button: {
		marginBottom: 10,
		width
	},
	tagline: {
		fontSize: 18,
		fontWeight: '200',
		textAlign: 'center',
		marginBottom: 10
	}
})
