import { Feather } from '@expo/vector-icons'
import { MenuView } from '@react-native-menu/menu'
import { useIsFocused } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import Loading from '../components/Loading'
import { HeaderText } from '../components/StyledText'
import { Text, View } from '../components/Themed'
import UserAvatar from '../components/UserAvatar'
import { chattanoogaTapWater, darkArts, dichotomousHippopotamus, employeeParking, fill } from '../constants/Colors'
import SharedStyles from '../constants/Styles'
import { Group, useGroups } from '../core/services/group'
import { useOnActivate } from '../hooks/useOnActivate'
import { RootTabScreenProps } from '../types'

function EmptyGroupPrompt({ onPress }: { onPress: () => void }) {
	return (
		<View style={{ flex: 1, alignItems: 'center', paddingTop: '25%' }}>
			<TouchableOpacity
				onPress={onPress}
				style={{
					marginTop: 50,
					width: '90%',
					height: 225,
					backgroundColor: fill,
					borderRadius: 10,
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingVertical: 50
				}}>
				<Feather name="home" color={dichotomousHippopotamus} size={32} style={{ marginBottom: 20 }} />
				<HeaderText>Create a Household</HeaderText>
				<Text>For those who Aro together at home.</Text>
			</TouchableOpacity>
			<View style={[SharedStyles.glowTop, { zIndex: -1 }]} />
		</View>
	)
}

function GroupItem({ group }: { group: Group }) {
	const renderedCount = 8
	const usersRendered = group.users.slice(0, renderedCount)
	const remainingUsers = group.users.slice(renderedCount)

	return (
		<View style={groupItemStyles.item}>
			{/* Left column */}
			<View style={[groupItemStyles.column, groupItemStyles.leftColumn]}>
				{/* Title row */}
				<View style={groupItemStyles.row}>
					{/* Icon */}
					<Feather
						name={group.type === 'household' ? 'home' : 'users'}
						color={chattanoogaTapWater}
						size={16}
						style={{ marginRight: 10 }}
					/>
					<Text style={{ fontFamily: 'objektiv-semi-bold', color: employeeParking }}>{group.name}</Text>
				</View>

				{/* Avatar row */}
				<View style={[groupItemStyles.row, { marginTop: 7 }]}>
					{usersRendered.map((u, i) => (
						<UserAvatar
							key={i}
							user={u}
							shadeCounter={i}
							size="small"
							style={
								{ marginLeft: -3, borderColor: fill, borderWidth: 1 } // Overlap effect
							}
						/>
					))}

					{
						// More users counter
						remainingUsers.length > 0 && (
							<View
								style={{
									backgroundColor: chattanoogaTapWater,
									marginLeft: -5,
									borderColor: fill,
									borderWidth: 1,
									width: 23,
									height: 23,
									borderRadius: 50,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
								<Text style={{ fontSize: 10, fontFamily: 'objektiv-md' }}>+{remainingUsers.length}</Text>
							</View>
						)
					}
				</View>
			</View>

			{/* Right column */}
			<View style={[groupItemStyles.column]}>
				{group.active ? (
					<LottieView
						source={require('../assets/animations/pulese.min.json')}
						style={{ width: 30, height: 30 }}
						loop={true}
						autoPlay={true}
					/>
				) : (
					<Feather name="circle" size={23} style={{ marginRight: 3, opacity: 0.7 }} color={darkArts} />
				)}
			</View>
		</View>
	)
}

const groupItemStyles = StyleSheet.create({
	item: {
		width: '90%',
		backgroundColor: fill,
		borderRadius: 15,
		marginBottom: 10,
		paddingHorizontal: 20,
		paddingVertical: 20,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	column: {
		backgroundColor: 'transparent'
	},
	leftColumn: {
		display: 'flex'
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: 'transparent',
		alignItems: 'center'
	}
})

export default function GroupScreen({ navigation }: RootTabScreenProps<'GroupTab'>) {
	let { data, refetch, isFetching } = useGroups()
	const isFocused = useIsFocused()
	const [isRefreshing, setIsRefreshing] = useState(false)
	useOnActivate(refetch, !isFetching && isFocused)

	// Refresh on focus
	useEffect(() => {
		if (!isFetching && isFocused) {
			refetch()
		}
	}, [isFocused])

	// Loading
	if (!Array.isArray(data)) return <Loading />

	// No Groups
	if (data.length === 0) return <EmptyGroupPrompt onPress={() => navigation.navigate('Group')} />

	function onGroupPress(group: Group) {
		// @ts-ignore
		navigation.navigate('Group', {
			screen: 'GroupSummary',
			params: { groupId: group.id }
		})
	}

	async function onRefresh() {
		setIsRefreshing(true)
		try {
			await refetch()
		} finally {
			setIsRefreshing(false)
		}
	}

	// Group List
	return (
		<View style={styles.container}>
			<ScrollView
				style={{ width: '100%' }}
				contentContainerStyle={{ paddingBottom: 20 }}
				alwaysBounceHorizontal={false}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						tintColor={chattanoogaTapWater}
						colors={[chattanoogaTapWater]}
						refreshing={isRefreshing}
						onRefresh={onRefresh}
					/>
				}>
				{data.map((g) => (
					<MenuView
						key={g.id}
						onPressAction={async ({ nativeEvent }) => {
							switch (nativeEvent.event) {
								case 'invite-member':
									// @ts-ignore
									navigation.navigate('Group', {
										screen: 'GroupInvite',
										params: {
											groupId: g.id
										}
									})
									break
							}
						}}
						actions={[
							{
								id: 'invite-member',
								title: 'Invite Member',
								image: 'person.badge.plus'
							}
						]}
						shouldOpenOnLongPress={true}>
						<TouchableOpacity
							style={{ width: '100%', alignItems: 'center' }}
							key={g.id}
							onPress={() => onGroupPress(g)}>
							<GroupItem group={g} />
						</TouchableOpacity>
					</MenuView>
				))}
			</ScrollView>
			<View style={[SharedStyles.glowTop, { zIndex: -1 }]} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: '30%',
		flex: 1,
		alignItems: 'center'
	}
})
