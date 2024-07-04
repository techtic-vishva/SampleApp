import { Feather } from '@expo/vector-icons'
import * as React from 'react'
import { Dimensions, Pressable } from 'react-native'
import Animated, {
	SharedValue,
	useAnimatedProps,
	useAnimatedStyle,
	withSpring,
	withTiming
} from 'react-native-reanimated'
import Svg, { Circle, Defs, Stop, LinearGradient } from 'react-native-svg'
import { chattanoogaTapWater, dichotomousHippopotamus, green } from '../constants/Colors'
import { Challenges } from '../core/services/challenges'
import useTour from '../hooks/useTour'
import { View, Text } from './Themed'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const AnimatedSvg = Animated.createAnimatedComponent(Svg)
const minimumDisplayValue = 0.5

function hex2(c: number) {
	c = Math.round(c)
	if (c < 0) c = 0
	if (c > 255) c = 255

	var s = c.toString(16)
	if (s.length < 2) s = '0' + s

	return s
}

function color(r: number, g: number, b: number) {
	return '#' + hex2(r) + hex2(g) + hex2(b)
}

function shade(col: string, light: number) {
	light = light > 0 ? Math.min(light, 0.5) : Math.max(-0.5, light)

	// TODO: Assert that col is good and that -1 < light < 1

	var r = parseInt(col.substr(1, 2), 16)
	var g = parseInt(col.substr(3, 2), 16)
	var b = parseInt(col.substr(5, 2), 16)

	if (light < 0) {
		r = (1 + light) * r
		g = (1 + light) * g
		b = (1 + light) * b
	} else {
		r = (1 - light) * r + light * 255
		g = (1 - light) * g + light * 255
		b = (1 - light) * b + light * 255
	}

	return color(r, g, b)
}

export default ({
	progress,
	goal,
	achieved,
	sessionCount,
	onEditGoal,
	streakLength,
	sizeScalerOverride,
	challenges,
	onChallengePress
}: {
	progress: SharedValue<number>
	goal?: Duration
	achieved?: Duration
	sessionCount: number
	onEditGoal?: () => void
	streakLength?: number
	sizeScalerOverride?: number
	challenges?: Challenges[]
	onChallengePress?: () => void
}) => {
	const size = Dimensions.get('window').width * (sizeScalerOverride || 0.6)
	const r = size * 0.4
	const circumference = r * 2 * Math.PI

	const animatedStyle = useAnimatedStyle(() => {
		return {
			shadowOpacity: withTiming(progress.value >= 100 ? 0.6 : 0)
		}
	})

	const animatedProps = useAnimatedProps(() => {
		const value = progress.value || minimumDisplayValue
		const adjustedValue = value > 100 ? value % 100 : value

		return {
			strokeDashoffset: withSpring(circumference - (adjustedValue / 100) * circumference)
		}
	})

	const animatedPropsShadow = useAnimatedProps(() => {
		const value = progress.value || minimumDisplayValue
		const adjustedValue = (value > 100 ? value % 100 : value) + 0.4 // offset leading for shaddow effect

		return {
			strokeDashoffset: withSpring(circumference - (adjustedValue / 100) * circumference)
		}
	})

	const hasGoal = goal?.hours || goal?.minutes
	const hasStreak = streakLength !== undefined
	const challenge = challenges?.find((item) => item.status === 'in-progress' || item.status === 'success')

	const { TourGuideZone } = useTour('home')

	return (
		<View
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				flexDirection: 'row',
				backgroundColor: 'transparent'
			}}>
			{/* Ring center text */}
			<View
				style={{
					position: 'absolute',
					left: '35%',
					width: '30%',
					top: '33%',
					display: 'flex',
					alignItems: 'center',
					backgroundColor: 'transparent'
				}}>
				{/* Curent time */}
				<Text
					numberOfLines={1}
					adjustsFontSizeToFit={true}
					style={{
						paddingLeft: 0,
						color: 'white',
						textAlign: 'center',
						width: '100%',
						fontFamily: 'objektiv-semi-bold',
						fontSize: 40
					}}>{`${achieved?.hours ?? 0}:${(achieved?.minutes ?? 0).toString().padStart(2, '0')}`}</Text>

				{/* Session count */}
				{sessionCount > 0 && (
					<Text
						style={{
							paddingLeft: 0,
							color: 'white',
							textAlign: 'center',
							width: '100%',
							fontFamily: 'objektiv',
							fontSize: 13
						}}>
						{sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
					</Text>
				)}
			</View>

			{/* TL Complication */}
			<View
				style={{
					position: 'absolute',
					left: 0,
					width: '20%',
					display: 'flex',
					alignItems: 'flex-end',
					top: '20%',
					flexDirection: 'column',
					backgroundColor: 'transparent'
				}}>
				<Text
					style={{
						textAlign: 'center',
						color: chattanoogaTapWater,
						fontFamily: 'objektiv-semi-bold'
					}}>
					{parseInt(progress.value.toFixed(0), 10)}
					<Text style={{ fontSize: 8, color: chattanoogaTapWater, fontFamily: 'objektiv-semi-bold' }}>%</Text>
				</Text>
				<Text style={{ textAlign: 'center', color: chattanoogaTapWater, fontSize: 8 }}>Daily Time</Text>
			</View>

			{/* BL Complication */}
			{hasStreak && (
				<View
					style={{
						position: 'absolute',
						left: 0,
						width: '20%',
						display: 'flex',
						alignItems: 'flex-end',
						top: '70%',
						flexDirection: 'column',
						backgroundColor: 'transparent'
					}}>
					<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
						<Text
							style={{
								textAlign: 'center',
								color: chattanoogaTapWater,
								fontFamily: 'objektiv-semi-bold'
							}}>
							{streakLength}
						</Text>
						<Text style={{ fontSize: 10, paddingLeft: 2 }}>🔥</Text>
					</View>

					<Text style={{ textAlign: 'center', color: chattanoogaTapWater, fontSize: 8 }}>Day Streak</Text>
				</View>
			)}
			{/* activate challenge */}

			{challenge && (
				<Pressable
					onPress={onChallengePress}
					style={{
						paddingRight: 10,
						position: 'absolute',
						right: 0,
						width: '20%',
						display: 'none',
						alignItems: 'center',
						top: '70%',
						flexDirection: 'column',
						backgroundColor: 'transparent'
					}}>
					{challenge.status === 'success' && (
						<>
							<View
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									marginTop: 5
								}}>
								<Text
									numberOfLines={2}
									style={{
										fontSize: 8,
										color: chattanoogaTapWater,
										fontFamily: 'objektiv-semi-bold',
										textAlign: 'left'
									}}>
									Challenge Complete &nbsp; 🎉
								</Text>
							</View>
						</>
					)}
					{challenge.status !== 'success' && (
						<>
							<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								<Text
									style={{
										textAlign: 'center',
										color: chattanoogaTapWater,
										fontFamily: 'objektiv-semi-bold'
									}}>
									{`${challenge?.data.progress}/${challenge?.data.max}`}
								</Text>
								<Text style={{ fontSize: 10, paddingLeft: 2 }}>{'🚀'}</Text>
							</View>

							<Text
								adjustsFontSizeToFit={true}
								numberOfLines={1}
								style={{
									color: chattanoogaTapWater,
									fontSize: 8
								}}>
								Challenge Progress
							</Text>
						</>
					)}
				</Pressable>
			)}

			{/* TR Complication */}

			<Pressable
				onPress={onEditGoal}
				style={({ pressed }) => ({
					opacity: pressed ? 0.5 : 1,
					marginLeft: 'auto',
					paddingRight: 10,
					position: 'absolute',
					right: 0,
					width: '20%',
					display: 'flex',
					alignItems: 'flex-start',
					top: '20%',
					flexDirection: 'column',
					backgroundColor: 'transparent'
				})}>
				<TourGuideZone
					zone={1}
					text={`Welcome to Aro!:TITLE:And congratulations on taking this step towards developing a better relationship with your phone and in turn, a better relationship with everyone around you…including yourself.\n\nLet’s show you around.`}></TourGuideZone>
				<TourGuideZone
					zone={2}
					text={
						'Daily Aro Goal:TITLE:Aro starts you with a default goal of one hour a day of phone-free time.\n\nOur algorithms will periodically evaluate your habits and recommend an increase or decrease in your goal to ensure you are motivated to fill in that ring each day.\n\nTap your goal at any time to adjust it yourself.\n'
					}>
					{hasGoal && (
						<Text adjustsFontSizeToFit={true} numberOfLines={1}>
							{typeof goal?.hours === 'number' && goal.hours > 0 && (
								<Text
									style={{
										textAlign: 'center',
										color: chattanoogaTapWater,
										fontFamily: 'objektiv-semi-bold'
									}}>
									{`${goal.hours}`}
									<Text style={{ color: chattanoogaTapWater, fontSize: 8 }}> hr </Text>
								</Text>
							)}
							<Text
								style={{
									textAlign: 'center',
									color: chattanoogaTapWater,
									fontFamily: 'objektiv-semi-bold'
								}}>
								{`${goal?.minutes ?? 0}`}
								<Text style={{ color: chattanoogaTapWater, fontSize: 8 }}> min</Text>
							</Text>
						</Text>
					)}

					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={{ textAlign: 'center', color: chattanoogaTapWater, fontSize: 8 }}>Goal Time</Text>
						{typeof onEditGoal === 'function' && (
							<Feather name="edit-3" size={10} style={{ marginLeft: 5 }} color={chattanoogaTapWater} />
						)}
					</View>
				</TourGuideZone>
				<TourGuideZone
					zone={4}
					text={`Get Started:TITLE:That’s all you need to get started. Simply place your phone in the smart box to start your first session. It will connect automatically. Enjoy the break from your phone.`}></TourGuideZone>
			</Pressable>
			{/* Ring */}
			<AnimatedSvg
				width={size}
				height={size}
				style={[
					{ transform: [{ rotate: '270deg' }] },
					{ shadowColor: dichotomousHippopotamus, shadowRadius: r * 0.2 },
					animatedStyle,
					{ marginLeft: 'auto', marginRight: 'auto' }
				]}>
				<Defs>
					<LinearGradient id="gradient" x1={0} x2={0} y1={0} y2={1}>
						<Stop offset="0" stopColor={dichotomousHippopotamus} stopOpacity={1} />
						<Stop offset="100%" stopColor={shade(dichotomousHippopotamus, 0.2)} stopOpacity={1} />
					</LinearGradient>
					<LinearGradient id="gradient2" x1={1} x2={0} y1={0} y2={0}>
						<Stop offset="0" stopColor={dichotomousHippopotamus} stopOpacity={1} />
						<Stop offset="100%" stopColor={shade(dichotomousHippopotamus, 0.5)} stopOpacity={1} />
					</LinearGradient>
				</Defs>

				{/* Base Ring */}
				<Circle
					stroke={'#3d2204'}
					strokeWidth={20}
					r={r}
					cx={size / 2}
					cy={size / 2}
					strokeDasharray={[circumference]}
					strokeDashoffset={0}
				/>

				{
					/* Speacial Style for > 100% */

					progress.value > 100 && (
						<>
							{/* Fixed base circle */}
							<Circle
								stroke={dichotomousHippopotamus}
								strokeWidth={Math.min(progress.value <= 100 ? 20 : 20 + 2 * Math.floor(progress.value / 100), 30)}
								r={r}
								cx={size / 2}
								cy={size / 2}
								strokeDasharray={[circumference]}
								strokeDashoffset={0}
							/>

							{/* Dropshadow Path */}
							<AnimatedCircle
								stroke={shade(dichotomousHippopotamus, -0.2)}
								strokeWidth={Math.min(progress.value <= 100 ? 20 : 20 + 2 * Math.floor(progress.value / 100), 30)}
								r={r}
								cx={size / 2}
								cy={size / 2}
								strokeDasharray={[circumference]}
								strokeDashoffset={0}
								animatedProps={animatedPropsShadow}
								strokeLinecap={'round'}
								opacity={1}
							/>
						</>
					)
				}

				<AnimatedCircle
					stroke={progress.value > 100 ? 'url(#gradient2)' : 'url(#gradient)'}
					strokeWidth={Math.min(progress.value <= 100 ? 20 : 20 + 2 * Math.floor(progress.value / 100), 30)}
					r={r}
					cx={size / 2}
					cy={size / 2}
					strokeDasharray={[circumference]}
					strokeDashoffset={0}
					animatedProps={animatedProps}
					strokeLinecap={'round'}
					opacity={1}
				/>
			</AnimatedSvg>
		</View>
	)
}
