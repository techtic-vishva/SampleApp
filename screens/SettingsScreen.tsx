import React, { useState } from 'react'
import { Pressable, ScrollView, Share, StyleSheet, TouchableOpacity } from 'react-native'
import OrangeButton from '../components/OrangeButton'
import { View, Text } from '../components/Themed'
import { SettingsTabScreenProps } from '../types'
import { isActive, signOut, useIsAdmin } from '../core/Authentication'
import SettingGroup from '../components/settings/group'
import SettingItem from '../components/settings/item'
import { dichotomousHippopotamus, fill } from '../constants/Colors'
import { setIsOnboarded } from '../core/GlobalState'
import BaseScreen from './BaseScreen'
import { deleteUser, logout, useUser } from '../core/services/user'
import AroModal from '../components/AroModal'
import { Feather } from '@expo/vector-icons'
import { GlobalState, setNfcToggle } from '../core/GlobalState'

function FirmwareCurrentModal(dismiss: () => void) {
	return (
		<AroModal
			title="Your firmware is up to date!"
			isCancleBtnDisable={true}
			actionBtnTxt="Okay"
			cancelBtnText=""
			onActionPress={dismiss}
			onCancelPress={() => {}}
		/>
	)
}

function ConfirmDeleteModal(dismiss: () => void) {
	async function onDelete() {
		await deleteUser()
		await signOut()
	}

	return (
		<AroModal
			title="Are you sure you want to delete your account?"
			isCancleBtnDisable={false}
			actionBtnTxt="Delete"
			cancelBtnText="Cancel"
			onActionPress={onDelete}
			onCancelPress={dismiss}
		/>
	)
}

export default function SettingsScreen({ navigation }: SettingsTabScreenProps<'SettingsRoot'>) {
	const [isAdmin] = useIsAdmin()
	const [isFirmwareCurrent, setIsFirmwareCurrent] = useState(true)
	const [showConfirmDelete, setShowConfirmDelete] = useState(false)
	const [nfcSwitchValue, setNfcSwitchValue] = useState(GlobalState.nfc.toggle)
	const { data } = useUser()

	function goToWeb(title: string, uri: string) {
		return function () {
			navigation.navigate('WebViewModal', { title, uri })
		}
	}

	function toggleFirmwareCurrent() {
		setIsFirmwareCurrent(!isFirmwareCurrent)
	}

	async function checkFirmware() {
		// todo: check if current
		toggleFirmwareCurrent()
	}

	//logout

	async function onLogout() {
		logout().then(() => {
			signOut()
			setIsOnboarded(false, true)
		})
	}

	async function toggleConfirmDelete() {
		setShowConfirmDelete(!showConfirmDelete)
	}

	function onReferPress() {
		navigation.navigate('ReferFriend')
	}

	async function refreshToken() {
		await isActive(true)
	}

	async function toggleNfc(toggle: boolean) {
		setNfcSwitchValue(toggle)
		setNfcToggle(toggle)
	}

	return (
		<BaseScreen>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.container}>
					{data?.referralInviteCode && (
						<SettingGroup>
							<TouchableOpacity onPress={onReferPress}>
								<View
									style={{
										paddingVertical: 10,
										padding: 10,
										flexDirection: 'row',
										backgroundColor: fill,
										justifyContent: 'space-between',
										alignItems: 'center'
									}}>
									<View style={{ backgroundColor: 'transparent', flex: 1, marginEnd: 5 }}>
										<Text style={{ color: dichotomousHippopotamus, fontSize: 17, fontFamily: 'objektiv-md' }}>
											Refer a Friend
										</Text>
										<Text style={{ color: 'white', fontSize: 12, fontFamily: 'objektiv', marginTop: 5 }}>
											Get 1 month of Aro membership free for each friend you refer.
										</Text>
									</View>

									<Feather size={24} name="users" color={'white'} />
								</View>
							</TouchableOpacity>
						</SettingGroup>
					)}
					<SettingGroup>
						<SettingItem label="Account Information" onClick={() => navigation.navigate('AccountInfo')} />
						{/* <SettingItem label="Motivation" onClick={() => navigation.navigate('Motivation')} /> */}
						<SettingItem last label="Custom Tags" onClick={() => navigation.navigate('CustomTagsList')} />
						{/* <SettingItem label='Box Configuration' last /> */}
					</SettingGroup>
					{GlobalState.nfc.enable && (
						<SettingGroup>
							<SettingItem label="NFC Mode" switchMode switchValue={nfcSwitchValue} onSwitchChange={toggleNfc} last />
						</SettingGroup>
					)}
					<SettingGroup>
						<SettingItem label="Check for Firmware Update" onClick={checkFirmware} />
						<SettingItem label="Support" onClick={goToWeb('Support', 'https://support.goaro.com')} />
						<SettingItem
							label="Terms &amp; Conditions"
							onClick={goToWeb('Terms & Conditions', 'https://support.goaro.com/hc/en-us/articles/5758982648724')}
						/>
						<SettingItem
							label="Privacy Policy"
							last
							onClick={goToWeb('Privacy Policy', 'https://support.goaro.com/hc/en-us/articles/5861819570964')}
						/>
					</SettingGroup>
					<OrangeButton outterStyle={{ width: '100%' }} title="Logout" onPress={onLogout} />
					<Pressable onPress={toggleConfirmDelete} onLongPress={refreshToken}>
						<Text style={{ padding: 10, textDecorationLine: 'underline', opacity: 0.8 }}>Delete Account</Text>
					</Pressable>
					{isAdmin && (
						<SettingGroup isDev>
							<SettingItem last label="Admin Settings" onClick={() => navigation.navigate('AdminSettings')} />
						</SettingGroup>
					)}
					{!isFirmwareCurrent && FirmwareCurrentModal(toggleFirmwareCurrent)}
					{showConfirmDelete && ConfirmDeleteModal(toggleConfirmDelete)}
				</View>
			</ScrollView>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		padding: 20,
		paddingTop: 30
	}
})
