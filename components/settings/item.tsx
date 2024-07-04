import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from '../../components/Themed'
import { Switch, TouchableOpacity } from 'react-native'
import { dichotomousHippopotamus, fill } from '../../constants/Colors'
import DynamicIcon, { IconType } from '../DynamicIcon'

export default function SettingItem({
	label,
	last = false,
	onClick,
	onLongClick,
	disabled,
	switchMode,
	switchValue,
	onSwitchChange,
	leftIcon,
	leftIconType
}: {
	label: string
	last?: boolean
	onClick?: () => any | void
	onLongClick?: () => any | void
	disabled?: boolean
	switchMode?: boolean
	switchValue?: boolean
	onSwitchChange?: (value: boolean) => void
	leftIcon?: string
	leftIconType?: IconType
}) {
	return (
		<View
			style={[
				{
					width: '100%',
					backgroundColor: fill
				},
				last ? {} : { borderBottomColor: 'rgba(255,255,255,0.2)', borderBottomWidth: 1 }
			]}>
			<TouchableOpacity onPress={onClick} onLongPress={onLongClick} disabled={disabled}>
				<View
					style={{
						paddingVertical: 20,
						padding: 10,
						flexDirection: 'row',
						backgroundColor: fill,
						justifyContent: 'space-between',
						alignItems: 'center'
					}}>
					{leftIconType && leftIcon && (
						<DynamicIcon
							name={leftIcon}
							type={leftIconType ?? 'emoji'}
							color={dichotomousHippopotamus}
							size={20}
							style={{ marginRight: 20 }}
						/>
					)}
					<Text
						style={[
							{ fontSize: 16, alignSelf: 'flex-start', flex: 1, fontFamily: 'objektiv-md' },
							disabled ? { opacity: 0.3 } : {}
						]}>
						{label}
					</Text>
					{switchMode !== true && (
						<Feather size={20} style={[{ color: 'white' }, disabled ? { opacity: 0.3 } : {}]} name="arrow-right" />
					)}
					{switchMode && (
						<Switch
							thumbColor={'white'}
							value={switchValue}
							onValueChange={onSwitchChange}
							trackColor={{ true: dichotomousHippopotamus, false: 'grey' }}
						/>
					)}
				</View>
			</TouchableOpacity>
		</View>
	)
}
