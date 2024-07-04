import { NavigationContainer, DefaultTheme, DarkTheme, createNavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { ColorSchemeName, Pressable, Share } from 'react-native'
import GoalModalScreen from '../screens/GoalModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import { RootStackParamList, RootStackScreenProps } from '../types'
import LinkingConfiguration from './LinkingConfiguration'
import * as Linking from 'expo-linking'
import { useIsAuthenticated, loginWithLink, useIsActive, isAuthenticated } from '../core/Authentication'
import {
	GlobalState,
	setActivationCode,
	setShouldPromptForReview,
	setIsOnboarded,
	setNfcEnable
} from '../core/GlobalState'
import { init as initLocation } from '../core/AroLocation'
import { init as initGeolocation } from '../core/AroGeolocation'
import { init as initBluetooth } from '../core/connectivity/AroBluetooth'
import { useEffect, useRef, useState } from 'react'
import { init as initNotify } from '../core/Notifications'
import AuthenticationNavigator from './authentication'
import ActivationNavigator from './activation'
import OnboardingNavigator from './onboarding'
import BottomTabNavigator from './bottomTab'
import GroupNavigator from './group'
import SettingsNavigator from './settings'
import EditSessionScreen from '../screens/EditSessionScreen'
import AroGoScreen from '../screens/AroGo'
import { Feather } from '@expo/vector-icons'
import { initBeacons } from '../core/beaconManager'
import * as Notifications from 'expo-notifications'
import { NotificationResponse } from 'expo-notifications'
import crashlytics from '@react-native-firebase/crashlytics'
import { State, isStateValid } from '../constants/Bluetooth'
import { useBluetoothState } from '../hooks/useBluetoothState'
import { useLocationPermissionState } from '../hooks/useLocationPermissionState'
import LocationRequiredScreen from '../screens/LocationRequired'
import BluetoothRequiredScreen from '../screens/BluetoothRequired'
import ConnectivityTipScreen from '../screens/ConnectivityTipScreen'
import ProfileNavigator from './profile'
import GoalMetScreen from '../screens/GoalMetScreen'
import TourTooltip from '../components/TourTooltip'
import SharedStyles from '../constants/Styles'
import {
	TourGuideProvider // Main provider
} from 'rn-tourguide'
import goBackOrHome from './goBackOrHome'
import AnnouncementScreen from '../screens/AnnouncementScreen'
import { appInit, getAppUser } from '../core/services/user'
import { initBackgroundFetch } from '../core/backgroundTask'
import { trackUserNavigation } from '../core/services/tracking'
import HouseHoldUserStatsScreen from '../screens/HouseholdUserStatsScreen'
import HouseholdScreen from '../screens/HouseholdScreen'
import AllChallengesScreen from '../screens/AllChallengesScreen'
import ChallengeScreen from '../screens/ChallengeScreen'
import Playlist from '../screens/content/Playlist'
import Author from '../screens/content/Author'
import ContentVideo from '../screens/content/ContentVideo'
import RNShake from 'react-native-shake'
import { onIsOnboarded } from '../core/EventBroker'
import { scan as scanNfc } from '../core/AroNfc'
import AuthorList from '../screens/content/AuthorList'
import Content from '../screens/content/Content'
import * as Device from 'expo-device'

initNotify()

function handleActivationCodeLink(url: string) {
	if (!url || !url.includes('/a/')) return
	const activationCode = url.split('/').pop() || ''
	if (!activationCode) return
	setActivationCode(activationCode)
	// @ts-ignore
	if (navigationRef.getCurrentRoute()?.name === 'Welcome') navigationRef.navigate('Email', { verb: 'setup' })
}

function handleReferralLink(url: string) {
	if (url.includes('referral/share')) {
		getAppUser().then((data) => {
			if (!data.referralInviteCode) return
			//@ts-ignore
			navigationRef.navigate('Settings', { screen: 'ReferFriend' })
		})
	}
}

Linking.addEventListener('url', (event) => {
	if (event.url) {
		loginWithLink(event.url)
		handleActivationCodeLink(event.url)
		handleReferralLink(event.url)
	}
})

Linking.getInitialURL().then((url) => {
	if (url) {
		loginWithLink(url)
		handleActivationCodeLink(url)

		/* Authentication Required, called from main navigator:
		   -  handleReferralLink(url)
		*/
	}
})

export const navigationRef = createNavigationContainerRef()

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
	const routeNameRef = useRef<string | undefined>()
	const [isAuthenticated] = useIsAuthenticated()
	const [isActive] = useIsActive()
	const locationPermissionState = useLocationPermissionState()
	const bluetoothState = useBluetoothState()
	const [isOnboarded, setIsOnboarded] = useState(GlobalState.isOnboarded)

	onIsOnboarded(setIsOnboarded)

	let Navigator = RootNavigator
	if (!isAuthenticated) Navigator = AuthenticationNavigator
	else if (!isActive) Navigator = ActivationNavigator
	else if (!isOnboarded) Navigator = OnboardingNavigator
	else if (!locationPermissionState) Navigator = LocationRequiredScreen
	else if (!isStateValid(bluetoothState) && Device.isDevice) Navigator = BluetoothRequiredScreen

	return (
		<TourGuideProvider {...{ backdropColor: 'rgba(0, 0, 0, 0.6)', tooltipComponent: TourTooltip }}>
			<NavigationContainer
				ref={navigationRef}
				linking={LinkingConfiguration}
				theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
				onReady={() => {
					routeNameRef.current = navigationRef.getCurrentRoute()?.name
				}}
				onStateChange={async () => {
					const previousRouteName = routeNameRef.current
					const currentRouteName = navigationRef.getCurrentRoute()?.name

					if (previousRouteName !== currentRouteName) {
						crashlytics().setAttribute('previous_route', previousRouteName || '')
						crashlytics().setAttribute('current_route', currentRouteName || '')
						crashlytics().setAttribute(
							'current_route_params',
							JSON.stringify(navigationRef.getCurrentRoute()?.params || {})
						)

						trackUserNavigation({
							previousRouteName: previousRouteName || '',
							currentRouteName: currentRouteName || ''
						}).catch(() => {
							// Omnomnom
						})
					}

					// Save the current route name for later comparison
					routeNameRef.current = currentRouteName
				}}>
				{<Navigator />}
			</NavigationContainer>
		</TourGuideProvider>
	)
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
	const bluetoothState = useBluetoothState()

	// Initialize
	useEffect(() => {
		// Bootstrap Services
		initLocation().then(initGeolocation).then(initBluetooth)
		initBeacons()
		initBackgroundFetch()

		// Temporary one-time reonboarding for users
		async function setup() {
			if (isAuthenticated()) {
				const appUser = await getAppUser()

				if (appUser?.metadata?.reonboard) {
					setIsOnboarded(false, true)
				}
			}
		}

		// Run App Init
		appInit()
			.then((appInitResult) => {
				// Ask user for app store reviews
				setShouldPromptForReview(appInitResult.shouldPromptForReview)
				setNfcEnable(appInitResult.enableNfc)
				setup()
			})
			.catch(() => {})

		const shouldShowConnectivityTip = !GlobalState.isFirstExperience && !GlobalState.neverShowConnectivityTip
		if (shouldShowConnectivityTip) {
			navigationRef.navigate('ConnectivityTip')
		}

		const subscribe = RNShake.addListener(() => {
			console.log('Shake event detected')
			if (GlobalState.nfc.enable) {
				scanNfc().then((message) => {
					if (message) {
						navigationRef.navigate('AroGo')
					}
				})
			}
		})

		// Check for launched link
		Linking.getInitialURL().then((url) => {
			if (url) {
				handleReferralLink(url)
			}
		})
	}, [])

	// Show Tips
	useEffect(() => {
		const shouldShowConnectivityTip =
			!GlobalState.isFirstExperience &&
			!GlobalState.neverShowConnectivityTip &&
			isStateValid(bluetoothState) &&
			bluetoothState !== State.Unknown
		if (shouldShowConnectivityTip) {
			navigationRef.navigate('ConnectivityTip')
		}
	}, [bluetoothState])

	// Bootstrap Notification Handlers
	useEffect(() => {
		const { remove } = Notifications.addNotificationResponseReceivedListener((event: NotificationResponse) => {
			const type = event.notification.request.content.data?.type

			if (typeof type === 'string' && type === 'achievement') {
				let highlightAchievementCode = event.notification.request.content.data?.highlightAchievementCode as
					| string
					| undefined
				if (typeof highlightAchievementCode !== 'string') highlightAchievementCode = undefined

				navigationRef.navigate('Root', {
					screen: 'MotivationTab',
					params: { highlightAchievementCode }
				})
			}
		})

		return remove
	}, [])

	return (
		<Stack.Navigator initialRouteName={'Root'}>
			<Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
			<Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Aro' }} />
			<Stack.Screen name="Household" component={HouseholdScreen} options={{ headerShown: false }} />
			<Stack.Screen
				name="Playlist"
				component={Playlist}
				options={({ navigation }: RootStackScreenProps<'Playlist'>) => ({
					title: '',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => goBackOrHome(navigation)}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<Stack.Screen
				name="Content"
				component={Content}
				options={({ navigation }: RootStackScreenProps<'Content'>) => ({
					title: '',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => goBackOrHome(navigation)}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<Stack.Screen
				name="ContentVideo"
				component={ContentVideo}
				options={({ navigation }: RootStackScreenProps<'ContentVideo'>) => ({
					title: '',
					headerShown: false,
					headerTransparent: true
				})}
			/>
			<Stack.Screen
				name="Author"
				component={Author}
				options={({ navigation }: RootStackScreenProps<'Author'>) => ({
					title: '',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => goBackOrHome(navigation)}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<Stack.Screen
				name="AuthorList"
				component={AuthorList}
				options={({ navigation }: RootStackScreenProps<'AuthorList'>) => ({
					title: '',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => goBackOrHome(navigation)}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<Stack.Screen
				name="AllChallenges"
				component={AllChallengesScreen}
				options={({ navigation }: RootStackScreenProps<'AllChallenges'>) => ({
					title: '',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => goBackOrHome(navigation)}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<Stack.Screen
				name="ChallengeScreen"
				component={ChallengeScreen}
				options={({ navigation }: RootStackScreenProps<'ChallengeScreen'>) => ({
					title: '',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => goBackOrHome(navigation, 'MotivationTab')}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<Stack.Screen
				name="GoalModal"
				component={GoalModalScreen}
				options={({ navigation }: RootStackScreenProps<'GoalModal'>) => ({
					title: 'Edit Goal',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => goBackOrHome(navigation)}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<Stack.Screen
				name="HouseHoldUserStats"
				component={HouseHoldUserStatsScreen}
				options={({ navigation }: RootStackScreenProps<'HouseHoldUserStats'>) => ({
					title: '',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => goBackOrHome(navigation)}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<Stack.Group screenOptions={{ presentation: 'modal' }}>
				<Stack.Screen
					name="EditSession"
					component={EditSessionScreen}
					options={{ title: 'Edit Session', headerShown: false }}
				/>
			</Stack.Group>
			<Stack.Group screenOptions={{ presentation: 'modal' }}>
				<Stack.Screen
					name="ConnectivityTip"
					component={ConnectivityTipScreen}
					options={({ navigation }: RootStackScreenProps<'ConnectivityTip'>) => ({
						title: 'Connectivity Tips',
						headerShown: false,
						headerTransparent: true
					})}
				/>

				<Stack.Screen
					name="GoalMet"
					component={GoalMetScreen}
					options={({ navigation }: RootStackScreenProps<'GoalMet'>) => ({
						title: 'Goal Met',
						headerShown: false,
						headerTransparent: true
					})}
				/>
				<Stack.Screen
					name="Announcement"
					component={AnnouncementScreen}
					options={({ navigation }: RootStackScreenProps<'Announcement'>) => ({
						title: 'Announcement',
						headerShown: false,
						headerTransparent: true
					})}
				/>
			</Stack.Group>
			<Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
				<Stack.Screen
					name="AroGo"
					component={AroGoScreen}
					options={({ navigation }: RootStackScreenProps<'AroGo'>) => ({
						title: 'Aro Go',
						headerTransparent: true,
						headerTitleStyle: SharedStyles.navigationHeader,
						headerTitleAlign: 'center'
					})}
				/>
			</Stack.Group>
			<Stack.Screen name="Profile" component={ProfileNavigator} options={{ headerShown: false }} />
			<Stack.Screen name="Settings" component={SettingsNavigator} options={{ headerShown: false }} />
			<Stack.Screen name="Group" component={GroupNavigator} options={{ headerShown: false }} />
		</Stack.Navigator>
	)
}
