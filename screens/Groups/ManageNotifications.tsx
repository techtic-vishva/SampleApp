import React from 'react'
import { Text, View } from '../../components/Themed'
import { GroupTabScreenProps } from '../../types'
import { StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { chattanoogaTapWater, dichotomousHippopotamus, fill } from '../../constants/Colors'
import useHouseHoldNotifications, { GroupMember, useGroupMembers, userNotification } from '../../core/services/group'
import SharedStyles from '../../constants/Styles'
import UserAvatar from '../../components/UserAvatar'
import Loading from '../../components/Loading'

function EmptyUserPrompt({ onPress }: { onPress: () => void }) {
	return (
		<View style={{ flex: 1, alignItems: 'center', paddingTop: '25%' }}>
			<TouchableOpacity
				onPress={onPress}
				style={{
					marginTop: 50,
					width: '90%',
					height: 150,
					backgroundColor: fill,
					borderRadius: 10,
					alignItems: 'center',
					justifyContent: 'center'
				}}>
				<Text>No Members</Text>
			</TouchableOpacity>
			<View style={[SharedStyles.glowTop, { zIndex: -1 }]} />
		</View>
	)
}

export default function ManageNotifications({ navigation, route }: GroupTabScreenProps<'ManageNotifications'>) {
	const groupId = route.params.groupId
	const { data } = useGroupMembers(groupId)
	const { data: houseHoldNotificationData, refetch: householdRefetch } = useHouseHoldNotifications()

	// Loading
	if (!Array.isArray(data)) return <Loading />

	// No Groups
	if (data?.length === 0) return <EmptyUserPrompt onPress={() => navigation.goBack()} />

	async function toggleSwitch(userid: string, state: boolean) {
		await userNotification(userid, state)
		householdRefetch()
	}

	return (
		<View style={styles.container}>
			<Text
				style={{ textAlign: 'left', width: '100%', paddingLeft: '5%', fontSize: 16, fontFamily: 'objektiv-semi-bold' }}>
				Session Start Notifications
			</Text>
			<Text
				style={{
					textAlign: 'left',
					width: '100%',
					paddingHorizontal: '5%',
					paddingTop: 10,
					paddingBottom: 20,
					color: chattanoogaTapWater
				}}>
				A quick notification when someone in your household starts an Aro session. Toggle to enable or disable.
			</Text>
			<ScrollView
				style={{ width: '100%' }}
				contentContainerStyle={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					paddingBottom: 20
				}}>
				{data &&
					data.map((u: GroupMember, i: number) => {
						const notificationData = houseHoldNotificationData?.find((item) => {
							if (item.userid == u.userid) {
								return item
							}
						})

						return (
							<View key={i} style={styles.item}>
								<View style={[styles.row, { maxWidth: '100%' }]}>
									<View style={[styles.column, { flex: 1 }]}>
										<UserAvatar
											user={u}
											size="medium"
											style={
												{ borderColor: fill, borderWidth: 1 } // Overlap effect
											}
										/>
										<Text style={styles.fullname} numberOfLines={1}>
											{u.fullname}
										</Text>
										<View style={{ backgroundColor: 'transparent' }}>
											<Switch
												thumbColor={'white'}
												trackColor={{ true: dichotomousHippopotamus, false: 'grey' }}
												onValueChange={(state: boolean) => toggleSwitch(u.userid, state)}
												value={notificationData ? notificationData.enabled : true}
											/>
										</View>
									</View>
								</View>
							</View>
						)
					})}
			</ScrollView>
			<View style={[SharedStyles.glowTop, { zIndex: -1 }]} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: '30%'
	},
	item: {
		width: '90%',
		backgroundColor: fill,
		borderRadius: 15,
		marginBottom: 10,
		paddingHorizontal: 20,
		paddingVertical: 20,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	column: {
		backgroundColor: 'transparent',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},

	row: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%'
	},
	fullname: {
		fontFamily: 'objektiv-md',
		marginLeft: 10,
		fontSize: 16,
		paddingRight: 5,
		flex: 1
	}
})
