import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { chattanoogaTapWater, dichotomousHippopotamus } from '../constants/Colors'
import OrangeButton from './OrangeButton'
import { HeaderText } from './StyledText'
import { Text, View } from './Themed'
import WhiteButton from './WhiteButton'

function ReferFriend({
	onInviteContact,
	onShare,
	showSkip,
	onSkip
}: {
	onInviteContact: () => void
	onShare: () => void
	showSkip?: boolean
	onSkip?: () => void
}) {
	return (
		<View style={styles.container}>
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					backgroundColor: 'transparent'
				}}>
				<HeaderText numberOfLines={1} adjustsFontSizeToFit style={{ fontSize: 28 }}>
					Refer a Friend
				</HeaderText>
				<Text
					numberOfLines={7}
					adjustsFontSizeToFit
					style={{
						marginTop: 30,
						marginBottom: 30,
						width: '80%',
						color: chattanoogaTapWater,
						fontSize: 20,
						textAlign: 'center'
					}}>
					Help others prioritize family time by referring them to Aro.{'\n\n'}
					They will receive a discount to get started and you will earn a one month credit per referral.
				</Text>
				<WhiteButton
					outterStyle={styles.button}
					title="Invite Your Contacts"
					onPress={onInviteContact}
					icon="message-square"
					iconColorOverride={dichotomousHippopotamus}
				/>
				<WhiteButton
					outterStyle={styles.button}
					title="Share My Referral Link"
					onPress={onShare}
					icon="link"
					iconColorOverride={dichotomousHippopotamus}
				/>
			</View>

			{showSkip && (
				<OrangeButton
					outterStyle={{ width: '80%', marginTop: 'auto', marginBottom: 95 }}
					title="Continue"
					onPress={onSkip}
					icon="arrow-right"
				/>
			)}

			<Image
				style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.25 }}
				source={{ uri: 'https://storage.googleapis.com/aro-public/assets/photos/login-background-02.jpeg' }}
			/>
		</View>
	)
}
const styles = StyleSheet.create({
	button: {
		width: '80%',
		marginTop: 30
	},
	container: {
		flex: 1,
		alignItems: 'center'
	}
})
export default ReferFriend
