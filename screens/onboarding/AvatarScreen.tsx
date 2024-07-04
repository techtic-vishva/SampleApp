import React, { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View } from '../../components/Themed'
import { OnboardingTabScreenProps } from '../../types'
import SharedStyles from '../../constants/Styles'
import { HeaderText } from '../../components/StyledText'
import { update, useUser } from '../../core/services/user'
import UserAvatar from '../../components/UserAvatar'
import OrangeButton from '../../components/OrangeButton'
import WhiteButton from '../../components/WhiteButton'
import { usePhotoUpload } from '../../components/usePhotoUpload'
import Loading from '../../components/Loading'
import AroTip from '../../components/AroTip'
import { useActionSheet } from '@expo/react-native-action-sheet'

export default function AvatarScreen({ navigation, route }: OnboardingTabScreenProps<'AvatarScreen'>) {
	const { showActionSheetWithOptions } = useActionSheet()
	const [hasSelectedPhoto, setHasSelectedPhoto] = useState(false)
	const { data, isLoading, isFetching, refetch, isRefetching } = useUser()

	const onPhotoSelectCallback = useCallback(() => {
		refetch()
		setHasSelectedPhoto(true)
	}, [])

	const triggerPhotoUpload = usePhotoUpload(onPhotoSelectCallback)

	if (isFetching || isRefetching || isLoading) return <Loading />

	const next = () => {
		if (data?.userRole === 'Owner') {
			// Owner, setup house
			navigation.navigate('HouseholdSetupScreen')
		} else if (!data?.metadata?.role) {
			// Self-join, no-role, setup role
			navigation.navigate('SelectRole', { skipToSurvey: true })
		} else {
			// Invited, go to survey
			navigation.navigate('SurveyPreviewScreen')
		}
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
						triggerPhotoUpload('select')
						break
					case 1:
						triggerPhotoUpload('camera')
						break
					case 2:
						update({ avatar: '' }).then(() => refetch()) // Delete the avatar
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
			<HeaderText style={styles.title}>
				Hi {data?.fullname?.split(' ')?.shift()}! Would you like to add a photo?
			</HeaderText>

			{/* User Avatar Image */}
			<UserAvatar
				style={{ marginTop: 'auto', marginBottom: 'auto' }}
				size="xlarge"
				user={{ fullname: data?.fullname ?? '', avatar: data?.avatar }}
			/>

			{/* Explanatory Messaging */}
			<AroTip message="Your photo will be used to personalize your Aro experience and is displayed to your family members." />

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
