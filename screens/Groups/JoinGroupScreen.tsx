import { StyleSheet, TextInput, Platform, Share } from 'react-native'
import { View, KeyboardAvoidingView, Text } from '../../components/Themed'
import { GroupTabScreenProps } from '../../types'
import SharedStyles from '../../constants/Styles'
import OrangeButton from '../../components/OrangeButton'
import React, { useEffect, useState } from 'react'
import { chattanoogaTapWater, fill } from '../../constants/Colors'
import { HeaderText } from '../../components/StyledText'
import { join } from '../../core/services/group'
import AroModal from '../../components/AroModal'
import { mark } from '../../core/services/achievement'

export default function JoinGroupScreen({ navigation, route }: GroupTabScreenProps<'GroupJoin'>) {
	const [code, setCode] = useState(route.params ? route.params.invite_code : '')
	const [trimmedCode, setTrimmedCode] = useState('')
	const [isGroupModalVisible, setGroupModalVisible] = useState(false)
	const [errorMsg, setErrorMsg] = useState('Invite code not found. Please try again.')

	useEffect(() => {
		setTrimmedCode(code?.trim() ?? '')
	}, [code])

	function GroupJoinModal(dismiss: () => void) {
		return (
			<AroModal
				title={errorMsg}
				actionBtnTxt="Continue"
				cancelBtnText=""
				isCancleBtnDisable={true}
				onActionPress={() => {
					setCode('')
					dismiss()
				}}
				onCancelPress={() => {}}
			/>
		)
	}

	async function next() {
		const result = await join(trimmedCode)

		if (result.data?.id) {
			await mark('join-group')
			navigation.navigate('GroupSummary', { groupId: result.data?.id })
		} else {
			setErrorMsg(result.msg || 'Invite code not found. Please try again.')
			toggleGroupJoinModal()
		}
	}

	function toggleGroupJoinModal() {
		setGroupModalVisible(!isGroupModalVisible)
	}

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<View style={[styles.container, { width: '100%', marginTop: '25%' }]}>
				<HeaderText style={styles.title}>Enter an Invitation Code</HeaderText>
				<Text style={styles.tagline}>Ready to join a group? Enter a code below to find your group.</Text>
			</View>
			<View style={styles.inputGroup}>
				<Text style={{ textAlign: 'center', color: chattanoogaTapWater, paddingBottom: 5 }}>
					Invitation codes are case-sensitive.
				</Text>
				<TextInput
					onChangeText={setCode}
					value={code}
					placeholder="a3Z-Q4d"
					style={styles.input}
					autoFocus={true}
					focusable={true}
					autoCapitalize={'none'}></TextInput>
			</View>
			<OrangeButton disabled={!trimmedCode} onPress={next} outterStyle={styles.button} title="Join Group" />
			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
			{isGroupModalVisible && GroupJoinModal(toggleGroupJoinModal)}
		</KeyboardAvoidingView>
	)
}

const width = '90%'

const styles = StyleSheet.create({
	inputGroup: {
		marginTop: 'auto',
		width
	},
	input: {
		backgroundColor: fill,
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		color: 'white',
		textAlign: 'center',
		fontFamily: 'objektiv-semi-bold',
		marginBottom: 20
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 25,
		marginBottom: 10
	},
	button: {
		marginTop: 'auto',
		marginBottom: 50,
		width
	},
	tagline: {
		fontSize: 18,
		fontWeight: '200',
		width: '75%',
		textAlign: 'center'
	}
})
