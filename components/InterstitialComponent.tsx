import React from 'react'
import { StyleSheet, GestureResponderEvent, Image, Dimensions } from 'react-native'
import { View } from './Themed'
import { HeaderText } from './StyledText'
import OrangeButton from './OrangeButton'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import WhiteButton from './WhiteButton'
import { Feather } from '@expo/vector-icons'

export default function (props: {
	topLabel?: string
	imageURLs: string[]
	primaryButtonLabel: string
	primaryButtonIcon?: React.ComponentProps<typeof Feather>['name']
	onPrimaryButton: (event: GestureResponderEvent) => void
	secondaryButtonLabel?: string
	secondaryButtonIcon?: React.ComponentProps<typeof Feather>['name']
	onSecondaryButton?: (event: GestureResponderEvent) => void
}) {
	const { width, height } = Dimensions.get('screen')
	return (
		<View style={styles.container}>
			{/* Headline Text */}
			{props.topLabel && <HeaderText style={[styles.topTitle, { marginBottom: '8%' }]}>{props.topLabel}</HeaderText>}

			{/* Buttons */}
			<OrangeButton
				onPress={props.onPrimaryButton}
				title={props.primaryButtonLabel}
				icon={props.primaryButtonIcon}
				outterStyle={{ width: '80%', marginBottom: 20, marginTop: '8%' }}
			/>

			{props.secondaryButtonLabel && (
				<WhiteButton
					onPress={props.onSecondaryButton}
					title={props.secondaryButtonLabel}
					icon={props.secondaryButtonIcon}
					outterStyle={{
						width: '80%',
						marginBottom: 30
					}}
				/>
			)}

			{/* Background Images */}
			<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
				<SwiperFlatList
					showPagination
					autoplay
					autoplayLoop
					autoplayLoopKeepAnimation
					autoplayDelay={6}
					data={props.imageURLs}
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
		justifyContent: 'center'
	},
	topTitle: {
		fontSize: 22,
		width: '80%',
		textAlign: 'center'
	}
})
