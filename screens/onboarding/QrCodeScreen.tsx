import { HeaderText } from '../../components/StyledText'
import { View, Text } from '../../components/Themed'
import { OnboardingTabScreenProps } from '../../types'
import { StyleSheet, Image, Dimensions } from 'react-native'
import OrangeButton from '../../components/OrangeButton'
import SharedStyles from '../../constants/Styles'

export default function QrCodeScreen({ navigation }: OnboardingTabScreenProps<'QrCode'>) {
	const { width } = Dimensions.get('screen')

	return (
		<View style={styles.container}>
			<View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
				<HeaderText style={{ justifyContent: 'center' }}>Family Invites Sent</HeaderText>
				<Text style={{ fontSize: 20, textAlign: 'center' }}>
					You are now one step closer to intentional time as a family.
				</Text>
			</View>

			<Image
				source={require('../../assets/images/qr_code.png')}
				style={{ width: width * 0.7, height: width * 0.7, marginVertical: 30 }}
				resizeMode="contain"
			/>

			<View style={{ flex: 1, justifyContent: 'center', width: '100%', alignItems: 'center' }}>
				<Text style={{ textAlign: 'center', width: '90%', fontSize: 20 }}>
					Family members can follow the instructions in their email or scan the QR code to join.
				</Text>
			</View>

			<OrangeButton
				onPress={() => {
					navigation.navigate('SurveyPreviewScreen')
				}}
				outterStyle={{ width: '90%', marginBottom: 60 }}
				title="Continue"
				icon="arrow-right"
			/>
			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 100,
		justifyContent: 'space-between',
		width: '100%'
	},
	title: {
		fontSize: 25,
		marginBottom: 10
	}
})
