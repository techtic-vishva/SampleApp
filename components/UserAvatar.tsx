import { Feather } from '@expo/vector-icons'
import React from 'react'
import { StyleProp, ViewStyle, Image } from 'react-native'
import { chattanoogaTapWater, dichotomousHippopotamus } from '../constants/Colors'
import { View, Text } from './Themed'

function initials(fullName: string) {
	if (!fullName || fullName.length === 0) return ''

	return fullName
		.split(' ')
		.map((p) => p[0] || '')
		.map((p) => p.toUpperCase())
		.slice(0, 2)
		.join('')
}

type AvatarUser = {
	fullname: string
	avatar?: string
}

function hex2(c: number) {
	c = Math.round(c)
	if (c < 0) c = 0
	if (c > 255) c = 255

	var s = c.toString(16)
	if (s.length < 2) s = '0' + s

	return s
}

function color(r: number, g: number, b: number) {
	return '#' + hex2(r) + hex2(g) + hex2(b)
}

function shade(col: string, light: number) {
	light = light > 0 ? Math.min(light, 0.5) : Math.max(-0.5, light)

	// TODO: Assert that col is good and that -1 < light < 1

	var r = parseInt(col.substr(1, 2), 16)
	var g = parseInt(col.substr(3, 2), 16)
	var b = parseInt(col.substr(5, 2), 16)

	if (light < 0) {
		r = (1 + light) * r
		g = (1 + light) * g
		b = (1 + light) * b
	} else {
		r = (1 - light) * r + light * 255
		g = (1 - light) * g + light * 255
		b = (1 - light) * b + light * 255
	}

	return color(r, g, b)
}

export default function UserAvatar({
	user,
	style,
	size,
	shadeCounter,
	useChattTap
}: {
	user: AvatarUser
	style?: StyleProp<ViewStyle>
	size?: 'xlarge' | 'large' | 'medium' | 'small'
	shadeCounter?: number
	useChattTap?: boolean
}) {
	useChattTap = typeof useChattTap === 'boolean' ? useChattTap : false
	size = size || 'large'
	const scale = size === 'small' ? 23 : size === 'medium' ? 34 : size === 'large' ? 100 : 150
	const imageSize = size === 'small' ? 21 : size === 'medium' ? 34 : size === 'large' ? 100 : 200
	const color = useChattTap ? chattanoogaTapWater : dichotomousHippopotamus

	const shadow =
		size !== 'large' && size !== 'xlarge'
			? {}
			: {
					shadowColor: color,
					shadowOpacity: 0.9,
					shadowRadius: 30,
					shadowOffset: {
						height: 0,
						width: 0
					}
			  }

	const font =
		size === 'large' || size === 'xlarge'
			? { fontSize: size === 'large' ? 30 : 40, fontFamily: 'objektiv-semi-bold' }
			: size === 'medium'
			? { fontSize: 14, fontFamily: 'objektiv-md' }
			: { fontSize: 8, fontFamily: 'objektiv-md' }

	if (user?.avatar)
		return (
			<View
				style={[
					{
						width: imageSize,
						height: imageSize,
						backgroundColor: 'transparent',
						borderRadius: 50,
						...shadow
					},
					style || {}
				]}>
				<Image
					source={{ uri: user.avatar, width: imageSize, height: imageSize, cache: 'force-cache' }}
					resizeMode={'cover'}
					style={[{ borderRadius: imageSize / 2 }]}
				/>
			</View>
		)

	return (
		<View
			style={[
				{
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: shadeCounter ? shade(color, shadeCounter * 0.03) : color,
					width: scale,
					height: scale,
					borderRadius: imageSize / 2,
					...shadow
				},
				style || {}
			]}>
			{typeof user.fullname === 'string' && user.fullname.length ? (
				<Text style={[font]}>{initials(user.fullname)}</Text>
			) : (
				<Feather name={'user'} color="white" size={50}></Feather>
			)}
		</View>
	)
}
