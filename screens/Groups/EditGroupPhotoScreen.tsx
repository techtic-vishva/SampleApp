import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { GroupTabScreenProps } from '../../types'
import { View } from '../../components/Themed'
import { useGroup } from '../../core/services/group'
import { Feather } from '@expo/vector-icons'
import { MenuView } from '@react-native-menu/menu'
import { usePhotoUpload } from '../../components/usePhotoUpload'
import UserAvatar from '../../components/UserAvatar'

export default function EditGroupPhotoScreen({ navigation, route }: GroupTabScreenProps<'EditGroupPhoto'>) {
	const { data: groupData, refetch, isFetching, isRefetching, isLoading } = useGroup(route.params?.groupId)
	const triggerPhotoUpload = usePhotoUpload(refetch)

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<MenuView
					onPressAction={async ({ nativeEvent }) => {
						if (nativeEvent.event === 'select' || nativeEvent.event === 'camera') {
							triggerPhotoUpload(nativeEvent.event, { photoType: 'household', groupId: route.params.groupId })
						}
					}}
					actions={[
						{
							id: 'select',
							title: 'Select From Library',
							image: 'photo.on.rectangle'
						},
						{
							id: 'camera',
							title: 'Use Camera',
							image: 'camera'
						}
					]}
					shouldOpenOnLongPress={false}>
					<Feather name="edit" color="white" size={20} style={{ marginRight: 15 }} />
				</MenuView>
			)
		})
	}, [])
	return (
		<View style={style.container}>
			<UserAvatar size="xlarge" useChattTap user={{ fullname: groupData?.name ?? '', avatar: groupData?.avatar }} />
		</View>
	)
}

const style = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		marginTop: '30%',
		paddingTop: 90
	}
})
