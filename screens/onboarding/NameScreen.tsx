import { StyleSheet, TextInput, Platform } from 'react-native'
import { HeaderText } from '../../components/StyledText'
import { View, KeyboardAvoidingView } from '../../components/Themed'
import { OnboardingTabScreenProps } from '../../types'
import SharedStyles from '../../constants/Styles'
import OrangeButton from '../../components/OrangeButton'
import React, { useEffect, useState } from 'react'
import { fill } from '../../constants/Colors'
import { getUser, updateUserAccount } from '../../core/Authentication'
import { update, useUser } from '../../core/services/user'
import Loading from '../../components/Loading'

export default function NameScreen({ navigation }: OnboardingTabScreenProps<'Name'>) {
	const [name, setName] = useState('')
	const [trimmedName, setTrimmedName] = useState('')
	const { data: user, isLoading } = useUser()

	useEffect(() => {
		setTrimmedName(name?.trim() ?? '')
	}, [name])

	// Redirect if already provided
	useEffect(() => {
		const user = getUser()
		if (user?.displayName) {
			setName(user.displayName)
		}
	}, [])

	async function next() {
		await updateUserAccount(trimmedName)
		await update({ fullName: trimmedName })
		navigation.navigate('AvatarScreen')
	}

	if (!user || isLoading) {
		return <Loading />
	}

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<View style={{ ...styles.container, width: '100%' }}>
				<HeaderText style={styles.title}>What's your name?</HeaderText>
				<TextInput
					onChangeText={setName}
					value={name}
					placeholder="Full Name"
					style={styles.input}
					autoFocus={true}
					focusable={true}></TextInput>
			</View>

			<OrangeButton
				disabled={!trimmedName}
				onPress={next}
				outterStyle={styles.button}
				icon="arrow-right"
				title="Continue"
			/>

			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</KeyboardAvoidingView>
	)
}

const width = '90%'

const styles = StyleSheet.create({
	input: {
		width: width,
		backgroundColor: fill,
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		color: 'white',
		marginBottom: 30
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		display: 'flex'
	},
	title: {
		fontSize: 25,
		marginBottom: 60
	},
	button: {
		marginTop: 'auto',
		marginBottom: 30,
		width
	}
})
