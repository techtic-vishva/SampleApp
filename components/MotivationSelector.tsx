import { StyleSheet, TouchableOpacity } from 'react-native'
import { HeaderText } from './StyledText'
import { View, Text } from './Themed'
import SharedStyles from '../constants/Styles'
import { chattanoogaTapWater, dichotomousHippopotamus, fill } from '../constants/Colors'
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { useUser } from '../core/services/user'

type motivation = {
	id: string
	description: string
	feather?: React.ComponentProps<typeof Feather>['name']
	materialIcon?: React.ComponentProps<typeof MaterialIcons>['name']
	ionicons?: React.ComponentProps<typeof Ionicons>['name']
	fontAwesome?: React.ComponentProps<typeof FontAwesome5>['name']
}

const motivations: motivation[] = [
	{
		id: 'present-family',
		description: 'Be more present with family',
		ionicons: 'ios-people-circle-sharp'
	},
	{
		id: 'focus-work',
		description: 'Focus on work',
		feather: 'zap'
	},
	{
		id: 'kid-habits',
		description: 'Help my kids develop better phone habits',
		fontAwesome: 'child'
	},
	{
		id: 'sleep',
		description: 'Sleep without my phone',
		materialIcon: 'bedtime'
	},
	{
		id: 'friend-connect',
		description: 'Develop better connections with my friends',
		feather: 'minimize-2'
	},
	{
		id: 'me-time',
		description: 'Have some "me time" away from my phone',
		feather: 'user'
	}
]

function Motivation(
	details: motivation,
	selected: string[],
	setSelected: React.Dispatch<React.SetStateAction<string[] | undefined>>,
	onChange: (persona: string[]) => void
) {
	const selectedSet = new Set(selected)
	const isSelected = selectedSet.has(details.id)

	function onPress() {
		const finalSet = new Set(selectedSet)
		if (isSelected) {
			finalSet.delete(details.id)
		} else {
			finalSet.add(details.id)
		}

		const persona = Array.from(finalSet)
		setSelected(persona)
		onChange(persona)
	}

	return (
		<TouchableOpacity
			key={details.id}
			onPress={onPress}
			style={[styles.motivationContainer, isSelected ? styles.selectedMotivation : {}]}>
			<View style={[styles.motivationIcon, isSelected ? styles.selectedMotivation : {}]}>
				<Feather size={18} name={isSelected ? 'check-circle' : 'circle'} color={chattanoogaTapWater} />
			</View>
			<View
				style={[
					{ backgroundColor: fill, flex: 1, paddingHorizontal: 15 },
					isSelected ? styles.selectedMotivation : {}
				]}>
				<Text style={[isSelected ? styles.selectedMotivation : {}]}>{details.description}</Text>
			</View>
			<View style={[styles.motivationIcon, isSelected ? styles.selectedMotivation : {}]}>
				{details.feather && <Feather size={22} style={styles.icon} name={details.feather}></Feather>}
				{details.materialIcon && (
					<MaterialIcons size={22} style={styles.icon} name={details.materialIcon}></MaterialIcons>
				)}
				{details.ionicons && <Ionicons size={22} style={styles.icon} name={details.ionicons}></Ionicons>}
				{details.fontAwesome && <FontAwesome5 size={22} style={styles.icon} name={details.fontAwesome}></FontAwesome5>}
			</View>
		</TouchableOpacity>
	)
}

export default function MotivationSelector({
	children,
	onChange
}: {
	children: React.ReactChild[] | React.ReactChild
	onChange: (persona: string[]) => void
}) {
	const [selected, setSelected] = useState<string[]>()
	const { data, isSuccess } = useUser()

	useEffect(() => {
		const persona = data?.persona || []

		setSelected(persona)
		onChange(persona)
	}, [data, isSuccess])

	return (
		<View style={[styles.container]}>
			<View
				style={{
					width: '100%',
					alignItems: 'center',
					flex: 1,
					display: 'flex',
					justifyContent: 'space-around'
				}}>
				<HeaderText style={styles.title}>Select Motivations</HeaderText>
				<Text style={{ fontSize: 16, width: '90%', textAlign: 'center' }}>
					What would you like Aro to help you achieve? Select all that apply.
				</Text>

				<View style={{ marginVertical: 10 }}>
					{motivations.map((md) => Motivation(md, selected || [], setSelected, onChange))}
				</View>
			</View>

			{children}

			<View style={SharedStyles.glowTop} />
			<View style={SharedStyles.glowBottom} />
		</View>
	)
}

const width = '90%'

const styles = StyleSheet.create({
	selectedMotivation: {
		backgroundColor: 'white',
		color: fill
	},
	icon: {
		color: dichotomousHippopotamus
	},
	motivationContainer: {
		display: 'flex',
		flexDirection: 'row',
		padding: 18,
		marginVertical: 5,
		backgroundColor: fill,
		borderRadius: 20,
		width,
		alignItems: 'center'
	},
	motivationIcon: {
		paddingHorizontal: 10,
		backgroundColor: fill
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 40
	},
	title: {
		fontSize: 25,
		marginBottom: 10
	}
})
