import React, { useCallback, useEffect } from 'react'
import { StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'
import OrangeButton from '../components/OrangeButton'
import { HeaderText } from '../components/StyledText'
import { Text, View } from '../components/Themed'
import { darkArts, fill, chattanoogaTapWater } from '../constants/Colors'
import { RootStackScreenProps } from '../types'
import { useMedia } from '../core/services/media-service'
import { Feather } from '@expo/vector-icons'
import Loading from '../components/Loading'

export default function GoalMetScreen({ navigation, route }: RootStackScreenProps<'GoalMet'>) {
	const { uuid } = route.params
	const { data, refetch, isFetching, isRefetching } = useMedia()
	const { width } = Dimensions.get('window')

	useEffect(() => {
		return navigation.addListener('blur', onNavigate)
	}, [navigation, uuid])

	const onNavigate = () => {
		if (route.params.skipEdit) {
			navigation.navigate('Root')
		} else {
			navigation.replace('EditSession', { uuid })
		}
	}

	return (
		<View style={styles.container}>
			<View
				style={{
					backgroundColor: 'white',
					width: '35%',
					height: 4.5,
					borderRadius: 5,
					opacity: 0.2,
					marginBottom: 20,
					marginTop: 10
				}}
			/>

			<HeaderText style={{ marginBottom: 30, marginTop: 30 }}>Daily Goal Met! &nbsp;&nbsp;&nbsp; 🎉</HeaderText>
			<View
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: darkArts,
					width: width * 0.85,
					height: width * 0.85,
					borderRadius: 15
				}}>
				{(isFetching || isRefetching) && <Loading />}
				{!isFetching && !isRefetching && (
					<Image
						source={{
							uri: data?.uri,
							cache: 'reload',
							width: width * 0.75,
							height: Math.min(width * 0.75, (width * 0.75) / (data?.aspectRatio || 1))
						}}
						resizeMode="contain"
						style={{}}
					/>
				)}
			</View>

			<TouchableOpacity
				style={{
					width: '75%',
					backgroundColor: 'transparent',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-end',
					alignItems: 'center'
				}}
				onPress={() => refetch()}>
				<Image
					source={require('../assets/images/via_tenor_logo_white.png')}
					resizeMode="contain"
					style={{ height: 40, width: '20%' }}
				/>
				<Feather name="rotate-cw" color={chattanoogaTapWater} size={20} style={{ marginLeft: 10 }} />
			</TouchableOpacity>

			<Text style={{ fontSize: 16, marginTop: 40, marginBottom: 'auto', width: '80%', textAlign: 'center' }}>
				Nice work, you've met your daily Aro goal. Log more Aro time today to stretch yourself and Aro will coach you on
				setting a new goal level!
			</Text>

			<View style={styles.buttonContainer}>
				<OrangeButton outterStyle={{ width: '80%', marginBottom: 30 }} title="Continue" onPress={onNavigate} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: fill
	},

	buttonContainer: {
		backgroundColor: 'transparent',
		marginTop: 'auto',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		marginBottom: 30
	}
})
