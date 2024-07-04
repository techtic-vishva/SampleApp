import { StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Text, View } from '../../components/Themed'
import { OnboardingTabScreenProps } from '../../types'
import SharedStyles from '../../constants/Styles'
import { ReactElement, useState } from 'react'
import { HeaderText } from '../../components/StyledText'
import { chattanoogaTapWater, fill } from '../../constants/Colors'
import OrangeButton from '../../components/OrangeButton'
import BaseScreen from '../BaseScreen'
import { houseHoldInvite, useUser } from '../../core/services/user'
import WhiteButton from '../../components/WhiteButton'
import Roles from '../../constants/Roles'
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated'
import { codeToRole, UserInviteForm } from '../../components/UserInviteForm'

const PageHeader = (): ReactElement<any, any> => {
	return (
		<View style={[styles.container, { flex: 0, width: '80%', paddingTop: 80, paddingBottom: 30 }]}>
			<HeaderText style={{ fontSize: 22, paddingBottom: 15 }}>Let's invite your family.</HeaderText>
			<Text
				style={{
					textAlign: 'center',
					fontFamily: 'objektiv',
					fontSize: 16
				}}>
				We'll send an invite to your family to join your Aro household.
			</Text>
		</View>
	)
}

export default function WizardScreen({ navigation }: OnboardingTabScreenProps<'FamilyInvite'>) {
	const { data: user } = useUser()
	const [userList, setUserList] = useState([{ name: user?.fullname, role: user?.metadata?.role, email: user?.email }])
	const [isAddScreenVisible, setIsAddScreenVisible] = useState(true)
	const [editIndex, setEditIndex] = useState('')

	const findSelectedRole = (index: number) => {
		var index = Roles.findIndex(function (role) {
			return role.value == userList[index].role
		})
		return index
	}

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [selected, setSelected] = useState<{ label?: string; value?: string }>({})

	const reset = () => {
		setIsAddScreenVisible(!isAddScreenVisible)
		setName('')
		setEmail('')
		setSelected({})
		setEditIndex('')
	}

	const onAdd = () => {
		if (!name || !selected?.value || !email) return

		const newEntry = { name: name, role: selected.value, email: email }

		if (editIndex) {
			userList[parseInt(editIndex, 10)] = newEntry
			setUserList([...userList])
		} else {
			setUserList([...userList, newEntry])
		}

		reset()
	}

	const onContinue = async () => {
		const users = userList.filter(
			(i) =>
				i.email != user?.email &&
				typeof i.email === 'string' &&
				typeof i.name === 'string' &&
				typeof i.role === 'string'
		) as { name: string; role: string; email: string }[]

		await houseHoldInvite(users, 'onboarding')
		navigation.navigate('OtherHouseholdMembersInvite')

	}

	const onFormChange = ({ name, email, role }: { name?: string; email?: string; role?: string }) => {
		if (typeof name === 'string') setName(name)
		if (typeof email === 'string') setEmail(email)
		if (typeof role === 'string') setSelected({ value: role, label: codeToRole(role)?.value })
	}

	return (
		<Animated.View
			style={styles.container}
			key={isAddScreenVisible ? 1 : 0}
			entering={SlideInRight}
			exiting={SlideOutLeft}>
			{isAddScreenVisible ? (
				<BaseScreen>
					<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
						<View style={styles.container}>
							<PageHeader />

							{/* Input Form */}
							<View style={[{ justifyContent: 'center', marginBottom: 'auto', width: '100%' }]}>
								<UserInviteForm name={name} email={email} role={selected.value} onFormChange={onFormChange} />
							</View>

							{/* Control Buttons */}
							<View
								style={{
									display: 'flex',
									width: '90%',
									flexDirection: 'row',
									marginTop: 'auto',
									marginBottom: 10,
									justifyContent: 'space-around'
								}}>
								<WhiteButton onPress={reset} title="Skip" outterStyle={{ width: '47%' }} />
								<OrangeButton onPress={onAdd} title={editIndex ? 'Save' : 'Add'} outterStyle={{ width: '47%' }} />
							</View>
						</View>
					</KeyboardAvoidingView>
					<View style={[SharedStyles.glowTop, { alignSelf: 'center' }]} />
					<View style={[SharedStyles.glowBottom, { alignSelf: 'center' }]} />
				</BaseScreen>
			) : (
				<View style={styles.container}>
					<PageHeader />
					<ScrollView
						style={{ width: '100%', flex: 1 }}
						contentContainerStyle={[
							{ alignItems: 'center', justifyContent: 'flex-start', marginBottom: 15, flexGrow: 1, paddingBottom: 5 }
						]}>
						<View style={{ width: '90%' }}>
							{userList.map((u, index) => (
								<TouchableOpacity
									disabled={u.email == user?.email}
									onPress={() => {
										setEditIndex(index.toString())
										setName(u.name ?? '')
										setEmail(u.email ?? '')
										setSelected(Roles[findSelectedRole(index)])
										setIsAddScreenVisible(!isAddScreenVisible)
									}}
									key={index}
									style={{
										backgroundColor: fill,
										borderRadius: 15,
										marginBottom: 15,
										paddingHorizontal: 20,
										paddingVertical: 20,
										display: 'flex',
										alignItems: 'center',
										flexDirection: 'column'
									}}>
									<Text style={{ fontSize: 17, fontFamily: 'objektiv-semi-bold' }}>{u.name}</Text>
									<Text
										style={{
											color: chattanoogaTapWater,
											marginTop: 8,
											fontFamily: 'objektiv'
										}}>{`${codeToRole(u.role)?.label} | ${u.email}`}</Text>
								</TouchableOpacity>
							))}
						</View>
						<TouchableOpacity
							onPress={() => {
								setIsAddScreenVisible(!isAddScreenVisible)
							}}
							style={{
								width: '90%',
								backgroundColor: 'white',
								borderRadius: 15,
								marginBottom: 10,
								paddingHorizontal: 20,
								paddingVertical: 20,
								display: 'flex',
								alignItems: 'center',
								flexDirection: 'column'
							}}>
							<Text style={{ fontSize: 17, fontFamily: 'objektiv-semi-bold', color: 'black' }}>Invite Another</Text>
							<Text style={{ color: 'black', fontFamily: 'objektiv', marginTop: 8 }}>
								Tap to add an additional family member
							</Text>
						</TouchableOpacity>
					</ScrollView>

					<OrangeButton
						onPress={onContinue}
						title="Continue"
						icon="arrow-right"
						outterStyle={{ width: '90%', marginTop: 'auto', marginBottom: 40 }}
					/>

					<View style={[SharedStyles.glowTop, { alignSelf: 'center' }]} />
					<View style={[SharedStyles.glowBottom, { alignSelf: 'center' }]} />
				</View>
			)}
		</Animated.View>
	)
}
const width = '90%'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		width: '100%'
	},
	label: {
		width,
		marginBottom: 10,
		color: chattanoogaTapWater
	}
})
