import { Image, Pressable, StyleSheet, Dimensions } from 'react-native'
import { HeaderText } from '../../components/StyledText'
import { View, Text } from '../../components/Themed'
import { AuthenticationTabScreenProps } from '../../types'
import OrangeButton from '../../components/OrangeButton'
import React from 'react'
import SwiperFlatList from 'react-native-swiper-flatlist'

export const WelcomeScreenBackgroundImages = [
	'https://storage.googleapis.com/aro-public/assets/photos/login-background-01.jpeg',
	'https://storage.googleapis.com/aro-public/assets/photos/login-background-02.jpeg',
	'https://storage.googleapis.com/aro-public/assets/photos/login-background-03.jpeg'
]

export default function WelcomeScreen({ navigation }: AuthenticationTabScreenProps<'Welcome'>) {
	const { width, height } = Dimensions.get('screen')

	return (
		<View style={styles.container}>
			{/* Top Cluster */}
			<View style={{ backgroundColor: 'transparent', paddingTop: 125 }}>
				<Image
					source={require('../../assets/images/logo_white.png')}
					style={{ width: 150, height: 100, resizeMode: 'contain' }}
				/>
			</View>

			{/* Bottom Cluster */}
			<View
				style={{
					backgroundColor: 'transparent',
					width: '90%',
					alignItems: 'center',
					marginBottom: 125,
					justifyContent: 'space-between',
					display: 'flex'
				}}>
				<HeaderText style={[styles.title, { marginBottom: 60 }]}>The best things in life are phone-free</HeaderText>
				<OrangeButton
					onPress={() => {
						navigation.navigate('Email', { verb: 'setup' })
					}}
					title="Get Started"
					icon="arrow-right"
					outterStyle={{ width: '65%', marginBottom: 30 }}
				/>
				<Pressable
					onPress={() => {
						navigation.navigate('Email', {})
					}}>
					<Text style={{ fontSize: 17 }}>Already have an account? Sign in</Text>
				</Pressable>
			</View>

			{/* Image Rotator */}
			<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
				<SwiperFlatList
					showPagination
					autoplay
					autoplayLoop
					autoplayLoopKeepAnimation
					autoplayDelay={6}
					data={WelcomeScreenBackgroundImages}
					paginationStyleItemActive={{
						width: 40,
						borderRadius: 5,
						height: 3,
						marginHorizontal: 5,
						marginTop: 1
					}}
					disableGesture
					paginationStyleItemInactive={{ width: 5, borderRadius: 5, height: 5, marginHorizontal: 5, marginTop: 0 }}
					paginationStyle={{ bottom: 30 }}
					renderItem={({ item }) => (
						<Image
							source={{ uri: item }}
							style={{
								width,
								height,
								opacity: 0.55,
								resizeMode: 'cover'
							}}></Image>
					)}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	title: {
		fontSize: 22,
		width: '80%',
		textAlign: 'center'
	}
})
