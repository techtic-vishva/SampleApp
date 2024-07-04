import InterstitialComponent from '../../../components/InterstitialComponent'
import { update } from '../../../core/services/user'
import { OnboardingTabScreenProps } from '../../../types'

export const HouseholdSetupScreenBackgroundImages = [
	'https://storage.googleapis.com/aro-public/assets/photos/household-background-01.jpeg',
	'https://storage.googleapis.com/aro-public/assets/photos/household-background-02.jpeg',
	'https://storage.googleapis.com/aro-public/assets/photos/household-background-03.jpeg'
]

export default function HouseholdSetupScreen({ navigation, route }: OnboardingTabScreenProps<'HouseholdSetupScreen'>) {
	const onFamily = () => {
		navigation.navigate('NameHousehold')
	}

	const onJustMe = async () => {
		await update({ metadata: { role: 'individual' } })
		navigation.navigate('SurveyPreviewScreen')
	}

	return (
		<InterstitialComponent
			topLabel="Let's set up your household.  How will you use Aro?"
			imageURLs={HouseholdSetupScreenBackgroundImages}
			primaryButtonLabel="With my family"
			primaryButtonIcon="users"
			secondaryButtonLabel="Just me"
			secondaryButtonIcon="user"
			onPrimaryButton={onFamily}
			onSecondaryButton={onJustMe}
		/>
	)
}
