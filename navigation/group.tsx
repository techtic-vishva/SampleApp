import { Feather } from '@expo/vector-icons'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Pressable } from 'react-native'
import CreateGroupScreen from '../screens/Groups/CreateGroupScreen'
import EditGroupNameScreen from '../screens/Groups/EditGroupNameScreen'
import GroupEditScreen from '../screens/Groups/GroupEditScreen'
import GroupSummaryScreen from '../screens/Groups/GroupSummaryScreen'
import InviteGroupScreen from '../screens/Groups/InviteGroupScreen'
import JoinGroupScreen from '../screens/Groups/JoinGroupScreen'
import EditGroupPhotoScreen from '../screens/Groups/EditGroupPhotoScreen'
import RemoveMember from '../screens/Groups/RemoveMember'
import GroupUserDetailScreen from '../screens/Groups/GroupUserDetailScreen'
import { GroupStackParamList, GroupTabScreenProps } from '../types'
import goBackOrHome from './goBackOrHome'
import ManageNotifications from '../screens/Groups/ManageNotifications'
import SharedStyles from '../constants/Styles'

const GroupStack = createNativeStackNavigator<GroupStackParamList>()

export default function GroupNavigator() {
	return (
		<GroupStack.Navigator initialRouteName="GroupRoot">
			<GroupStack.Screen
				name="GroupRoot"
				component={CreateGroupScreen}
				options={({ navigation }: GroupTabScreenProps<'GroupRoot'>) => ({
					title: 'Create a Group',
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
			<GroupStack.Screen
				name="GroupSummary"
				component={GroupSummaryScreen}
				options={({ navigation }: GroupTabScreenProps<'GroupSummary'>) => ({
					title: '', // Set dynamically
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							// @ts-ignore
							onPress={() => navigation.navigate('Root')}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<GroupStack.Screen
				name="EditGroupPhoto"
				component={EditGroupPhotoScreen}
				options={({ navigation }: GroupTabScreenProps<'EditGroupPhoto'>) => ({
					title: 'Edit Group Photo', // Set dynamically
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							// @ts-ignore
							onPress={() => navigation.goBack()}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
			<GroupStack.Screen
				name="GroupEdit"
				component={GroupEditScreen}
				options={({ navigation }: GroupTabScreenProps<'GroupEdit'>) => ({
					title: '', // Set dynamically
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
			<GroupStack.Screen
				name="GroupJoin"
				component={JoinGroupScreen}
				options={({ navigation }: GroupTabScreenProps<'GroupJoin'>) => ({
					title: 'Join Group',
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
			<GroupStack.Screen
				name="EditGroupName"
				component={EditGroupNameScreen}
				options={({ navigation }: GroupTabScreenProps<'EditGroupName'>) => ({
					title: 'Edit Group Name',
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
			<GroupStack.Screen
				name="RemoveMember"
				component={RemoveMember}
				options={({ navigation }: GroupTabScreenProps<'RemoveMember'>) => ({
					title: 'Remove Member',
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
			<GroupStack.Screen
				name="ManageNotifications"
				component={ManageNotifications}
				options={({ navigation }: GroupTabScreenProps<'ManageNotifications'>) => ({
					title: 'Manage Notifications',
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
			<GroupStack.Screen
				name="GroupUserDetailScreen"
				component={GroupUserDetailScreen}
				options={({ navigation }: GroupTabScreenProps<'GroupUserDetailScreen'>) => ({
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

			<GroupStack.Screen
				name="GroupInvite"
				component={InviteGroupScreen}
				options={({ navigation }: GroupTabScreenProps<'GroupInvite'>) => ({
					title: 'Invite',
					headerTransparent: true,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerLeft: () => (
						<Pressable
							// @ts-ignore
							onPress={() => navigation.goBack()}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={'white'} />
						</Pressable>
					)
				})}
			/>
		</GroupStack.Navigator>
	)
}
