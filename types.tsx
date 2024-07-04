/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ChallengesV2 } from './core/services/challenges-v2'
import { Content } from './core/services/content'
import { Tag } from './core/services/session'

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

export type RootStackParamList = {
	Root: NavigatorScreenParams<RootTabParamList> | undefined
	GoalModal: { value?: string }
	EditSession: { uuid: string }
	NotFound: undefined
	Settings: undefined
	Group: undefined
	Profile: undefined
	AroGo: undefined
	ConnectivityTip: undefined
	GoalMet: { uuid: string; skipEdit?: boolean }
	Announcement: undefined
	Household: undefined
	AllChallenges: { isUserChallenges: boolean }
	ChallengeScreen: { challengeId: number }
	HouseHoldUserStats: { groupId?: string }
	Playlist: { playlistId: number }
	Author: { authorId: number }
	AuthorList: undefined
	Content: { contentId: number }
	ContentVideo: { videoUrl: string }
}

export type OnboardingStackParamList = {
	OnboardingSetup: undefined
	Name: undefined
	Motivation: undefined
	Goal: undefined
	PermissionsPreview: undefined
	Permissions: { step?: number }
	HouseholdInvite: undefined
	AvatarScreen: undefined
	HouseholdSetupScreen: undefined
	SurveyPreviewScreen: undefined
	NameHousehold: undefined
	FamilyInvite: undefined
	Survey: { surveyId: number }
	GoalLoading: { expertGoal: string }
	SelectGoal: { expertGoal: string }
	SelectRole: { skipToSurvey?: boolean }
	VideoPlayer: undefined
	HouseholdAvatar: undefined
	QrCode: undefined
	Pulse: undefined
	OtherHouseholdMembersInvite: undefined
	ReonboardingIntro: undefined
	OnboardReferFriend: undefined
	OnboardContacts: undefined
}

export type SettingsStackParamList = {
	SettingsRoot: undefined
	AccountInfo: undefined
	Motivation: undefined
	FirmwareUpdate: undefined
	Support: undefined
	TermsAndService: undefined
	PrivacyPolicy: undefined
	WebViewModal: { title: string; uri: string }
	AdminSettings: undefined
	AdminSimulate: undefined
	CustomTagsList: undefined
	EditTag: Tag
	ReferFriend: undefined
	Contacts: undefined
}

export type GroupStackParamList = {
	GroupRoot: { placeholder?: string }
	GroupCreate: { placeholder?: string }
	GroupInvite: { groupId: string }
	GroupEdit: { groupId: string }
	EditGroupPhoto: { groupId: string }
	EditGroupName: { groupId: string; name?: string }
	GroupSummary: { groupId: string; invite?: boolean }
	GroupUserDetailScreen: { userId: string }
	GroupJoin: { invite_code?: string }
	RemoveMember: { groupId: string }
	ManageNotifications: { groupId: string }
}

export type ProfileStackParamList = {
	ProfileTab: { initialRouteName?: string } | undefined
	WeeklyRecap: { endDate: string; startDate: string }
}

export type AuthenticationStackParamList = {
	Welcome: undefined
	Email: { step?: number; email?: string; verb?: string }
}

export type ActivationStackParamList = {
	Activation: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
	RootStackParamList,
	Screen
>

export type RootTabParamList = {
	HomeTab: undefined
	MotivationTab: { highlightAchievementCode?: string; initialRouteName?: string } | undefined
	GroupTab: undefined
	ContentTab: undefined
	FamilyTab: { groupId?: string; date?: string }
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
	BottomTabScreenProps<RootTabParamList, Screen>,
	NativeStackScreenProps<RootStackParamList>
>

export type OnboardingTabScreenProps<Screen extends keyof OnboardingStackParamList> = NativeStackScreenProps<
	OnboardingStackParamList,
	Screen
>

export type AuthenticationTabScreenProps<Screen extends keyof AuthenticationStackParamList> = NativeStackScreenProps<
	AuthenticationStackParamList,
	Screen
>

export type ActivationTabScreenProps<Screen extends keyof ActivationStackParamList> = NativeStackScreenProps<
	ActivationStackParamList,
	Screen
>

export type SettingsTabScreenProps<Screen extends keyof SettingsStackParamList> = NativeStackScreenProps<
	SettingsStackParamList,
	Screen
>

export type GroupTabScreenProps<Screen extends keyof GroupStackParamList> = NativeStackScreenProps<
	GroupStackParamList,
	Screen
>

export type ProfileTabScreenProps<Screen extends keyof ProfileStackParamList> = NativeStackScreenProps<
	ProfileStackParamList,
	Screen
>
