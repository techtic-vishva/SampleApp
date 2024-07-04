import React, { useState } from 'react'
import { View, Text } from '../../components/Themed'
import { GroupTabScreenProps } from '../../types'
import GroupUserDetail from '../../components/GroupUserDetail'
import GroupUserMetrics from '../../components/GroupUserMetrics'
import { Ionicons } from '@expo/vector-icons'
import { chattanoogaTapWater, darkArts, dichotomousHippopotamus, fill } from '../../constants/Colors'
import { Pressable, ScrollView } from 'react-native'
import { useMetrics } from '../../core/services/user-stats'

export default function GroupUserDetailScreen({ navigation, route }: GroupTabScreenProps<'GroupUserDetailScreen'>) {
	const [includeOvernight, setIncludeOvernight] = useState(false)

	const dataProvider = (start: string, end: string) => {
		return useMetrics(route.params.userId, start, end, includeOvernight)
	}
	return (
		<View style={{ backgroundColor: darkArts, flex: 1, width: '100%', height: '100%', display: 'flex' }}>
			<ScrollView
				contentContainerStyle={{
					alignItems: 'center',
					paddingTop: 90,
					paddingBottom: 20
				}}>
				<Pressable
					style={{
						display: 'flex',
						flexDirection: 'row',
						zIndex: 100
					}}
					onPress={() => {
						setIncludeOvernight(!includeOvernight)
					}}>
					<View style={{ flex: 1, backgroundColor: 'transparent' }}>
						<Text style={{ fontSize: 8, color: chattanoogaTapWater, paddingRight: 5, textAlign: 'right' }}>
							Include
						</Text>
						<Text style={{ fontSize: 8, color: chattanoogaTapWater, paddingRight: 5, textAlign: 'right' }}>
							Overnights
						</Text>
					</View>
					<Ionicons
						style={{ marginLeft: 'auto', marginRight: '5%' }}
						name={includeOvernight ? 'ios-moon' : 'ios-moon-outline'}
						size={22}
						color={includeOvernight ? dichotomousHippopotamus : chattanoogaTapWater}
					/>
				</Pressable>
				<GroupUserDetail includeOvernight={includeOvernight} userId={route.params.userId} style={{ marginTop: -20 }} />
				<View
					style={{
						backgroundColor: fill,
						height: 1,
						width: '80%',
						marginTop: 25,
						marginBottom: 5
					}}
				/>
				<GroupUserMetrics isMyStatsView={false} dataProvider={dataProvider} />
			</ScrollView>
		</View>
	)
}
