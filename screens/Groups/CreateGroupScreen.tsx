import { StyleSheet, TextInput, Platform, Share } from 'react-native'
import { View, KeyboardAvoidingView, Text } from '../../components/Themed'
import { GroupTabScreenProps } from '../../types'
import SharedStyles from '../../constants/Styles'
import OrangeButton from '../../components/OrangeButton'
import React, { useEffect, useState } from 'react'
import { fill } from '../../constants/Colors'
import { create } from '../../core/services/group'
import { HeaderText } from '../../components/StyledText'
import { mark } from '../../core/services/achievement'

export default function CreateGroupScreen({ navigation, route }: GroupTabScreenProps<'GroupRoot'>) {
	const placeholder = route.params?.placeholder ?? 'Smith Family'
	const [name, setName] = useState('')
	const [trimmedName, setTrimmedName] = useState(name)

	useEffect(() => {
		setTrimmedName(name?.trim() ?? '')
	}, [name])

	async function next() {
		const group = await create({ name: trimmedName })
		await mark('create-group')
		navigation.replace('GroupSummary', { groupId: group.id, invite: true })
	}

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<View style={[styles.container, { width: '100%', marginTop: '25%' }]}>
				<HeaderText style={styles.title}>Create a New Group</HeaderText>
				<Text style={styles.tagline}>Enter a name for your household or group and invite others to join.</Text>
			</View>
			<TextInput
				onChangeText={setName}
				value={name}
				placeholder={`ex. ${placeholder}`}
				style={styles.input}
				autoFocus={true}
				focusable={true}></TextInput>
			<OrangeButton disabled={!trimmedName} onPress={next} outterStyle={styles.button} title="Create Group" />
			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</KeyboardAvoidingView>
	)
}

const width = '90%'

const styles = StyleSheet.create({
	input: {
		width,
		backgroundColor: fill,
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		color: 'white',
		marginBottom: 20
	},
	inputGroup: {
		marginTop: 'auto',
		width
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 25,
		marginBottom: 10
	},
	button: {
		marginTop: 'auto',
		marginBottom: 50,
		width
	},
	tagline: {
		fontSize: 18,
		fontWeight: '200',
		width: '75%',
		textAlign: 'center'
	}
})
