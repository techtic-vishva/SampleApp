import { Platform, StyleSheet } from 'react-native'
import { HeaderText } from '../../components/StyledText'
import { View, Text } from '../../components/Themed'
import { OnboardingTabScreenProps } from '../../types'
import SharedStyles from '../../constants/Styles'
import { Feather } from '@expo/vector-icons'
import { init as initLocation } from '../../core/AroLocation'
import { init as initBluetooth } from '../../core/connectivity/AroBluetooth'
import { dichotomousHippopotamus } from '../../constants/Colors'
import * as Notifications from 'expo-notifications'
import SteppedNavigationFooter from '../../components/SteppedNavigationFooter'
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated'
import { setIsOnboarded } from '../../core/GlobalState'
import { update, useUser } from '../../core/services/user'

enum Permissions {
	Notifications = 1,
	Location,
	Bluetooth
}

type permission = {
	id: Permissions
	title: string
	description: string
	icon?: React.ComponentProps<typeof Feather>['name']
	optional?: boolean
	action?: Function
}

const permissions: permission[] = [
	{
		id: Permissions.Notifications,
		title: 'Notifications',
		description: "We'll use notifications to help you build a practice of presence.",
		icon: 'bell',
		optional: true,
		action: Notifications.requestPermissionsAsync
	},
	{
		id: Permissions.Location,
		title: 'Location (Required)',
		description: `We use Location to accurately connect to the Aro hardware${
			Platform.OS === 'android'
				? ' even when the app is closed or not in use.\n\nWhen prompted, please set location permission to "Allow all the time."'
				: '.'
		}  We do not store or share location data, and will never track you.`,
		icon: 'map-pin',
		action: initLocation
	},
	{
		id: Permissions.Bluetooth,
		title: 'Bluetooth (Required)',
		description:
			"We use Bluetooth to connect to the Aro hardware——so we know when your phone is here and you're present.",
		icon: 'bluetooth',
		action: initBluetooth
	}
]

export default function PermissionsScreen({ route, navigation }: OnboardingTabScreenProps<'Permissions'>) {
	const step = route.params?.step || Permissions.Notifications
	const { data } = useUser()

	const permission = permissions.find((p) => p.id === step) ?? permissions[0]

	function advance() {
		if (step + 1 in Permissions) {
			navigation.push('Permissions', { step: step + 1 })
		} else {
			// START TMP: Skip Onboarding Video
			if (data?.userRole === 'Owner') {
				navigation.navigate('OnboardReferFriend')
			} else {
				update({ metadata: { hasOnboarded: true } }).then(() => setIsOnboarded(true, true))
			}
			// END TMP

			// Navigate to Video
			// navigation.navigate('YouTubePlayer')
		}
	}

	async function next() {
		// Init Permission
		if (permission.action) {
			await permission.action()
		}

		// Next Step
		advance()
	}

	return (
		<Animated.View key={step} entering={SlideInRight} exiting={SlideOutLeft} style={styles.container}>
			{permission.icon && (
				<Feather size={70} style={{ marginTop: 'auto', color: dichotomousHippopotamus }} name={permission.icon} />
			)}
			<HeaderText style={[styles.title, permission.icon ? { marginTop: 40 } : {}]}>{permission.title}</HeaderText>
			<Text style={styles.tagline}>{permission.description}</Text>

			<View style={{ marginTop: 'auto' }}>
				<SteppedNavigationFooter
					totalSteps={permissions.length}
					activeStep={step}
					onContinue={next}
					onSkip={permission.optional ? advance : undefined}
				/>
			</View>

			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	tagline: {
		fontSize: 16,
		width: '80%',
		textAlign: 'center'
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%'
	},
	title: {
		fontSize: 25,
		marginBottom: 10
	}
})
