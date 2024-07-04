import { Video } from 'expo-av'
import { useCallback, useState } from 'react'
import { Dimensions, Image, TouchableOpacity } from 'react-native'
import OrangeButton from '../components/OrangeButton'
import { Text, View } from '../components/Themed'
import { setIsOnboarded } from '../core/GlobalState'
import { update } from '../core/services/user'
import { OnboardingTabScreenProps } from '../types'
import { useVideo } from '../core/services/media-service'

export default function VideoPlayerScreen({ navigation, route }: OnboardingTabScreenProps<'VideoPlayer'>) {
	const [isPlaying, setPlaying] = useState(false)
	const { data } = useVideo('onboarding-welcome-video')

	const finalize = async () => {
		await update({ metadata: { hasOnboarded: true } })
		setIsOnboarded(true, true)
	}

	const onButtonPress = async () => {
		if (!isPlaying) {
			setPlaying(true)
		} else {
			finalize()
		}
	}

	const onStateChange = useCallback((playbackStatus) => {
		if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
			finalize()
		}
	}, [])

	const { width, height } = Dimensions.get('screen')

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
			{!isPlaying && (
				<View style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}>
					<Image
						resizeMode="cover"
						style={{ position: 'absolute', height: '100%', width: '100%' }}
						source={require('../assets/images/youTubeThumbnail.png')}
					/>
					<TouchableOpacity
						onPress={() => setPlaying(true)}
						style={{
							marginTop: 'auto',
							marginBottom: 'auto',
							paddingBottom: 100,
							backgroundColor: 'transparent',
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column'
						}}>
						<Image
							style={{ height: 100, width: 100, resizeMode: 'cover' }}
							source={require('../assets/images/playBtn.png')}
						/>
						<Text style={{ color: 'white', fontSize: 21, fontFamily: 'objektiv-semi-bold' }}>Welcome | 1:28</Text>
					</TouchableOpacity>
				</View>
			)}
			{data?.url && isPlaying && (
				<Video
					shouldPlay={isPlaying}
					style={{ height: height, width: width }}
					source={{
						uri: data?.url
					}}
					useNativeControls={false}
					onPlaybackStatusUpdate={onStateChange}
				/>
			)}

			<View
				style={{
					width: '100%',
					marginTop: 'auto',
					backgroundColor: 'transparent',
					alignItems: 'center'
				}}>
				<OrangeButton
					onPress={onButtonPress}
					title={isPlaying ? 'Finish Onboarding' : 'Watch Intro'}
					icon={isPlaying ? 'arrow-right' : 'check-circle'}
					outterStyle={{ width: '90%', marginBottom: 60 }}
				/>
			</View>
		</View>
	)
}
