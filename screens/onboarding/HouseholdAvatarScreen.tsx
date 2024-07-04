import React, { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View } from '../../components/Themed'
import { OnboardingTabScreenProps } from '../../types'
import SharedStyles from '../../constants/Styles'
import { HeaderText } from '../../components/StyledText'
import { useUser } from '../../core/services/user'
import UserAvatar from '../../components/UserAvatar'
import OrangeButton from '../../components/OrangeButton'
import WhiteButton from '../../components/WhiteButton'
import { usePhotoUpload } from '../../components/usePhotoUpload'
import Loading from '../../components/Loading'
import AroTip from '../../components/AroTip'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { update, useGroup } from '../../core/services/group'

export default function HouseholdAvatarScreen({ navigation, route }: OnboardingTabScreenProps<'HouseholdAvatar'>) {
	const { showActionSheetWithOptions } = useActionSheet()
	const [hasSelectedPhoto, setHasSelectedPhoto] = useState(false)
	const { data } = useUser()
	const { data: groupData, refetch, isFetching, isRefetching, isLoading } = useGroup(data?.householdGroupId ?? '')

	const onPhotoSelectCallback = useCallback(() => {
		refetch()
		setHasSelectedPhoto(true)
	}, [])

	const triggerPhotoUpload = usePhotoUpload(onPhotoSelectCallback)

	if (isFetching || isRefetching || isLoading) return <Loading />

	const next = () => {
		navigation.navigate('SelectRole')
	}

	const showImageMenu = () => {
		let options = ['Select From Library', 'Use Camera', 'Remove Photo', 'Cancel']
		let destructiveButtonIndex = 2
		let cancelButtonIndex = 3
		let disabledButtonIndices = hasSelectedPhoto ? [] : [2]

		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
				destructiveButtonIndex,
				disabledButtonIndices
			},
			(buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						triggerPhotoUpload('select', { photoType: 'household', groupId: data?.householdGroupId ?? '' })
						break
					case 1:
						triggerPhotoUpload('camera', { photoType: 'household', groupId: data?.householdGroupId ?? '' })
						break
					case 2:
						update(data?.householdGroupId ?? '', { avatar: '' }).then(() => refetch()) // Delete the avatar
						break
					default:
						break
				}
			}
		)
	}

	const onLeftPress = () => {
		if (hasSelectedPhoto) {
			showImageMenu()
		} else {
			next()
		}
	}

	const onRightPress = () => {
		if (hasSelectedPhoto) {
			next()
		} else {
			showImageMenu()
		}
	}

	const leftLabel = hasSelectedPhoto ? 'Select' : 'No Thanks'
	const rightLabel = hasSelectedPhoto ? 'Continue' : 'Select'
	const rightIcon = hasSelectedPhoto ? undefined : 'camera'
	const leftIcon = hasSelectedPhoto ? 'camera' : undefined

	return (
		<View style={styles.container}>
			{/* Intro Message */}
			<HeaderText style={styles.title}>Would you like to add a family photo?</HeaderText>

			{/* Group Avatar Image */}
			<UserAvatar
				style={{ marginTop: 'auto', marginBottom: 'auto' }}
				size="xlarge"
				user={{ fullname: groupData?.name ?? '', avatar: groupData?.avatar }}
				useChattTap
			/>

			{/* Explanatory Messaging */}
			<AroTip message="Your family photo will be used to personalize your family center and household progress reports." />

			{/* Action Buttons */}
			<View
				style={{
					width: '90%',
					flexDirection: 'row',
					marginTop: 'auto',
					marginBottom: 60,
					justifyContent: 'space-between'
				}}>
				<WhiteButton title={leftLabel} outterStyle={{ width: '47%' }} icon={leftIcon} onPress={onLeftPress} />
				<OrangeButton title={rightLabel} outterStyle={{ width: '47%' }} icon={rightIcon} onPress={onRightPress} />
			</View>

			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		display: 'flex'
	},
	title: {
		marginTop: 'auto',
		fontSize: 25,
		textAlign: 'center',
		marginHorizontal: '10%'
	}
})
