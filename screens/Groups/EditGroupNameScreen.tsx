import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native'
import OrangeButton from '../../components/OrangeButton'
import { fill } from '../../constants/Colors'
import { update } from '../../core/services/group'
import { GroupTabScreenProps } from '../../types'
import BaseScreen from '../BaseScreen'

export default function EditGroupNameScreen({ navigation, route }: GroupTabScreenProps<'EditGroupName'>) {
	const tag = route.params
	const [groupName, setGroupName] = useState(tag.name)
	const [trimmedGroupName, setTrimmedGroupName] = useState(groupName)

	useEffect(() => {
		setTrimmedGroupName(groupName?.trim() || '')
	}, [groupName])

	async function next() {
		await update(tag.groupId, {
			name: groupName
		})
		navigation.goBack()
	}

	return (
		<BaseScreen>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<TextInput
					onChangeText={setGroupName}
					value={groupName}
					placeholder="Group Name"
					style={styles.input}
					autoFocus={true}
					focusable={true}
				/>
				<OrangeButton disabled={!trimmedGroupName} onPress={next} outterStyle={styles.button} title="Save Group Name" />
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
