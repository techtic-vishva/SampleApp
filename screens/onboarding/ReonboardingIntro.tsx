import { Image, StyleSheet, Dimensions } from 'react-native'
import { HeaderText } from '../../components/StyledText'
import { View, Text } from '../../components/Themed'
import { OnboardingTabScreenProps } from '../../types'
import OrangeButton from '../../components/OrangeButton'
import React from 'react'
import SwiperFlatList from 'react-native-swiper-flatlist'
import { WelcomeScreenBackgroundImages } from './WelcomeScreen'
import { chattanoogaTapWater } from '../../constants/Colors'

export default function ReonboardingIntroScreen({ navigation }: OnboardingTabScreenProps<'ReonboardingIntro'>) {
	const { width, height } = Dimensions.get('screen')

	return (
		<View style={styles.container}>
			{/* Bottom Cluster */}
			<View
				style={{
					backgroundColor: 'transparent',
					width: '90%',
					alignItems: 'center',
					marginTop: 'auto',
					marginBottom: 'auto',
					justifyContent: 'space-between',
					display: 'flex'
				}}>
				<HeaderText numberOfLines={1} adjustsFontSizeToFit style={[styles.title, { marginBottom: 50 }]}>
					Aro App Updates
				</HeaderText>
				<Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 20 }}>
					New App updates bring more intelligent goals, motivations, and a more tailored experience to Aro.
				</Text>
				<HeaderText style={{ marginBottom: 50, textAlign: 'center', fontSize: 18 }}>
					We have a few quick questions to ask to enable these new features!
				</HeaderText>

				<OrangeButton
					onPress={() => {
						navigation.navigate('SelectRole', { skipToSurvey: true })
					}}
					title="Get Started"
					icon="arrow-right"
					outterStyle={{ width: '80%', marginBottom: 20 }}
				/>
				<Text style={{ fontSize: 17, color: chattanoogaTapWater }}>Estimated Time: 2 min</Text>
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
								opacity: 0.45,
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
		fontSize: 26,
		width: '80%',
		textAlign: 'center'
	}
})
