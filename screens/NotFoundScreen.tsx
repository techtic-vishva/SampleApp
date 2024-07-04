import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Loading from '../components/Loading'
import { View } from '../components/Themed'
import { RootStackScreenProps } from '../types'

export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
	useEffect(() => {
		navigation.replace('Root')
	})

	return (
		<View style={styles.container}>
			<Loading />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	}
})
