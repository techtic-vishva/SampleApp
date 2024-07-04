import { useEffect } from 'react'
import WebView from 'react-native-webview'
import { SettingsTabScreenProps } from '../types'
import { Platform } from 'react-native'

export default function WebViewModalScreen({ navigation, route }: SettingsTabScreenProps<'WebViewModal'>) {
	const [title, uri] = [route.params.title, route.params.uri]

	useEffect(() => {
		navigation.setOptions({ title })
	})

	const checkUrl = () => {
		if (Platform.OS === 'android') {
			return uri.includes('.pdf') ? 'http://docs.google.com/gview?embedded=true&url=' + uri : uri
		} else {
			return uri
		}
	}

	return (
		<WebView
			source={{
				uri: checkUrl()
			}}
		/>
	)
}
