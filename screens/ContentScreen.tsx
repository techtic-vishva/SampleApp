import React, { useEffect } from 'react'
import DynamicIcon from '../components/DynamicIcon'
import { ScrollView, StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native'
import { chattanoogaTapWater, dichotomousHippopotamus, employeeParking, vitaminCBathwater } from '../constants/Colors'
import { RootTabScreenProps } from '../types'
import ContentList from '../components/ContentList'
import { useAuthor, usePlaylist, usePlaylistOfType } from '../core/services/content'
import { useIsFocused } from '@react-navigation/native'
import SharedStyles from '../constants/Styles'

export default function ContentScreen({ navigation }: RootTabScreenProps<'ContentTab'>) {
	const { data: playListData, refetch: refechPlaylist } = usePlaylist('category')
	const { data: playListTypeData, refetch: refetchPlaylistType } = usePlaylistOfType('recent')
	const { data: featuredPlaylistData, refetch: refetchFeaturedPlaylist } = usePlaylistOfType('featured')
	const { data: authorListData, refetch: refetchAuthor } = useAuthor()
	const isFocused = useIsFocused()

	useEffect(() => {
		if (isFocused) {
			refechPlaylist()
			refetchPlaylistType()
			refetchAuthor()
			refetchFeaturedPlaylist()
		}
	}, [isFocused])

	return (
		<View style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					horizontal
					contentContainerStyle={{ paddingEnd: 20, paddingStart: 20 }}
					style={{ flexDirection: 'row', marginTop: 40 }}>
					{playListData &&
						playListData.map((item, index) => {
							return (
								<TouchableOpacity
									style={styles.base}
									key={index}
									onPress={() => {
										navigation.navigate('Playlist', { playlistId: item?.id })
									}}>
									<DynamicIcon name={item?.icon} type={item?.iconType} color={vitaminCBathwater} size={25} />
									<Text
										style={{
											fontFamily: 'objektiv-semi-bold',
											color: employeeParking,
											paddingStart: 7
										}}>
										{item?.shortTitle.toUpperCase()}
									</Text>
								</TouchableOpacity>
							)
						})}
				</ScrollView>
				<View style={{ display: 'flex', marginTop: 20 }}>
					<View
						style={{
							flexDirection: 'row',
							backgroundColor: 'transparent',
							paddingHorizontal: 20,
							alignItems: 'center'
						}}>
						<Text style={{ flex: 1, fontSize: 18, color: employeeParking, fontFamily: 'objektiv-semi-bold' }}>
							{featuredPlaylistData?.playlist.title}
						</Text>

						<TouchableOpacity
							onPress={() => {
								//@ts-ignore
								navigation.navigate('Playlist', { playlistId: featuredPlaylistData?.playlist.id })
							}}>
							<Text style={styles.showAll}>Show All</Text>
						</TouchableOpacity>
					</View>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={{
							flex: 1,
							marginTop: 20,
							paddingHorizontal: 20,
							fontSize: 14,
							color: chattanoogaTapWater,
							fontFamily: 'objektiv'
						}}>
						{featuredPlaylistData?.playlist.description}
					</Text>

					<ContentList layout="featured" contents={featuredPlaylistData?.contents ?? []}></ContentList>
				</View>
				<View style={styles.divider} />
				<View style={{ display: 'flex' }}>
					<View
						style={{
							flexDirection: 'row',
							backgroundColor: 'transparent',
							paddingHorizontal: 20,
							alignItems: 'center'
						}}>
						<Text style={{ flex: 1, fontSize: 18, color: employeeParking, fontFamily: 'objektiv-semi-bold' }}>
							Latest Content
						</Text>
						<TouchableOpacity
							onPress={() => {
								//@ts-ignore
								navigation.navigate('Playlist', { playlistId: playListTypeData?.playlist.id })
							}}>
							<Text style={styles.showAll}>Show All</Text>
						</TouchableOpacity>
					</View>

					<ContentList layout="horizontal" contents={playListTypeData?.contents ?? []}></ContentList>
				</View>

				<View style={styles.divider} />

				<View
					style={{
						flexDirection: 'row',
						marginBottom: 10,
						marginHorizontal: 20,
						backgroundColor: 'transparent',
						alignItems: 'center'
					}}>
					<Text style={{ flex: 1, fontSize: 18, color: employeeParking, fontFamily: 'objektiv-semi-bold' }}>
						Intentionality Experts
					</Text>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('AuthorList')
						}}>
						<Text style={styles.showAll}>Show All</Text>
					</TouchableOpacity>
				</View>

				<View style={{ flex: 1 }}>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingEnd: 20, paddingStart: 20 }}>
						{authorListData &&
							authorListData.map((item, index) => {
								return (
									<TouchableOpacity
										key={index}
										onPress={() => {
											navigation.navigate('Author', { authorId: item.id })
										}}
										style={{
											marginTop: 15,
											backgroundColor: 'transparent',
											marginEnd: 25,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center'
										}}>
										<Image style={styles.authorImage} source={{ uri: item.thumbnail }} />
										<Text
											style={{
												fontSize: 13,
												marginTop: 10,
												fontFamily: 'objektiv-md',
												textAlign: 'center',
												color: employeeParking
											}}>
											{item.name}
										</Text>
									</TouchableOpacity>
								)
							})}
					</ScrollView>
				</View>
			</ScrollView>
			<View style={[SharedStyles.glowTop, { zIndex: 1, backgroundColor: dichotomousHippopotamus }]} />
		</View>
	)
}

const styles = StyleSheet.create({
	divider: {
		height: 1,
		backgroundColor: chattanoogaTapWater,
		marginHorizontal: 10,
		opacity: 0.25,
		marginVertical: 20
	},
	showAll: {
		fontSize: 14,
		color: dichotomousHippopotamus,
		fontFamily: 'objektiv-semi-bold'
	},
	container: {
		flex: 1,
		paddingTop: 40,
		alignItems: 'center'
	},
	base: {
		height: 45,
		flexDirection: 'row',
		backgroundColor: chattanoogaTapWater,
		paddingVertical: 5,
		paddingHorizontal: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginEnd: 10,
		borderRadius: 8,
		borderWidth: 1
	},
	image: {
		width: 150,
		height: 100,
		borderRadius: 5
	},
	authorImage: {
		width: 60,
		height: 60,
		borderRadius: 100
	}
})
