import { SettingsTabScreenProps } from '../../types'
import React, { useEffect, useState } from 'react'
import { update, useUser } from '../../core/services/user'
import OrangeButton from '../../components/OrangeButton'
import { View, Text } from '../../components/Themed'
import { Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { chattanoogaTapWater, fill } from '../../constants/Colors'
import Loading from '../../components/Loading'
import UserAvatar from '../../components/UserAvatar'
import { updateUserAccount } from '../../core/Authentication'
import BaseScreen from '../BaseScreen'
import { Feather } from '@expo/vector-icons'
import { MenuView } from '@react-native-menu/menu'
import { usePhotoUpload } from '../../components/usePhotoUpload'

export default function AccountInfoScreen({ navigation }: SettingsTabScreenProps<'AccountInfo'>) {
	const { data: user, isLoading, isFetching, refetch } = useUser()
	const [name, setName] = useState(user?.fullname || '')
	const [trimmedName, setTrimmedName] = useState(name)
	const triggerPhotoUpload = usePhotoUpload(refetch)

	useEffect(() => {
		setTrimmedName(name?.trim() ?? '')
	}, [name])

	useEffect(() => {
		setName(user?.fullname || '')
	}, [isFetching])

	async function next() {
		await updateUserAccount(trimmedName)
		await update({ fullName: trimmedName })
		navigation.goBack()
	}

	if (!user || isLoading) {
		return <Loading />
	}

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<BaseScreen>
				<View style={styles.container}>
					<ScrollView contentContainerStyle={{ width: '100%', alignItems: 'center', paddingTop: 125 }}>
						<MenuView
							onPressAction={async ({ nativeEvent }) => {
								if (nativeEvent.event === 'select' || nativeEvent.event === 'camera') {
									triggerPhotoUpload(nativeEvent.event)
								}
							}}
							actions={[
								{
									id: 'select',
									title: 'Select From Library',
									image: 'photo.on.rectangle'
								},
								{
									id: 'camera',
									title: 'Use Camera',
									image: 'camera'
								}
							]}
							shouldOpenOnLongPress={false}>
							<View style={{ alignItems: 'center', padding: 7 }}>
								<Feather
									name="edit"
									color={chattanoogaTapWater}
									size={16}
									style={{ position: 'absolute', top: 0, right: 0 }}
								/>
								<UserAvatar user={user} />
							</View>
						</MenuView>

						<Text style={[styles.label, { marginTop: 60 }]}>Full Name</Text>
						<TextInput
							onChangeText={setName}
							value={name}
							placeholder="Full Name"
							style={styles.input}
							autoFocus={true}
							focusable={true}></TextInput>

						<Text style={[styles.label, styles.disabled]}>Email</Text>
						<TextInput
							value={user.email}
							style={[styles.input, styles.disabled]}
							focusable={false}
							editable={false}></TextInput>
					</ScrollView>
					<OrangeButton disabled={!trimmedName} onPress={next} outterStyle={styles.button} title="Save Changes" />
				</View>
			</BaseScreen>
		</KeyboardAvoidingView>
	)
}

const width = '90%'

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	label: {
		width,
		marginBottom: 10,
		marginLeft: 25
	},
	input: {
		width,
		backgroundColor: fill,
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		color: 'white',
		marginBottom: 30
	},
	disabled: {
		color: 'grey'
	},
	button: {
		marginTop: 'auto',
		marginBottom: 10,
		width,
		alignSelf: 'center'
	}
})
