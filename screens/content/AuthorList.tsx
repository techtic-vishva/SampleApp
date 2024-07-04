import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import DynamicIcon from '../../components/DynamicIcon'
import { Text, View } from '../../components/Themed'
import { chattanoogaTapWater } from '../../constants/Colors'
import { useAuthorList } from '../../core/services/content'
import { RootStackScreenProps } from '../../types'
import BaseScreen from './../BaseScreen'

export default function AuthorList({ navigation, route }: RootStackScreenProps<'AuthorList'>) {
	const { data: authorList } = useAuthorList()

	return (
		<BaseScreen>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					flexGrow: 1,
					width: '100%',
					display: 'flex',
					paddingBottom: 80,
					marginTop: 100
				}}>
				<View style={styles.container}>
					<View style={{ width: '100%', backgroundColor: 'transparent' }}>
						{authorList &&
							authorList.map((author, index) => {
								return (
									<TouchableOpacity
										style={{ flexDirection: 'row', marginRight: 15, marginTop: 15, marginHorizontal: 25 }}
										key={index}
										onPress={() => navigation.navigate('Author', { authorId: author.id })}>
										<Image style={styles.image} source={{ uri: author.thumbnail }} />
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
														{author.name}
													</Text>
													<Text style={{ fontSize: 9 }}>{author.tagline}</Text>
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
							})}
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
	},
	image: {
		width: 150,
		height: 100,
		borderRadius: 5
	}
})
