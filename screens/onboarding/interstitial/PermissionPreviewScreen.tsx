import { HeaderText } from '../../../components/StyledText'
import { View, Text } from '../../../components/Themed'
import { OnboardingTabScreenProps } from '../../../types'
import { StyleSheet, Image, Dimensions } from 'react-native'
import OrangeButton from '../../../components/OrangeButton'
import SharedStyles from '../../../constants/Styles'

export default function PermissionsPreviewScreen({ navigation }: OnboardingTabScreenProps<'PermissionsPreview'>) {
	const { width } = Dimensions.get('screen')

	return (
		<View style={styles.container}>
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<HeaderText style={{ justifyContent: 'center' }}>You're Amazing!</HeaderText>
			</View>
			<Image
				source={{
					uri: 'https://uploads-ssl.webflow.com/627002f574f43f3a6c7849f8/63334d65f95c495aab67d6fb_Aro_smart_box_phone_app.png'
				}}
				style={{ width: width * 0.9, height: width * 0.9 }}
				resizeMode="contain"
			/>
			<View style={{ flex: 3, justifyContent: 'center', width: '100%', alignItems: 'center' }}>
				<Text style={{ textAlign: 'center', width: '90%', fontSize: 20 }}>
					Aro requires a few permissions to automatically connect to the home device. Let's set those up.
				</Text>
			</View>

			<OrangeButton
				onPress={() => navigation.navigate('Permissions', { step: undefined })}
				outterStyle={{ width: '90%', marginBottom: 40 }}
				title="Get Started"
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
		paddingTop: 70,
		justifyContent: 'space-between',
		width: '100%'
	},
	title: {
		fontSize: 25,
		marginBottom: 10
	}
})
