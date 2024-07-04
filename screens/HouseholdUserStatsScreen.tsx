import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import GroupUserMetrics from '../components/GroupUserMetrics'
import { Text, View } from '../components/Themed'
import { chattanoogaTapWater, dichotomousHippopotamus } from '../constants/Colors'
import { useGroupMetrics } from '../core/services/group'
import { useUser } from '../core/services/user'
import { RootStackScreenProps } from '../types'
import BaseScreen from './BaseScreen'

export default function HouseholdUserStatsScreen({ navigation, route }: RootStackScreenProps<'HouseHoldUserStats'>) {
	const { data: user } = useUser()
	const [includeOvernight, setIncludeOvernight] = useState(false)
	const [groupId, setGroupId] = useState(route.params?.groupId ?? user?.householdGroupId ?? '')
	const dataProvider = (start: string, end: string) => {
		return useGroupMetrics(groupId, start, end, includeOvernight)
	}

	return (
		<BaseScreen>
			<View style={styles.container}>
				<View style={{ flexGrow: 1, width: '100%' }}>
					<View
						style={{
							paddingTop: 15,
							marginLeft: 'auto',
							marginRight: 'auto'
						}}>
						<TouchableOpacity
							style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}
							onPress={() => setIncludeOvernight(!includeOvernight)}>
							<View>
								<Text style={{ fontSize: 8, color: chattanoogaTapWater, paddingRight: 5, textAlign: 'right' }}>
									Include Overnight Data
								</Text>
							</View>
							<Ionicons
								name={includeOvernight ? 'ios-moon' : 'ios-moon-outline'}
								size={14}
								color={includeOvernight ? dichotomousHippopotamus : chattanoogaTapWater}
							/>
						</TouchableOpacity>
					</View>
					<ScrollView style={{ width: '100%' }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 230 }}>
						<GroupUserMetrics isMyStatsView={false} dataProvider={dataProvider} />
					</ScrollView>
				</View>
			</View>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 65
	}
})
