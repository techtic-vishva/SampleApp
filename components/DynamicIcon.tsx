import {
	Feather,
	Ionicons,
	FontAwesome,
	MaterialIcons,
	AntDesign,
	Entypo,
	EvilIcons,
	Fontisto,
	FontAwesome5,
	Foundation,
	MaterialCommunityIcons,
	Octicons,
	SimpleLineIcons,
	Zocial
} from '@expo/vector-icons'
import { ColorValue, StyleProp, TextStyle, Text } from 'react-native'
import { JSXElementConstructor } from 'react'

export type IconType =
	| 'feather'
	| 'fontAwesome'
	| 'materialIcon'
	| 'antDesign'
	| 'entypo'
	| 'evilIcons'
	| 'fontisto'
	| 'fontAwesome5'
	| 'foundation'
	| 'ionicons'
	| 'materialCommunityIcons'
	| 'octicons'
	| 'simpleLineIcons'
	| 'zocial'

function getComponent(type: IconType) {
	switch (type) {
		case 'feather':
			return Feather
		case 'fontAwesome':
			return FontAwesome
		case 'materialIcon':
			return MaterialIcons
		case 'antDesign':
			return AntDesign
		case 'entypo':
			return Entypo
		case 'evilIcons':
			return EvilIcons
		case 'fontisto':
			return Fontisto
		case 'fontAwesome5':
			return FontAwesome5
		case 'foundation':
			return Foundation
		case 'ionicons':
			return Ionicons
		case 'materialCommunityIcons':
			return MaterialCommunityIcons
		case 'octicons':
			return Octicons
		case 'simpleLineIcons':
			return SimpleLineIcons
		case 'zocial':
			return Zocial
	}

	return null
}

export default function ({
	type,
	name,
	color,
	size,
	style
}: {
	type: IconType | 'emoji'
	name?: React.ComponentProps<keyof JSX.IntrinsicElements | JSXElementConstructor<any>>['name']
	color: ColorValue
	size: number
	style?: StyleProp<TextStyle>
}) {
	if (type === 'emoji') {
		return <Text style={[{ fontSize: size }, style]}>{name}</Text>
	}

	const Component = getComponent(type)
	if (!Component) return <></>

	return <Component name={name} color={color} size={size} style={style} />
}
