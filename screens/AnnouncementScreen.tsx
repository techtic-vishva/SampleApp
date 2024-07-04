import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { StyleSheet } from 'react-native'
import Loading from '../components/Loading'
import OrangeButton from '../components/OrangeButton'
import { HeaderText } from '../components/StyledText'
import { View } from '../components/Themed'
import { chattanoogaTapWater, fill } from '../constants/Colors'
import { trackAnnouncement, useAnnouncements } from '../core/services/announcements'
import goBackOrHome from '../navigation/goBackOrHome'
import { RootStackScreenProps } from '../types'
import Markdown from '@flowchase/react-native-markdown-display'
import * as Linking from 'expo-linking'

export default function AnnouncementScreen({ navigation }: RootStackScreenProps<'Announcement'>) {
	const { data } = useAnnouncements()
	const [hasDismissed, setHasDismissed] = useState(false)

	useEffect(() => {
		return navigation.addListener('beforeRemove', () => {
			if (hasDismissed) return
			trackAnnouncement(announcement.code).catch(() => {})
		})
	}, [navigation, hasDismissed])

	async function onContinuePress() {
		setHasDismissed(true)

		trackAnnouncement(announcement.code).finally(() => {
			if (announcement.url) {
				navigation.pop()
				Linking.openURL(`goaro://${announcement.url}`)
			} else goBackOrHome(navigation)
		})
	}

	if (!Array.isArray(data) || data.length === 0) {
		return <Loading />
	}

	const announcement = data[0]

	return (
		<View style={styles.container}>
			<View
				style={{
					backgroundColor: 'white',
					width: '35%',
					height: 4.5,
					borderRadius: 5,
					opacity: 0.2,
					marginBottom: 20,
					marginTop: 10
				}}
			/>
			<HeaderText style={{ paddingVertical: 15, textAlign: 'center' }}>{announcement.title}</HeaderText>
			<ScrollView style={{ flex: 1 }} contentContainerStyle={[{ width: '100%', flexGrow: 1, paddingBottom: 20 }]}>
				<Markdown
					style={{
						body: { ...styles.paragraph, flexGrow: 1 },
						strong: { fontFamily: 'objektiv-semi-bold', color: chattanoogaTapWater },
						em: { fontFamily: 'objektiv-semi-bold-italic' }
					}}>
					{announcement.body}
				</Markdown>
			</ScrollView>
			<View style={styles.buttonContainer}>
				<OrangeButton
					outterStyle={{ width: '80%', marginBottom: 30 }}
					title={announcement.buttonLabel || 'Continue'}
					onPress={onContinuePress}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: fill
	},
	paragraph: {
		color: 'white',
		fontSize: 16,
		width: '80%',
		textAlign: 'left',
		fontFamily: 'objektiv'
	},
	buttonContainer: {
		backgroundColor: fill,
		marginTop: 'auto',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		marginBottom: 30
	}
})
