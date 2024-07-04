import { format } from 'date-fns'
import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import MoreText from '../../components/MoreText'
import OrangeButton from '../../components/OrangeButton'
import { Text, View } from '../../components/Themed'
import ContentList from '../../components/ContentList'
import { dichotomousHippopotamus } from '../../constants/Colors'
import { formatDuration } from '../../core/format'
import { markContent, useContent, useRelatedContent } from '../../core/services/content'
import { RootStackScreenProps } from '../../types'
import BaseScreen from '../BaseScreen'

export default function Content({ navigation, route }: RootStackScreenProps<'Content'>) {
	const contentId = route.params.contentId
	const { data: contentData } = useContent(contentId)
	const { data: relatedContentList } = useRelatedContent(3)

	const onViewContent = () => {
		if (contentData?.id) {
			markContent(contentData?.id).then(() => {
				if (contentData.type === 'video') {
					navigation.navigate('ContentVideo', { videoUrl: contentData.mediaUrl })
				} else {
					//@ts-ignore
					navigation.navigate('Settings', {
						screen: 'WebViewModal',
						params: { title: contentData.title, uri: contentData.mediaUrl }
					})
				}
			})
		}
	}

	function getLabel() {
		switch (contentData?.type) {
			case 'video':
				return 'Play Video'
			case 'pdf':
				return 'Read Now'
			case 'webpage':
				return 'Visit Now'
			default:
				return ''
		}
	}

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
						<View>
							<Image
								source={{ uri: contentData?.thumbnailUrl }}
								resizeMode="cover"
								style={{ width: '100%', height: 250 }}
							/>
							<Text
								style={{
									fontSize: 25,
									fontFamily: 'objektiv-semi-bold',
									position: 'absolute',
									bottom: 20,
									left: 20,
									backgroundColor: 'transparent'
								}}>
								{contentData?.title}
							</Text>
						</View>

						<View
							style={{
								flex: 1,
								marginHorizontal: 20,
								paddingTop: 20,
								backgroundColor: 'transparent'
							}}>
							<TouchableOpacity
								onPress={() => {
									//@ts-ignore
									navigation.navigate('Author', { authorId: contentData?.authorId })
								}}>
								<Text
									style={{
										fontSize: 20,
										fontFamily: 'objektiv-semi-bold',
										color: dichotomousHippopotamus,
										backgroundColor: 'transparent'
									}}>
									{contentData?.authorName}
								</Text>
							</TouchableOpacity>

							<Text style={{ fontSize: 10, fontFamily: 'objektiv-semi-bold', backgroundColor: 'transparent' }}>
								{contentData?.duration &&
									formatDuration(contentData?.duration) +
										'  -  ' +
										format(new Date(contentData?.insertedOn), 'MMM dd, yyyy')}
							</Text>

							<OrangeButton
								onPress={onViewContent}
								outterStyle={{ width: '100%', marginTop: 25, justifyContent: 'center' }}
								title={getLabel()}
							/>
							<MoreText text={contentData?.description} />
							<View style={{ height: 1, marginTop: 15 }} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

							<Text style={{ fontSize: 17, fontFamily: 'objektiv-semi-bold', marginTop: 9 }}>Related</Text>
						</View>
						<ContentList layout="horizontal" contents={relatedContentList ?? []}></ContentList>
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
