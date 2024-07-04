import React from 'react'
import { TouchableOpacity, StyleSheet, GestureResponderEvent, StyleProp, ViewStyle, ColorValue } from 'react-native'
import { darkArts, dichotomousHippopotamus, dichotomousHippopotamusDisabled } from '../constants/Colors'
import { Text } from './Themed'
import { Feather } from '@expo/vector-icons'

export type ButtonProps = {
	title: string
	icon?: React.ComponentProps<typeof Feather>['name']
	outterStyle?: StyleProp<ViewStyle>
	onPress?: (event: GestureResponderEvent) => void
	disabled?: boolean
	iconLeft?: boolean
	onLongPress?: (event: GestureResponderEvent) => void
	textColorOverride?: ColorValue
	iconColorOverride?: ColorValue
}

export default function (props: ButtonProps) {
	return (
		<TouchableOpacity
			disabled={props.disabled ?? false}
			style={[styles.base, props.outterStyle || {}, props.disabled ? styles.disabled : {}]}
			onPress={props.onPress}
			onLongPress={props.onLongPress}>
			{props.icon && props.iconLeft === true && (
				<Feather
					size={20}
					style={styles.icon}
					name={props.icon}
					color={props.iconColorOverride || props.textColorOverride}
				/>
			)}
			<Text style={{ color: props.textColorOverride ?? darkArts, fontSize: 18 }}>{props.title}</Text>
			{props.icon && props.iconLeft !== true && (
				<Feather
					size={20}
					style={[styles.icon]}
					color={props.iconColorOverride || props.textColorOverride}
					name={props.icon}
				/>
			)}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	base: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: dichotomousHippopotamus,
		paddingVertical: 12,
		paddingHorizontal: 30,
		width: '50%',
		borderColor: dichotomousHippopotamus,
		borderRadius: 10,
		borderWidth: 1
	},
	icon: {
		paddingHorizontal: 10
	},
	disabled: {
		backgroundColor: dichotomousHippopotamusDisabled,
		borderColor: dichotomousHippopotamusDisabled
	}
})
