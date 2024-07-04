import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { SettingsTabScreenProps } from '../../types'
import React, { useEffect, useState } from 'react'
import { Tag, useTags } from '../../core/services/session'
import { View, Text } from '../../components/Themed'
import SharedStyles from '../../constants/Styles'
import { useIsFocused } from '@react-navigation/native'
import { chattanoogaTapWater, fill } from '../../constants/Colors'
import BaseScreen from '../BaseScreen'

export default function CustomTagsListScreen({ navigation }: SettingsTabScreenProps<'CustomTagsList'>) {
	const { data, isLoading, isFetching, refetch } = useTags()
	const [customTags, setCustomTags] = useState([] as Tag[])
	const isFocused = useIsFocused()

	// Build custom tag list
	useEffect(() => {
		if (!data) return
		const custom = data.filter((d) => d.type === 'private')
		setCustomTags(custom)
	}, [isLoading, data])

	// Reload on activate
	useEffect(() => {
		if (isFocused && !isFetching) refetch()
	}, [isFocused])

	function onSelect(item: Tag) {
		navigation.navigate('EditTag', item)
	}

	return (
		<BaseScreen>
			<View style={styles.container}>
				<FlatList
					style={{ width: '90%' }}
					data={customTags}
					initialNumToRender={3}
					renderItem={({ item, index }: { item: Tag; index: number }) => {
						return (
							<>
								<TouchableOpacity style={[{ backgroundColor: fill }, styles.tagItem]} onPress={() => onSelect(item)}>
									<Text style={{ fontSize: 16 }}>{item.name}</Text>
								</TouchableOpacity>
							</>
						)
					}}
					ListEmptyComponent={() => {
						return (
							<View style={styles.container}>
								<Text style={{ width: '70%', textAlign: 'center', color: 'white', marginBottom: 30 }}>
									Manage Your Custom Tags
								</Text>
								<Text
									style={{
										width: '70%',
										textAlign: 'center',
										color: chattanoogaTapWater,
										marginBottom: 30
									}}>
									Try adding a custom tag to an Aro session to track your intentional time.
								</Text>
							</View>
						)
					}}
				/>
				<View style={SharedStyles.glowTop} />
			</View>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 125
	},
	tagItem: {
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		marginVertical: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
})
