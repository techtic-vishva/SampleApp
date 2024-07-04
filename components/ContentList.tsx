import { ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { View, Text } from './Themed'
import { chattanoogaTapWater, employeeParking } from '../constants/Colors'
import React from 'react'
import DynamicIcon from './DynamicIcon'
import { Content } from '../core/services/content'
import { formatDuration } from '../core/format'
import { useNavigation } from '@react-navigation/native'
import { addDays, isAfter } from 'date-fns'

function VerticalContentView(content: Content, index: number, onContentPress: (contentId: number) => void) {
	return (
		<TouchableOpacity
			style={{ flexDirection: 'row', marginRight: 15, marginTop: 15 }}
			key={index}
			onPress={() => {
				onContentPress(content.id)
			}}>
			<Image style={styles.image} source={{ uri: content.thumbnailUrl }} />
			<View
				style={{
					flexDirection: 'row',
					paddingHorizontal: 5,
					backgroundColor: 'transparent'
				}}>
				<View
					style={{
						flexDirection: 'column',
						alignItems: 'center',
						paddingHorizontal: 5,
						backgroundColor: 'transparent'
					}}>
					<View style={{ marginTop: 15, flex: 1, backgroundColor: 'transparent' }}>
						<Text
							style={{ fontSize: 13, fontFamily: 'objektiv-semi-bold', width: 150 }}
							numberOfLines={1}
							ellipsizeMode="tail">
							{content.title}
						</Text>
						<Text style={{ fontSize: 9 }}>{content.duration && formatDuration(content.duration)}</Text>
					</View>
				</View>
				<DynamicIcon
					style={{ marginTop: 15 }}
					name={'chevron-right'}
					type="entypo"
					color={chattanoogaTapWater}
					size={25}
				/>
			</View>
		</TouchableOpacity>
	)
}

function HoriontalContentView(content: Content, index: number, onContentPress: (contentId: number) => void) {
	return (
		<TouchableOpacity
			style={{ flexDirection: 'column', marginRight: 15, paddingBottom: 5 }}
			key={index}
			onPress={() => {
				onContentPress(content.id)
			}}>
			<View>
				<Image style={styles.image} source={{ uri: content.thumbnailUrl }} />
				{!isAfter(new Date(content.insertedOn), addDays(new Date(content.insertedOn), 30)) && (
					<View
						style={{
							position: 'absolute',
							bottom: 0,
							marginLeft: 8,
							marginBottom: 8,
							paddingVertical: 3,
							borderRadius: 3,
							paddingHorizontal: 10,
							backgroundColor: chattanoogaTapWater
						}}>
						<Text
							style={{
								fontFamily: 'objektiv-semi-bold',
								color: employeeParking,
								fontSize: 12,
								letterSpacing: 2
							}}>
							NEW
						</Text>
					</View>
				)}
			</View>

			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: 5,
					backgroundColor: 'transparent'
				}}>
				<View style={{ marginTop: 15, flex: 1, backgroundColor: 'transparent' }}>
					<Text
						style={{ fontSize: 13, fontFamily: 'objektiv-semi-bold', width: 120 }}
						numberOfLines={1}
						ellipsizeMode="tail">
						{content.title}
					</Text>
					<Text style={{ fontSize: 9 }}>{content.duration && formatDuration(content.duration)}</Text>
				</View>
				<DynamicIcon
					style={{ marginTop: 15 }}
					name={'chevron-right'}
					type="entypo"
					color={chattanoogaTapWater}
					size={25}
				/>
			</View>
		</TouchableOpacity>
	)
}

function FeaturedContentView(content: Content, index: number, onContentPress: (contentId: number) => void) {
	return (
		<TouchableOpacity
			style={{ flexDirection: 'column', marginRight: 15, paddingBottom: 5 }}
			key={index}
			onPress={() => {
				onContentPress(content.id)
			}}>
			<Image style={{ width: 230, height: 150, borderRadius: 5 }} source={{ uri: content.thumbnailUrl }} />

			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: 'transparent'
				}}>
				<View style={{ marginTop: 10, flex: 1, backgroundColor: 'transparent' }}>
					<Text style={{ fontSize: 13, fontFamily: 'objektiv-semi-bold' }} numberOfLines={1} ellipsizeMode="tail">
						{content.title}
					</Text>
					<Text style={{ fontSize: 9 }}>{formatDuration(content.duration)}</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export type LayoutType = 'vertical' | 'horizontal' | 'featured'
export default function ContentList({ contents, layout }: { contents: Content[]; layout: LayoutType }) {
	const navigation = useNavigation()

	const onContentPress = (contentId: number) => {
		navigation.navigate('Content', { contentId })
	}

	return (
		<View style={[styles.container, { marginRight: layout === 'featured' || layout === 'horizontal' ? 0 : 20 }]}>
			<ScrollView
				horizontal={layout === 'featured' || layout === 'horizontal' ? true : false}
				contentContainerStyle={{ paddingEnd: 20, paddingStart: 20 }}>
				{contents.map((content, index) => {
					if (layout === 'horizontal') {
						return HoriontalContentView(content, index, onContentPress)
					} else if (layout === 'featured') {
						return FeaturedContentView(content, index, onContentPress)
					} else if (layout === 'vertical') {
						return VerticalContentView(content, index, onContentPress)
					}
				})}
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	videoListContainer: {
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		borderRadius: 20,
		justifyContent: 'space-between',
		backgroundColor: 'transparent'
	},

	horizontalVideoListContainer: {
		display: 'flex',
		flex: 1,
		width: '100%',
		flexDirection: 'column',
		borderRadius: 20,
		marginRight: 7,
		justifyContent: 'space-between',
		backgroundColor: 'transparent'
	},

	image: {
		width: 150,
		height: 100,
		borderRadius: 5
	},

	container: {
		display: 'flex',
		paddingTop: 20,
		backgroundColor: 'transparent'
	}
})
