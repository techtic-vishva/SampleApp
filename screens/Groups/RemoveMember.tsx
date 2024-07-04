import { Feather } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import Loading from '../../components/Loading'
import OrangeButton from '../../components/OrangeButton'
import { Text, View } from '../../components/Themed'
import UserAvatar from '../../components/UserAvatar'
import { fill, outlines } from '../../constants/Colors'
import SharedStyles from '../../constants/Styles'
import { useGroupMembers, removeGroupMember, GroupMember } from '../../core/services/group'
import { useOnActivate } from '../../hooks/useOnActivate'
import { GroupTabScreenProps } from '../../types'
import AroModal from '../../components/AroModal'

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
				<Text>No members invited</Text>
			</TouchableOpacity>
			<View style={[SharedStyles.glowTop, { zIndex: -1 }]} />
		</View>
	)
}

function UserItem({
	user,
	rowIndex,
	toggleConfirmDelete
}: {
	user: GroupMember
	rowIndex: number
	toggleConfirmDelete: (key: number) => void
}) {
	const onDeleteUser = async () => {
		toggleConfirmDelete(rowIndex)
	}

	return (
		<TouchableOpacity style={groupItemStyles.item} onPress={onDeleteUser}>
			<View style={[groupItemStyles.row, { maxWidth: '100%' }]}>
				<View style={[groupItemStyles.column, { flex: 1 }]}>
					<UserAvatar
						user={user}
						size="medium"
						style={
							{ borderColor: fill, borderWidth: 1 } // Overlap effect
						}
					/>
					<Text style={groupItemStyles.fullname} numberOfLines={1}>
						{user.fullname}
					</Text>
					<View style={{ backgroundColor: 'transparent' }}>
						<Feather name="slash" size={18} color={outlines} />
					</View>
				</View>
			</View>
		</TouchableOpacity>
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

function ConfirmDeleteModal(fullname: string, dismiss: (key: number) => void, onDelete: () => void) {
	return (
		<AroModal
			title={`Are you sure you want to remove ${fullname} from your group?`}
			actionBtnTxt="Remove"
			cancelBtnText="Cancel"
			isCancleBtnDisable={false}
			onActionPress={onDelete}
			onCancelPress={() => dismiss(-1)}
		/>
	)
}

export default function RemoveMember({ navigation, route }: GroupTabScreenProps<'GroupSummary'>) {
	const groupId = route.params.groupId
	const { data, refetch, isLoading, isFetching } = useGroupMembers(groupId)
	const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
	const [deleteIndex, setDeleteIndex] = useState(-1)
	const isFocused = useIsFocused()
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
	if (data?.length === 0) return <EmptyUserPrompt onPress={() => navigation.goBack()} />

	async function toggleConfirmDelete(key: number) {
		setDeleteModalVisible(!isDeleteModalVisible)
		setDeleteIndex(key)
	}
	async function onDelete() {
		if (deleteIndex > -1) {
			setDeleteModalVisible(!isDeleteModalVisible)

			if (data != null) {
				const user = data[deleteIndex]
				await removeGroupMember(user.groupId, user.userid)
				refetch()
			}
		}
	}

	return (
		<View style={styles.container}>
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
						return (
							<UserItem
								user={u}
								rowIndex={i}
								key={i}
								toggleConfirmDelete={(index: number) => toggleConfirmDelete(index)}
							/>
						)
					})}
			</ScrollView>
			{isDeleteModalVisible && data && ConfirmDeleteModal(data[deleteIndex].fullname, toggleConfirmDelete, onDelete)}
			<View style={[SharedStyles.glowTop, { zIndex: -1 }]} />
		</View>
	)
}

const width = '90%'

const styles = StyleSheet.create({
	input: {
		width,
		backgroundColor: fill,
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		color: 'white'
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: '30%'
	},
	title: {
		marginTop: 300,
		fontSize: 13,
		marginBottom: 10
	},
	button: {
		marginTop: 'auto',
		marginBottom: 50,
		width
	}
})
