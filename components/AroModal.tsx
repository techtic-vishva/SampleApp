import React from 'react'
import { View, StyleSheet, GestureResponderEvent } from 'react-native'
import { fill } from '../constants/Colors'
import { Text } from './Themed'
import OrangeButton from './OrangeButton'

export default function (props: {
	title: string
	cancelBtnText: string
	actionBtnTxt: string
	isCancleBtnDisable: boolean
	onActionPress?: (event: GestureResponderEvent) => void
	onCancelPress?: (event: GestureResponderEvent) => void
	tall?: boolean
}) {
	return (
		<>
			<View style={styles.mask}></View>
			<View style={[styles.popover, props.tall ? { height: 400, top: '25%' } : {}]}>
				<Text style={styles.titleStyle}>{props.title}</Text>
				<OrangeButton onPress={props.onActionPress} title={props.actionBtnTxt} outterStyle={styles.actionBtnStyle} />
				{!props.isCancleBtnDisable && (
					<OrangeButton onPress={props.onCancelPress} title={props.cancelBtnText} outterStyle={styles.cancelBtnStyle} />
				)}
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	actionBtnStyle: {
		width: '75%',
		marginTop: 30
	},
	cancelBtnStyle: {
		width: '75%',
		marginTop: 10,
		backgroundColor: 'white',
		borderColor: 'black'
	},
	titleStyle: {
		color: 'black',
		fontFamily: 'objektiv-semi-bold',
		fontSize: 20,
		width: '75%',
		textAlign: 'center'
	},
	mask: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		opacity: 0.6
	},
	popover: {
		position: 'absolute',
		top: '30%',
		width: '90%',
		height: 250,
		backgroundColor: 'white',
		borderRadius: 15,
		shadowColor: fill,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center'
	}
})
