import { Text, TextProps } from './Themed'

export function MonoText(props: TextProps) {
	return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />
}

export function MainText(props: TextProps) {
	return <Text {...props} style={[props.style, { fontFamily: 'objektiv' }]} />
}

export function HeaderText(props: TextProps) {
	return <Text {...props} style={[{ fontFamily: 'objektiv-semi-bold', fontSize: 20 }, props.style]} />
}
