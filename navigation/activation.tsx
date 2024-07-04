import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ActivationScreen from '../screens/ActivationScreen'
import { ActivationStackParamList } from '../types'

const ActivationStack = createNativeStackNavigator<ActivationStackParamList>()

export default function AuthenticationNavigator() {
	return (
		<ActivationStack.Navigator>
			<ActivationStack.Screen name="Activation" component={ActivationScreen} options={{ headerShown: false }} />
		</ActivationStack.Navigator>
	)
}
