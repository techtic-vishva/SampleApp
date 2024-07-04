import InterstitialComponent from '../../../components/InterstitialComponent'
import { searchSurvey, useUser } from '../../../core/services/user'
import { OnboardingTabScreenProps } from '../../../types'

export const SurveyPreviewScreenBackgroundImages = [
	'https://storage.googleapis.com/aro-public/assets/photos/goal-background-01.jpeg',
	'https://storage.googleapis.com/aro-public/assets/photos/goal-background-02.jpeg',
	'https://storage.googleapis.com/aro-public/assets/photos/goal-background-03.jpeg'
]

export default function SurveyPreviewScreen({ navigation, route }: OnboardingTabScreenProps<'SurveyPreviewScreen'>) {
	const { data } = useUser()

	const onGetStarted = async () => {
		const surveys = await searchSurvey('onboarding', data?.metadata?.role)
		navigation.navigate('Survey', { surveyId: surveys[0]?.id || 1 })
	}

	const topLabel = data?.metadata?.reonboard
		? 'Thanks for that!  Now let’s talk about your goals.'
		: data?.userRole === 'Owner'
		? 'Your household is ready!  Let’s talk about your goals.'
		: 'Welcome to Aro!  Let’s talk about your goals.'

	return (
		<InterstitialComponent
			topLabel={topLabel}
			imageURLs={SurveyPreviewScreenBackgroundImages}
			primaryButtonLabel="Get Started"
			primaryButtonIcon="arrow-right"
			onPrimaryButton={onGetStarted}
		/>
	)
}
