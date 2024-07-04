import { StyleSheet, TouchableOpacity } from 'react-native'
import { HeaderText } from '../../components/StyledText'
import { View } from '../../components/Themed'
import { fill } from '../../constants/Colors'
import { OnboardingTabScreenProps } from '../../types'
import SharedStyles from '../../constants/Styles'
import Roles, { Role } from '../../constants/Roles'
import { update, useUser } from '../../core/services/user'

export default function RoleSelectScreen({ navigation, route }: OnboardingTabScreenProps<'SelectRole'>) {
	const { refetch } = useUser()

	async function onRolePress(item: Role) {
		await update({ metadata: { role: item.value } })
		await refetch()
		await navigation.navigate(route?.params?.skipToSurvey ? 'SurveyPreviewScreen' : 'FamilyInvite')
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={{ width: '90%', alignItems: 'center', marginBottom: 30 }}>
				<HeaderText style={styles.title}>How would you describe your role in the household?</HeaderText>
			</View>

			{/* Role Options */}
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
				{Roles.map((item, i) => {
					return (
						<TouchableOpacity key={i} style={[styles.goalContainer]} onPress={() => onRolePress(item)}>
							<HeaderText style={{ textAlign: 'center', fontSize: 18 }}>{item.label}</HeaderText>
						</TouchableOpacity>
					)
				})}
			</View>

			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</View>
	)
}

const roleWidth = '90%'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 100
	},
	title: {
		fontSize: 25,
		marginBottom: 10,
		textAlign: 'center'
	},
	goalContainer: {
		display: 'flex',
		padding: 18,
		marginVertical: 10,
		backgroundColor: fill,
		borderRadius: 15,
		width: roleWidth,
		maxWidth: roleWidth,
		minWidth: roleWidth,
		alignItems: 'center',
		justifyContent: 'center'
	}
})
