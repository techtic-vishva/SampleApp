import { StyleSheet, TextInput, Platform } from 'react-native'
import { HeaderText } from '../../components/StyledText'
import { View, KeyboardAvoidingView } from '../../components/Themed'
import { OnboardingTabScreenProps } from '../../types'
import OrangeButton from '../../components/OrangeButton'
import React, { useEffect, useState } from 'react'
import { chattanoogaTapWater, fill } from '../../constants/Colors'
import { useUser } from '../../core/services/user'
import { update } from '../../core/services/group'
import Loading from '../../components/Loading'
import AroTip from '../../components/AroTip'
import SharedStyles from '../../constants/Styles'

export default function NameHouseholdScreen({ navigation }: OnboardingTabScreenProps<'NameHousehold'>) {
	const [name, setName] = useState('')
	const { data: user, isLoading } = useUser()
	const [trimmedName, setTrimmedName] = useState('')

	useEffect(() => {
		setTrimmedName(name?.trim() ?? '')
	}, [name])

	async function next() {
		if (!user) return

		await update(user.householdGroupId, {
			name: name
		})

		navigation.navigate('HouseholdAvatar')
	}

	if (!user || isLoading) {
		return <Loading />
	}

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<View style={styles.container}>
				<HeaderText style={styles.title}>What would you like to name your household?</HeaderText>
				<TextInput
					onChangeText={setName}
					value={name}
					placeholder="Enter Name (e.g. Smith Family)"
					style={styles.input}
					autoFocus={true}
					focusable={true}
					placeholderTextColor={chattanoogaTapWater}
				/>

				<AroTip message="Household name will be used to personalize your Aro experience." />
			</View>
			<OrangeButton
				disabled={!trimmedName}
				onPress={next}
				outterStyle={styles.button}
				icon="arrow-right"
				title="Continue"
			/>
			<View style={[SharedStyles.glowTop, { alignSelf: 'center' }]} />
			<View style={[SharedStyles.glowBottom, { alignSelf: 'center' }]} />
		</KeyboardAvoidingView>
	)
}

const width = '85%'

const styles = StyleSheet.create({
	input: {
		width,
		backgroundColor: fill,
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		color: 'white',
		marginTop: 30
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 100
	},
	title: {
		width,
		fontSize: 25,
		textAlign: 'center'
	},
	button: {
		marginBottom: 30,
		marginTop: 30,
		width,
		marginLeft: 'auto',
		marginRight: 'auto'
	}
})
