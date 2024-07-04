import React, { useEffect, useState } from 'react'
import * as Contacts from 'expo-contacts'
import { useIsFocused } from '@react-navigation/native'
import { Text, View } from './Themed'
import { HeaderText } from './StyledText'
import OrangeButton from './OrangeButton'
import { ScrollView, Linking, TouchableOpacity, StyleSheet } from 'react-native'
import { chattanoogaTapWater, fill } from '../constants/Colors'
import Loading from './Loading'

function ContactsComponent({ onShare }: { onShare: (phoneNumber?: string | undefined) => void }) {
	const [contacts, setContacts] = useState<Contacts.Contact[]>()
	const [status, setStatus] = useState<Contacts.PermissionStatus>(Contacts.PermissionStatus.UNDETERMINED)
	const isFocused = useIsFocused()

	async function loadContacts() {
		const { status } = await Contacts.requestPermissionsAsync()
		setStatus(status)

		if (status !== Contacts.PermissionStatus.GRANTED) return

		const { data } = await Contacts.getContactsAsync({
			fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails]
		})

		if (data.length > 0) {
			// Filter to contacts with phone numbers, sorted by name
			setContacts(
				data.filter((d) => d.phoneNumbers && d.phoneNumbers.length > 0).sort((a, b) => a.name.localeCompare(b.name))
			)
		}
	}

	// Bootstrap Contacts
	useEffect(() => {
		loadContacts()
	}, [])

	// Reload Contacts
	useEffect(() => {
		if (!isFocused) return
		loadContacts()
	}, [isFocused])

	const onContactPress = async (item: Contacts.Contact) => {
		if (item.phoneNumbers && item.phoneNumbers?.length > 0) {
			onShare(item.phoneNumbers[0].number)
		}
	}

	if (status === Contacts.PermissionStatus.DENIED)
		return (
			<View style={styles.container}>
				<HeaderText style={{ textAlign: 'center', width: '80%', marginBottom: 60 }}>
					You must allow access to your contacts to use this feature.
				</HeaderText>
				<OrangeButton
					outterStyle={{ width: '80%' }}
					title="Open App Settings"
					onPress={Linking.openSettings}
					icon="settings"
				/>
			</View>
		)

	if (status === Contacts.PermissionStatus.UNDETERMINED || !contacts || contacts.length === 0) return <Loading />

	return (
		<View style={[styles.container, { paddingTop: 120 }]}>
			{contacts && contacts.length > 0 && (
				<ScrollView style={{ width: '90%' }}>
					{contacts.map((result, i) => (
						<TouchableOpacity
							onPress={() => onContactPress(result)}
							key={i}
							style={{
								backgroundColor: fill,
								padding: 14,
								borderRadius: 10,
								marginVertical: 5,
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center'
							}}>
							<Text numberOfLines={1} style={{ flex: 1, paddingRight: 20, paddingLeft: 10 }}>
								{result.name}
							</Text>
							<Text style={{ color: chattanoogaTapWater }}>Invite</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	}
})

export default ContactsComponent
