import { createNativeStackNavigator } from '@react-navigation/native-stack'
import GoalScreen from '../screens/onboarding/GoalScreen'
import MotivationScreen from '../screens/onboarding/MotivationScreen'
import NameScreen from '../screens/onboarding/NameScreen'
import PermissionsScreen from '../screens/onboarding/PermissionScreen'
import { OnboardingStackParamList, OnboardingTabScreenProps } from '../types'
import HouseholdInvite from '../screens/onboarding/HouseholdInvite'
import AvatarScreen from '../screens/onboarding/AvatarScreen'
import HouseholdSetupScreen from '../screens/onboarding/interstitial/HouseholdSetupScreen'
import SurveyPreviewScreen from '../screens/onboarding/interstitial/SurveyPreviewScreen'
import NameHouseholdScreen from '../screens/onboarding/NameHouseholdScreen'
import FamilyInviteScreen from '../screens/onboarding/FamilyInviteScreen'
import SurveyScreen from '../screens/SurveyScreen'
import GoalLoadingScreen from '../screens/GoalLoadingScreen'
import SelectGoalScreen from '../screens/SelectGoalScreen'
import PermissionsPreviewScreen from '../screens/onboarding/interstitial/PermissionPreviewScreen'
import HouseholdAvatarScreen from '../screens/onboarding/HouseholdAvatarScreen'
import QrCodeScreen from '../screens/onboarding/QrCodeScreen'
import PulseScreen from '../screens/onboarding/PulseScreen'
import RoleSelectScreen from '../screens/onboarding/RoleSelectScreen'
import { Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { chattanoogaTapWater } from '../constants/Colors'
import OtherHouseholdMembersInviteScreen from '../screens/onboarding/OtherHouseholdMembersInvite'
import OnboardingSetup from '../screens/onboarding/OnboardingSetup'
import VideoPlayerScreen from '../screens/VideoPlayerScreen'
import ReonboardingIntroScreen from '../screens/onboarding/ReonboardingIntro'
import OnboardReferFriend from '../screens/onboarding/OnboardReferFriend'
import OnboardContacts from '../screens/onboarding/OnboardContacts'

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>()

export default function OnboardingNavigator() {
	return (
		<OnboardingStack.Navigator>
			{AddScreen('OnboardingSetup', OnboardingSetup)}
			{AddScreen('Name', NameScreen)}
			{AddScreen('AvatarScreen', AvatarScreen, true)}
			{AddScreen('HouseholdSetupScreen', HouseholdSetupScreen, true)}
			{AddScreen('NameHousehold', NameHouseholdScreen, true)}
			{AddScreen('HouseholdAvatar', HouseholdAvatarScreen, true)}
			{AddScreen('FamilyInvite', FamilyInviteScreen, true)}
			{AddScreen('SurveyPreviewScreen', SurveyPreviewScreen, true)}
			{AddScreen('Survey', SurveyScreen, true)}
			{AddScreen('GoalLoading', GoalLoadingScreen, true)}
			{AddScreen('SelectGoal', SelectGoalScreen)}
			{AddScreen('SelectRole', RoleSelectScreen, true)}
			{AddScreen('PermissionsPreview', PermissionsPreviewScreen, true)}
			{AddScreen('Permissions', PermissionsScreen, true)}
			{AddScreen('VideoPlayer', VideoPlayerScreen)}
			{AddScreen('QrCode', QrCodeScreen, true)}
			{AddScreen('Pulse', PulseScreen, true)}
			{AddScreen('OtherHouseholdMembersInvite', OtherHouseholdMembersInviteScreen, true)}

			{/* Deprecated */}
			{AddScreen('Goal', GoalScreen, true)}
			{AddScreen('Motivation', MotivationScreen, true)}
			{AddScreen('HouseholdInvite', HouseholdInvite, true)}
			{AddScreen('ReonboardingIntro', ReonboardingIntroScreen)}
			{AddScreen('OnboardReferFriend', OnboardReferFriend, true)}
			{AddScreen('OnboardContacts', OnboardContacts, true)}
		</OnboardingStack.Navigator>
	)
}

const defaults = {
	title: '',
	headerTransparent: true
}

function BackHeader(props: { onGoBack: () => void }) {
	return (
		<Pressable
			onPress={props.onGoBack}
			style={({ pressed }) => ({
				opacity: pressed ? 0.5 : 1
			})}>
			<Feather name="arrow-left" size={20} color={chattanoogaTapWater} />
		</Pressable>
	)
}

function AddScreen(
	name: keyof OnboardingStackParamList,
	component: React.ComponentType<any>,
	includeBackButton: boolean = false
) {
	if (includeBackButton) {
		return (
			<OnboardingStack.Screen
				name={name}
				component={component}
				options={({ navigation }: OnboardingTabScreenProps<any>) => ({
					...defaults,
					headerLeft: () => <BackHeader onGoBack={() => navigation.goBack()} />
				})}
			/>
		)
	} else {
		return <OnboardingStack.Screen name={name} component={component} options={{ headerShown: false }} />
	}
}
