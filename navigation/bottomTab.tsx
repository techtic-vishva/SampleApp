import { Feather, Octicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { Pressable } from 'react-native'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import HomeScreen from '../screens/HomeScreen'
import MotivationScreenTab from '../screens/MotivationScreen'
import { RootTabParamList, RootTabScreenProps } from '../types'
import SharedStyles from '../constants/Styles'
import ContentScreen from '../screens/ContentScreen'
import HouseholdScreen from '../screens/HouseholdScreen'

const BottomTab = createBottomTabNavigator<RootTabParamList>()

export default function BottomTabNavigator() {
	const colorScheme = useColorScheme()

	const tabBarLabelStyle = {
		fontSize: 10,
		fontFamily: 'objektiv-md'
	}

	return (
		<BottomTab.Navigator
			initialRouteName="HomeTab"
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme].tint,
				tabBarInactiveTintColor: 'white'
			}}>
			<BottomTab.Screen
				name="HomeTab"
				component={HomeScreen}
				options={({ navigation }: RootTabScreenProps<'HomeTab'>) => ({
					headerShown: false,
					tabBarLabelStyle,
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
					tabBarLabel: 'Home',
					headerRight: () => (
						<Pressable
							onPress={() => navigation.navigate('GoalModal')}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="edit-3" size={25} color={Colors[colorScheme].text} style={{ marginRight: 15 }} />
						</Pressable>
					)
				})}
			/>
			<BottomTab.Screen
				name="FamilyTab"
				component={HouseholdScreen}
				options={{
					tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
					tabBarLabel: 'Household',
					tabBarLabelStyle,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerShown: false
				}}
			/>

			<BottomTab.Screen
				name="MotivationTab"
				component={MotivationScreenTab}
				options={{
					tabBarIcon: ({ color }) => <TabBarIcon name="award" color={color} />,
					tabBarLabel: 'Challenges',
					tabBarLabelStyle,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerShown: false
				}}
			/>

			<BottomTab.Screen
				name="ContentTab"
				component={ContentScreen}
				options={{
					tabBarIcon: ({ color }) => <TabBarIcon name="play-circle" color={color} />,
					tabBarLabel: 'Media',
					tabBarLabelStyle,
					headerTitleStyle: SharedStyles.navigationHeader,
					headerTitleAlign: 'center',
					headerShown: false
				}}
			/>
		</BottomTab.Navigator>
	)
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={22} style={{ paddingTop: 10, paddingBottom: 2 }} {...props} />
}
