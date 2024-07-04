import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { chattanoogaTapWater } from '../constants/Colors'
import { Text } from './Themed'

export default function ({ text }: { text?: string }) {
	const [isReadMore, setReadMore] = useState(false)
	const [lengthMore, setLengthMore] = useState(false)
	const onTextLayout = useCallback((e) => {
		setLengthMore(e.nativeEvent.lines.length >= 4)
	}, [])
	return (
		<>
			{text !== null && text !== '' ? (
				<View>
					<Text
						onTextLayout={onTextLayout}
						numberOfLines={isReadMore ? undefined : 4}
						ellipsizeMode="tail"
						style={{
							color: chattanoogaTapWater,
							fontSize: 14,
							marginTop: 7
						}}>
						{text}
					</Text>
					{lengthMore && !isReadMore && (
						<Text
							onPress={() => setReadMore(true)}
							style={{
								position: 'absolute',
								backgroundColor: 'rgba(0, 0, 0, 0.9)',
								paddingStart: 5,
								paddingVertical: 1,
								bottom: 0,
								right: 0,
								color: 'white',
								fontSize: 14,
								alignSelf: 'flex-end'
							}}>
							more
						</Text>
					)}
				</View>
			) : null}
		</>
	)
}
