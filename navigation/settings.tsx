import { Feather } from '@expo/vector-icons'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Pressable } from 'react-native'
import SharedStyles from '../constants/Styles'
import ContactsScreen from '../screens/ContactsScreen'
import ReferFriendScreen from '../screens/ReferFriendScreen'
import AccountInfoScreen from '../screens/Settings/AccountInfoScreen'
import AdminSettingsScreen from '../screens/Settings/AdminSettingsScreen'
import AdminSimulateScreen from '../screens/Settings/AdminSimulateScreen'
import CustomTagsListScreen from '../screens/Settings/CustomTagsScreen'
import EditTagScreen from '../screens/Settings/EditTagScreen'
import MotivationUpdateScreen from '../screens/Settings/MotivationUpdateScreen'
import SettingsScreen from '../screens/SettingsScreen'
import WebViewModalScreen from '../screens/WebViewModalScreen'
import { SettingsStackParamList, SettingsTabScreenProps } from '../types'
import goBackOrHome from './goBackOrHome'

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>()

export default function SettingsNavigator() {
	return (
		<SettingsStack.Navigator initialRouteName="SettingsRoot">
			<SettingsStack.Screen
				name="SettingsRoot"
				component={SettingsScreen}
				options={({ navigation }: SettingsTabScreenProps<'SettingsRoot'>) => ({
					title: 'Settings',
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => navigation.goBack()}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>

			<SettingsStack.Screen
				name="WebViewModal"
				component={WebViewModalScreen}
				options={({ navigation }: SettingsTabScreenProps<'WebViewModal'>) => ({
					title: '',
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => navigation.goBack()}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<SettingsStack.Screen
				name="AdminSettings"
				component={AdminSettingsScreen}
				options={{ title: 'Admin Settings' }}
			/>
			<SettingsStack.Screen
				name="Motivation"
				component={MotivationUpdateScreen}
				options={({ navigation }: SettingsTabScreenProps<'Motivation'>) => ({
					title: '',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => navigation.goBack()}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<SettingsStack.Screen
				name="AccountInfo"
				component={AccountInfoScreen}
				options={({ navigation }: SettingsTabScreenProps<'AccountInfo'>) => ({
					title: 'Edit Account',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => navigation.goBack()}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<SettingsStack.Screen
				name="CustomTagsList"
				component={CustomTagsListScreen}
				options={({ navigation }: SettingsTabScreenProps<'CustomTagsList'>) => ({
					title: 'Custom Tags',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => navigation.goBack()}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<SettingsStack.Screen
				name="EditTag"
				component={EditTagScreen}
				options={({ navigation }: SettingsTabScreenProps<'EditTag'>) => ({
					title: 'Edit Tag',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							onPress={() => navigation.goBack()}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<SettingsStack.Screen
				name="ReferFriend"
				component={ReferFriendScreen}
				options={({ navigation }: SettingsTabScreenProps<'ReferFriend'>) => ({
					title: 'Earn Free Months',
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
			<SettingsStack.Screen
				name="Contacts"
				component={ContactsScreen}
				options={({ navigation }: SettingsTabScreenProps<'Contacts'>) => ({
					title: 'Contacts',
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
			<SettingsStack.Screen name="AdminSimulate" component={AdminSimulateScreen} options={{ title: 'Simulate' }} />
		</SettingsStack.Navigator>
	)
}
