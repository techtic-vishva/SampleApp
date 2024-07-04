import { Feather } from '@expo/vector-icons'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Pressable } from 'react-native'
import { chattanoogaTapWater } from '../constants/Colors'
import EmailScreen from '../screens/onboarding/EmailScreen'
import WelcomeScreen from '../screens/onboarding/WelcomeScreen'
import { AuthenticationStackParamList, AuthenticationTabScreenProps } from '../types'

const AuthenticationStack = createNativeStackNavigator<AuthenticationStackParamList>()

export default function AuthenticationNavigator() {
	return (
		<AuthenticationStack.Navigator>
			<AuthenticationStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
			<AuthenticationStack.Screen
				name="Email"
				component={EmailScreen}
				options={({ navigation }: AuthenticationTabScreenProps<'Email'>) => ({
					title: '',
					headerTransparent: true,
					headerLeft: () => (
						<Pressable
							onPress={() => navigation.goBack()}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1
							})}>
							<Feather name="arrow-left" size={20} color={chattanoogaTapWater} />
						</Pressable>
					)
				})}
			/>
		</AuthenticationStack.Navigator>
	)
}
