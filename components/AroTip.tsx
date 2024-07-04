import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { Text } from './Themed'

export default function (props: { message: string }) {
	return (
		<Text style={styles.container}>
			{/* Necessary space for center alignment to work */}
			&nbsp;
			<Image source={require('../assets/images/arobot-1.png')} style={styles.image} />
			{/* Padding between the image and text */}
			&nbsp;&nbsp;&nbsp;&nbsp;
			<Text style={styles.title}>{props.message}</Text>
		</Text>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '80%',
		textAlign: 'center',
		marginVertical: 30
	},
	image: {
		width: 20,
		height: 20,
		resizeMode: 'contain'
	},
	title: {
		fontFamily: 'objektiv-md-italic',
		fontSize: 15
	}
})
