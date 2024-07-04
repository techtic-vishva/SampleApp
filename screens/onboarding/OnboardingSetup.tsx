import { useEffect } from 'react'
import { StyleSheet, Image } from 'react-native'
import { setIsOnboarded } from '../../core/GlobalState'
import { getAppUser } from '../../core/services/user'
import { OnboardingTabScreenProps } from '../../types'
import Loading from '../../components/Loading'
import { View } from '../../components/Themed'
import { HouseholdSetupScreenBackgroundImages } from './interstitial/HouseholdSetupScreen'
import { SurveyPreviewScreenBackgroundImages } from './interstitial/SurveyPreviewScreen'

async function prefretchOnboardingImages() {
	try {
		await Promise.all([
			...HouseholdSetupScreenBackgroundImages.map(Image.prefetch),
			...SurveyPreviewScreenBackgroundImages.map(Image.prefetch)
		])
	} catch (_) {
		// Prefetch failed, ignore
	}
}

export default function OnboardingSetup({ navigation }: OnboardingTabScreenProps<'OnboardingSetup'>) {
	useEffect(() => {
		async function setup() {
			const imagePrefetchTask = prefretchOnboardingImages()
			const appUser = await getAppUser()

			// Already onboarded, skip
			if (appUser?.metadata?.hasOnboarded) {
				navigation.replace('Permissions', {})
				return
			}

			// Reonboarded, go to reonboarding intro
			if (appUser?.metadata?.reonboard) {
				await imagePrefetchTask
				navigation.replace('ReonboardingIntro')
				return
			}

			// Owner, go to name screen
			if (appUser?.userRole === 'Owner') {
				await imagePrefetchTask
				navigation.replace('Name')
				return
			}

			// Invited, go to avatar screen
			if (appUser?.metadata?.invitedBy && !appUser?.metadata?.fullName) {
				await imagePrefetchTask
				navigation.replace('AvatarScreen')
				return
			}

			// Default, go to name screen
			await imagePrefetchTask
			navigation.replace('Name')
		}

		setup()
	}, [])

	return (
		<View style={styles.container}>
			<Loading />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	}
})
