import { StyleSheet } from 'react-native'
import { dichotomousHippopotamus } from './Colors'

export default StyleSheet.create({
	glowBottom: {
		shadowColor: dichotomousHippopotamus,
		shadowOpacity: 0.9,
		shadowRadius: 120,
		shadowOffset: {
			height: 0,
			width: 0
		},
		height: 250,
		position: 'absolute',
		bottom: -250,
		width: '60%'
	},
	glowTop: {
		shadowColor: dichotomousHippopotamus,
		shadowOpacity: 0.7,
		shadowRadius: 100,
		shadowOffset: {
			height: 0,
			width: 0
		},
		height: 250,
		position: 'absolute',
		top: -250,
		width: '40%'
	},
	navigationHeader:{
		fontFamily:'objektiv-semi-bold',
		fontSize:19,
	}
})
