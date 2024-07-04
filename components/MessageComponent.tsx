import React, { useEffect, useState } from 'react'
import { LayoutAnimation, Platform } from 'react-native'
import { chattanoogaTapWater } from '../constants/Colors'
import { deleteMessage, useMessage } from '../core/services/message'
import DynamicIcon from './DynamicIcon'
import { Text, View } from './Themed'
import TinderCard from 'react-tinder-card'
import { useIsFocused } from '@react-navigation/native'

export default function ({
	type,
	onTouchEnd,
	onTouchStart
}: {
	type?: string
	onTouchStart: () => void
	onTouchEnd: () => void
}) {
	const { data, isLoading, refetch } = useMessage(type ?? '')
	const [messageList, setMessageList] = useState(data)

	const isFocused = useIsFocused()

	let messageState = data

	//Refetch the messages
	useEffect(() => {
		isFocused && refetch()
	}, [isFocused])

	// Seed Message List
	useEffect(() => {
		if (isLoading) return
		setMessageList(data)
	}, [data, isLoading])

	const swiped = (id: number) => {
		deleteMessage(id).then(() => {})
	}

	const outOfFrame = (id: number) => {
		messageState = messageState && messageState.filter((message) => message.id !== id)
		setMessageList(messageState)

		// Animate Component Being Removed
		if (messageState && messageState.length == 0 && Platform.OS === 'ios') {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
		}
	}

	if (messageList && messageList.length == 0) {
		return <></>
	} else
		return (
			<View
				onTouchStart={onTouchStart}
				onTouchEnd={onTouchEnd}
				style={{
					width: '100%',
					height: 130,
					paddingLeft: 20,
					paddingRight: 20,
					marginVertical: 20,
					backgroundColor: 'transparent'
				}}>
				{messageList &&
					messageList.map((message, index) => (
						<TinderCard
							key={message.id}
							onSwipe={() => swiped(message.id)}
							onCardLeftScreen={() => outOfFrame(message.id)}>
							<View
								style={{
									padding: 20,
									borderWidth: 1,
									borderColor: chattanoogaTapWater,
									alignItems: 'center',
									borderRadius: 10,
									height: 130,
									width: '100%',
									flexDirection: 'row',
									position: 'absolute',
									display: 'flex'
								}}>
								<DynamicIcon
									name={message.icon}
									type={message.iconType}
									color="white"
									size={30}
									style={{ marginRight: 20 }}
								/>
								<Text
									ellipsizeMode="tail"
									numberOfLines={3}
									adjustsFontSizeToFit
									style={{ fontFamily: 'objektiv-semi-bold', flex: 1, fontSize: 18 }}>
									{message.message}
								</Text>
								{messageList && messageList.length > 1 && (
									<View
										style={{
											height: 35,
											width: 35,
											borderColor: chattanoogaTapWater,
											borderRadius: 50,
											position: 'absolute',
											top: -17,
											alignItems: 'center',
											right: -10,
											borderWidth: 1,
											justifyContent: 'center'
										}}>
										<Text style={{ fontSize: 17, fontFamily: 'objektiv-semi-bold' }}>{index + 1}</Text>
									</View>
								)}
							</View>
						</TinderCard>
					))}
			</View>
		)
}
