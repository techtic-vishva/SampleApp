import { KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native'
import { SettingsTabScreenProps } from '../../types'
import React, { useEffect, useState } from 'react'
import { updateTag } from '../../core/services/session'
import { fill } from '../../constants/Colors'
import OrangeButton from '../../components/OrangeButton'
import BaseScreen from '../BaseScreen'

export default function EditTagScreen({ navigation, route }: SettingsTabScreenProps<'EditTag'>) {
	const tag = route.params
	const [tagName, setTagName] = useState(tag.name)
	const [trimmedTagName, setTrimmedTagName] = useState(tagName)

	useEffect(() => {
		setTrimmedTagName(tagName?.trim() || '')
	}, [tagName])

	async function next() {
		await updateTag(Object.assign({}, tag, { name: tagName }))
		navigation.goBack()
	}

	return (
		<BaseScreen>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<TextInput
					onChangeText={setTagName}
					value={tagName}
					placeholder="Tag Name"
					style={styles.input}
					autoFocus={true}
					focusable={true}></TextInput>
				<OrangeButton disabled={!trimmedTagName} onPress={next} outterStyle={styles.button} title="Save Custom Tag" />
			</KeyboardAvoidingView>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 125
	},
	input: {
		marginTop: 'auto',
		width: '90%',
		backgroundColor: fill,
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		color: 'white'
	},
	button: {
		marginTop: 'auto',
		marginBottom: 50,
		width: '90%'
	}
})
