import { ResizeMode, Video, VideoFullscreenUpdate, VideoFullscreenUpdateEvent } from 'expo-av'
import React, { useCallback, useEffect, useRef } from 'react'
import { Dimensions, View } from 'react-native'
import goBackOrHome from '../../navigation/goBackOrHome'
import { RootStackScreenProps } from '../../types'

export default function ContentVideo({ navigation, route }: RootStackScreenProps<'ContentVideo'>) {
	const videoUrl = route.params.videoUrl

	const { width, height } = Dimensions.get('screen')

	const videoRef = useRef<Video | null>()

	useEffect(() => {
		showVideoInFullscreen()
	})

	function showVideoInFullscreen() {
		videoRef.current && videoRef.current.presentFullscreenPlayer()
	}
	function dismissVideoFromFullscreen() {
		videoRef.current && videoRef.current.dismissFullscreenPlayer()
	}

	const onEnd = useCallback((playbackStatus) => {
		if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
			dismissVideoFromFullscreen()
		}
	}, [])

	const onFullscreenUpdate = (event: VideoFullscreenUpdateEvent) => {
		switch (event.fullscreenUpdate) {
			case VideoFullscreenUpdate.PLAYER_WILL_DISMISS:
				goBackOrHome(navigation)
				break
		}
	}
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
			{videoUrl && (
				<Video
					ref={(ref) => (videoRef.current = ref)}
					style={{ height: height, width: width }}
					source={{
						uri: videoUrl
					}}
					onFullscreenUpdate={onFullscreenUpdate}
					onPlaybackStatusUpdate={onEnd}
					shouldPlay={true}
					resizeMode={ResizeMode.CONTAIN}
					useNativeControls={true}
				/>
			)}
		</View>
	)
}
