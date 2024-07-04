import { Feather } from '@expo/vector-icons'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Pressable } from 'react-native'
import WeeklyRecapScreen from '../screens/WeeklyRecapScreen'
import { ProfileStackParamList, ProfileTabScreenProps } from '../types'
import goBackOrHome from './goBackOrHome'
import SharedStyles from '../constants/Styles'
import ProfileScreen from '../screens/ProfileScreen'

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>()

export default function ProfileNavigator() {
	return (
		<ProfileStack.Navigator>
			<ProfileStack.Screen
				name="ProfileTab"
				component={ProfileScreen}
				options={({ navigation }: ProfileTabScreenProps<'ProfileTab'>) => ({
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
			<ProfileStack.Screen
				name="WeeklyRecap"
				component={WeeklyRecapScreen}
				options={({ navigation }: ProfileTabScreenProps<'WeeklyRecap'>) => ({
					title: 'Weekly Recap',
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
		</ProfileStack.Navigator>
	)
}
