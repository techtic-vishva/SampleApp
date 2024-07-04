import React from 'react'
import { Image, ScrollView, StyleSheet } from 'react-native'
import MoreText from '../../components/MoreText'
import { Text, View } from '../../components/Themed'
import ContentList from '../../components/ContentList'
import { usePlayListContent, usePlaylistById } from '../../core/services/content'
import { RootStackScreenProps } from '../../types'
import BaseScreen from './../BaseScreen'

export default function Playlist({ navigation, route }: RootStackScreenProps<'Playlist'>) {
	const playListId = route.params.playlistId
	const { data: playListData } = usePlaylistById(playListId)
	const { data: playListContent } = usePlayListContent(playListId)

	return (
		<BaseScreen>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					flexGrow: 1,
					width: '100%',
					display: 'flex',
					paddingBottom: 80
				}}>
				<View style={styles.container}>
					<View style={{ width: '100%', backgroundColor: 'transparent' }}>
						<Image
							source={{ uri: playListData?.thumbnailUrl }}
							resizeMode="cover"
							style={{ width: '100%', height: 250 }}
						/>
						<View
							style={{
								flex: 1,
								marginHorizontal: 20,
								paddingTop: 20,
								backgroundColor: 'transparent'
							}}>
							<Text style={{ fontSize: 20, fontFamily: 'objektiv-semi-bold', backgroundColor: 'transparent' }}>
								{playListData?.title}
							</Text>

							<MoreText text={playListData?.description} />

							<View style={{ height: 1, marginTop: 15 }} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

							<Text style={{ fontSize: 17, fontFamily: 'objektiv-semi-bold', marginTop: 9 }}>Contents</Text>
						</View>
						<ContentList layout="vertical" contents={playListContent ?? []}></ContentList>
					</View>
				</View>
			</ScrollView>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'transparent',
		flexDirection: 'column'
	}
})
