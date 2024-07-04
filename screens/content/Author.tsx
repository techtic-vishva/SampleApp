import * as Linking from 'expo-linking'
import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import MoreText from '../../components/MoreText'
import { Text, View } from '../../components/Themed'
import ContentList from '../../components/ContentList'
import { dichotomousHippopotamus } from '../../constants/Colors'
import { useAuthorById, useAuthorContent } from '../../core/services/content'
import { RootStackScreenProps } from '../../types'
import BaseScreen from './../BaseScreen'

export default function Author({ navigation, route }: RootStackScreenProps<'Author'>) {
	const authorId = route.params.authorId
	const { data: author } = useAuthorById(authorId)
	const { data: authorContent } = useAuthorContent(authorId)

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
						<Image source={{ uri: author?.thumbnail }} resizeMode="cover" style={{ width: '100%', height: 250 }} />
						<View
							style={{
								flex: 1,
								marginHorizontal: 20,
								paddingTop: 20,
								backgroundColor: 'transparent'
							}}>
							<Text style={{ fontSize: 17, fontFamily: 'objektiv-semi-bold' }}>{author?.name}</Text>

							<MoreText text={author?.description} />
							{author?.links && (
								<View style={{ flexDirection: 'row', marginTop: 10 }}>
									{Object.entries(author.links).map(([key, value], index) => {
										return (
											<TouchableOpacity
												key={index}
												style={{ flexDirection: 'row' }}
												onPress={() => {
													Linking.openURL(value)
												}}>
												<Text
													style={{
														fontSize: 15,
														flexDirection: 'row',
														color: dichotomousHippopotamus,
														fontFamily: 'objektiv-semi-bold'
													}}>
													{key + `${Object.keys(author.links).length - 1 === index ? '' : ' | '}`}
												</Text>
											</TouchableOpacity>
										)
									})}
								</View>
							)}

							<View
								style={{ height: 1, marginRight: 3, marginTop: 15, marginLeft: 7 }}
								lightColor="#eee"
								darkColor="rgba(255,255,255,0.1)"
							/>
							<Text style={{ fontSize: 17, fontFamily: 'objektiv-semi-bold', marginTop: 9 }}>Contents</Text>
						</View>
						<ContentList layout="vertical" contents={authorContent ?? []}></ContentList>
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
