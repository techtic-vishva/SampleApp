import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { HeaderText } from '../../components/StyledText'
import { Text, View } from '../../components/Themed'
import { fill, dichotomousHippopotamus } from '../../constants/Colors'
import { OnboardingTabScreenProps } from '../../types'
import SharedStyles from '../../constants/Styles'
import { update } from '../../core/services/user'
import { useState } from 'react'
import AroTip from '../../components/AroTip'
import OrangeButton from '../../components/OrangeButton'

function Option({
	item,
	isSelected,
	onToggle
}: {
	item: { value: string; label: string }
	isSelected: boolean
	onToggle: (value: string) => void
}) {
	return (
		<TouchableOpacity
			key={item.value}
			onPress={() => onToggle(item.value)}
			style={[
				styles.itemContainer,
				isSelected
					? {
							shadowColor: dichotomousHippopotamus,
							shadowOpacity: 0.9,
							shadowRadius: 4,
							shadowOffset: {
								height: 0,
								width: 0
							}
					  }
					: {}
			]}>
			<HeaderText style={{ textAlign: 'center', fontSize: 18, color: isSelected ? dichotomousHippopotamus : 'white' }}>
				{item.label}
			</HeaderText>
		</TouchableOpacity>
	)
}

export default function OtherHouseholdMembersInviteScreen({
	navigation
}: OnboardingTabScreenProps<'OtherHouseholdMembersInvite'>) {
	const [selected, setSelected] = useState<string[]>()

	const onSendInvites = async () => {
		await update({ metadata: { additionalHouseholdMembers: selected ?? [] } })
		navigation.navigate('QrCode')
	}

	const toggleOption = (option: string) => {
		const selectedSet = new Set(selected)
		const isSelected = selectedSet.has(option)

		if (isSelected) {
			selectedSet.delete(option)
		} else {
			selectedSet.add(option)
		}

		setSelected(Array.from(selectedSet))
	}

	const data = [
		{ value: 'kids-no-phones', label: 'Kids without phones' },
		{ value: 'kids-trainer-devices', label: 'Kids with trainer phones (Gabb, Light Phone, etc.)' },
		{ value: 'kids-with-phones', label: 'Kids with phones' },
		{ value: 'n-a', label: 'None of the above' }
	]

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={{ width: '90%', alignItems: 'center', marginBottom: 30 }}>
				<HeaderText style={{ fontSize: 22, paddingBottom: 15 }}>Anyone else?</HeaderText>
				<Text
					style={{
						textAlign: 'center',
						fontFamily: 'objektiv',
						fontSize: 16
					}}>
					Do you have other members without smartphones? Select all that apply.
				</Text>
			</View>

			{/* Member Options */}
			<ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
				{data.map((item, i) => (
					<Option
						key={item.value}
						item={item}
						onToggle={toggleOption}
						isSelected={(selected && selected.includes(item.value)) || false}
					/>
				))}
			</ScrollView>

			{/* Tip */}
			<View style={{ width: '100%', alignItems: 'center' }}>
				<AroTip message={`This information will help Aro tailor the experience to your household.`} />
			</View>

			<OrangeButton
				onPress={onSendInvites}
				outterStyle={{ width: '90%', marginBottom: 60 }}
				title="Send Invites"
				icon="arrow-right"
			/>
			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</View>
	)
}

const width = '90%'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 100,
		justifyContent: 'space-between'
	},
	title: {
		fontSize: 25,
		marginBottom: 10,
		textAlign: 'center'
	},
	itemContainer: {
		display: 'flex',
		padding: 18,
		marginVertical: 10,
		backgroundColor: fill,
		borderRadius: 15,
		width: width,
		maxWidth: width,
		minWidth: width,
		alignItems: 'center',
		justifyContent: 'center'
	}
})
