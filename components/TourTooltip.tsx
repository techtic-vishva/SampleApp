import * as React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { dichotomousHippopotamus, fill } from '../constants/Colors'
import { TooltipProps } from 'rn-tourguide'
import { MainText, HeaderText } from './StyledText'

const Tooltip = ({
	isFirstStep,
	isLastStep,
	handleNext,
	handlePrev,
	handleStop,
	currentStep,
	labels
}: TooltipProps) => {
	const [p1, p2] = (currentStep?.text || '').split(':TITLE:')
	const title = p2 ? p1 : ''
	const body = title ? p2 : p1
	return (
		<View style={styles.container}>
			<View style={styles.desContainer}>
				{title && <HeaderText style={{ color: fill, marginBottom: 20, fontSize: 16 }}>{title}</HeaderText>}
				<MainText testID="stepDescription" style={styles.desText}>
					{body}
				</MainText>
			</View>
			<View style={styles.btnContainer}>
				{!isLastStep ? (
					<TouchableOpacity style={{ flex: 1 }} onPress={handleStop}>
						<MainText style={styles.btnText}>{labels?.skip || 'Skip'}</MainText>
					</TouchableOpacity>
				) : null}
				{!isFirstStep ? (
					<TouchableOpacity style={{ flex: 1 }} onPress={handlePrev}>
						<MainText style={styles.btnText}>{labels?.previous || 'Previous'}</MainText>
					</TouchableOpacity>
				) : null}
				{!isLastStep ? (
					<TouchableOpacity style={{ flex: 1 }} onPress={handleNext}>
						<MainText style={styles.btnText}>{labels?.next || 'Next'}</MainText>
					</TouchableOpacity>
				) : (
					<TouchableOpacity style={{ flex: 1 }} onPress={handleStop}>
						<MainText style={styles.btnText}>{labels?.finish || 'Finish'}</MainText>
					</TouchableOpacity>
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 16,
		paddingTop: 24,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 16,
		width: '90%',
		backgroundColor: '#ffffffef'
	},
	desText: {
		fontFamily: 'objektiv',
		textAlign: 'center',
		color: fill
	},
	desContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
		width: '80%',
		paddingBottom: 10
	},
	btnText: {
		fontFamily: 'objektiv',
		textAlign: 'center',
		color: dichotomousHippopotamus
	},
	btnContainer: {
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	}
})
export default Tooltip
