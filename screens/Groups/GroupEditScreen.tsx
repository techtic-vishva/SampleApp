import { StyleSheet } from 'react-native'
import { View } from '../../components/Themed'
import { GroupTabScreenProps } from '../../types'
import React, { useEffect, useState } from 'react'
import { fill } from '../../constants/Colors'
import { deleteGroup, leave, useGroup } from '../../core/services/group'
import SettingGroup from '../../components/settings/group'
import SettingItem from '../../components/settings/item'
import OrangeButton from '../../components/OrangeButton'
import SharedStyles from '../../constants/Styles'
import { useUser } from '../../core/services/user'
import { useIsFocused } from '@react-navigation/native'
import AroModal from '../../components/AroModal'

export default function GroupEditScreen({ navigation, route }: GroupTabScreenProps<'GroupEdit'>) {
	const groupId = route.params.groupId
	const { data, refetch, isLoading } = useGroup(groupId)
	const { data: user } = useUser()
	const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
	const [isLeaveModalVisible, setLeaveModalVisible] = useState(false)
	const isFocused = useIsFocused()

	useEffect(() => {
		if (isFocused) refetch()
	}, [isFocused])

	useEffect(() => {
		navigation.setOptions({ title: data?.name })
	}, [data])

	async function onDeleteGroup() {
		await deleteGroup(groupId)
		navigation.navigate('Root', {})
	}

	async function onLeaveGroup() {
		await leave(groupId)
		navigation.navigate('Root', {})
	}

	async function onInvite() {
		navigation.navigate('GroupInvite', { groupId })
	}

	async function onEditGroupName() {
		navigation.navigate('EditGroupName', {
			groupId,
			name: data?.name
		})
	}

	async function onEditGroupPhoto() {
		navigation.navigate('EditGroupPhoto', { groupId })
	}

	async function onRemoveMember() {
		navigation.navigate('RemoveMember', { groupId })
	}

	async function onManageNotification() {
		navigation.navigate('ManageNotifications', { groupId })
	}

	async function toggleConfirmDelete() {
		setDeleteModalVisible(!isDeleteModalVisible)
	}

	async function toggleConfirmLeave() {
		setLeaveModalVisible(!isLeaveModalVisible)
	}

	function ConfirmDeleteModal(dismiss: () => void) {
		async function onDelete() {
			await onDeleteGroup()
		}

		return (
			<AroModal
				title="Are you sure you want to delete your group?"
				actionBtnTxt="Delete"
				cancelBtnText="Cancel"
				onActionPress={onDelete}
				onCancelPress={dismiss}
				isCancleBtnDisable={false}
			/>
		)
	}

	function ConfirmLeaveModal(dismiss: () => void) {
		async function onLeave() {
			await onLeaveGroup()
		}

		return (
			<AroModal
				title="	Are you sure you want to leave your group?"
				actionBtnTxt="Leave"
				cancelBtnText="Cancel"
				onActionPress={onLeave}
				onCancelPress={dismiss}
				isCancleBtnDisable={false}
			/>
		)
	}

	return (
		<View style={styles.container}>
			<View style={{ width: '90%' }}>
				<SettingGroup>
					<SettingItem
						leftIcon="edit-3"
						leftIconType="feather"
						label="Edit Name"
						disabled={user?.userid != data?.creator}
						onClick={onEditGroupName}
					/>
					<SettingItem
						leftIcon="camera"
						leftIconType="feather"
						label="Edit Photo"
						last
						disabled={user?.userid != data?.creator}
						onClick={onEditGroupPhoto}
					/>
				</SettingGroup>
				<SettingGroup>
					<SettingItem leftIcon="user-plus" leftIconType="feather" label="Invite Member" onClick={onInvite} />
					<SettingItem
						leftIcon="user-minus"
						leftIconType="feather"
						label="Remove Member"
						last
						disabled={user?.userid != data?.creator}
						onClick={onRemoveMember}
					/>
				</SettingGroup>
				{data?.type === 'household' && (
					<SettingGroup>
						<SettingItem
							leftIcon="bell"
							leftIconType="feather"
							label="Manage Notifications"
							last
							onClick={onManageNotification}
						/>
					</SettingGroup>
				)}
			</View>
			{data?.type !== 'household' && (
				<OrangeButton
					title="Leave Group"
					outterStyle={[styles.button]}
					disabled={user?.userid === data?.creator}
					onPress={toggleConfirmLeave}
				/>
			)}
			{data?.type !== 'household' && user?.userid === data?.creator && (
				<OrangeButton
					title="Delete Group"
					outterStyle={[styles.button, { backgroundColor: 'transparent', borderColor: 'white' }]}
					textColorOverride={'white'}
					onPress={toggleConfirmDelete}
				/>
			)}
			{isDeleteModalVisible && ConfirmDeleteModal(toggleConfirmDelete)}
			{isLeaveModalVisible && ConfirmLeaveModal(toggleConfirmLeave)}

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
		justifyContent: 'center'
	},
	title: {
		marginTop: 300,
		fontSize: 13,
		marginBottom: 10
	},
	button: {
		width,
		marginBottom: 30
	}
})
