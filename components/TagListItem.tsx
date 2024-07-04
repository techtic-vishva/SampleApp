import React from 'react'
import { StyleSheet, View } from 'react-native'
import { chattanoogaTapWater, dichotomousHippopotamus, fill } from '../constants/Colors'
import { formatDuration } from '../core/format'
import { SessionTagAgg } from '../core/services/user-stats'
import { Text } from './Themed'

export default function (props: { index: number; sessiogTagAgg: SessionTagAgg }) {
	return (
		<>
			<View style={styles.listViewContainer} key={props.index}>
				<View style={styles.listCounterView}>
					<Text style={styles.tagTxtStyle}>{props.index + 1}</Text>
				</View>
				<Text numberOfLines={1} style={[styles.tagTxtStyle, { flex: 1, marginStart: '5%' }]}>
					{props.sessiogTagAgg.name}
				</Text>
				<Text style={[styles.tagTxtStyle, { marginStart: '5%', color: chattanoogaTapWater, fontFamily: 'objektiv' }]}>
					{formatDuration(props.sessiogTagAgg.duration, 2)}
				</Text>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	listViewContainer: {
		height: 55,
		borderColor: fill,
		borderWidth: 3,
		alignItems: 'center',
		paddingStart: '5%',
		paddingEnd: '5%',
		marginBottom: 10,
		borderTopLeftRadius: 50,
		borderBottomLeftRadius: 50,
		borderTopRightRadius: 7,
		borderBottomRightRadius: 7,
		flexDirection: 'row'
	},
	listCounterView: {
		borderColor: dichotomousHippopotamus,
		borderWidth: 1,
		borderRadius: 20,
		height: 30,
		width: 30,
		alignItems: 'center',
		justifyContent: 'center'
	},
	tagTxtStyle: {
		color: 'white',
		fontFamily: 'objektiv-semi-bold',
		fontSize: 16
	}
})
