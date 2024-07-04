import { TextInput, Pressable, Linking, StyleSheet } from 'react-native'
import { Text, View } from './Themed'
import { useRef, useState } from 'react'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import { chattanoogaTapWater, dichotomousHippopotamus, fill } from '../constants/Colors'
import Roles from '../constants/Roles'
import { Dropdown } from './Dropdown'

export type OnChangeHandler = ({ name, email, role }: { name?: string; email?: string; role?: string }) => void

export const codeToRole = (code: string) => {
	const role = Roles.find((role) => role.value === code)
	return role
}

export function UserInviteForm({
	name,
	email,
	role,
	onFormChange
}: {
	name?: string
	email?: string
	role?: string
	onFormChange: OnChangeHandler
}) {
	const [dropdownToggle, setToggle] = useState(0)
	const nameRef = useRef<TextInput>(null)
	const emailRef = useRef<TextInput>(null)
	const roleEntry = codeToRole(role || '')

	return (
		<>
			<View style={[styles.fieldWithIcon]}>
				<FontAwesome5 name="signature" color={dichotomousHippopotamus} size={18} />
				<TextInput
					ref={nameRef}
					onChangeText={(newName) => onFormChange({ name: newName })}
					value={name}
					placeholder="Full Name"
					style={[styles.input, { marginLeft: 15 }]}
					autoFocus={true}
					focusable={true}
					placeholderTextColor={'grey'}
					onSubmitEditing={(event) => {
						event && emailRef.current?.focus()
					}}
					blurOnSubmit={false}
					returnKeyType="next"
				/>
			</View>

			<View style={[styles.fieldWithIcon]}>
				<Feather name="mail" color={dichotomousHippopotamus} size={18} />
				<TextInput
					ref={emailRef}
					onChangeText={(newEmail) => onFormChange({ email: newEmail })}
					value={email}
					placeholder="Email Address"
					style={[styles.input, { marginLeft: 19 }]}
					autoComplete="email"
					autoCapitalize="none"
					keyboardType="email-address"
					placeholderTextColor={'grey'}
					onSubmitEditing={(event) => {
						email && email.length && event && setToggle(dropdownToggle + 1)
					}}
					returnKeyType="next"
				/>
			</View>

			<View style={[styles.fieldWithIcon]}>
				<Feather name="users" color={dichotomousHippopotamus} size={18} />
				<View style={[styles.input, { marginLeft: 19 }]}>
					<Dropdown
						label={roleEntry?.label || 'Role'}
						data={Roles}
						onSelect={(item) => {
							emailRef.current?.blur()
							onFormChange({ role: item.value })
						}}
						isSelected={role ? true : false}
						toggle={dropdownToggle}
					/>
				</View>
			</View>

			<View>
				{role == 'child' && (
					<Pressable
						onPress={() => {
							Linking.openURL('https://support.goaro.com/hc/en-us/articles/5861819570964')
						}}>
						<Text
							style={{ textAlign: 'center', paddingHorizontal: '7%', color: chattanoogaTapWater }}
							numberOfLines={2}
							adjustsFontSizeToFit>
							By inviting your child, you are consenting to their access of the platform in accordance with the Aro
							Privacy Policy .
						</Text>
					</Pressable>
				)}
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	fieldWithIcon: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: fill,
		paddingVertical: 14,
		paddingHorizontal: 14,
		borderRadius: 10,
		marginBottom: 10,
		marginHorizontal: 15
	},
	input: {
		width: '90%',
		backgroundColor: fill,
		fontSize: 15,
		color: 'white',
		textAlign: 'left'
	}
})
