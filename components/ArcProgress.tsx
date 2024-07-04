import * as React from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Path, Text as TextPath } from 'react-native-svg'
import Animated, { interpolate } from 'react-native-reanimated'
import { dichotomousHippopotamus } from '../constants/Colors'
import { View, Text } from './Themed'

const { multiply } = Animated
const { width } = Dimensions.get('window')
const size = width * 0.8
const strokeWidth = 30
const AnimatedPath = Animated.createAnimatedComponent(Path)
const { PI, cos, sin } = Math
const r = (size - strokeWidth) / 2
const cx = size / 2
const cy = size / 2
const A = PI
const startAngle = PI
const endAngle = 2 * PI
// A rx ry x-axis-rotation large-arc-flag sweep-flag x y
const x1 = cx - r * cos(startAngle)
const y1 = -r * sin(startAngle) + cy
const x2 = cx - r * cos(endAngle)
const y2 = -r * sin(endAngle) + cy
const d = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`

interface ArcPogressProps {
	progress: number
	goal?: Duration
	achieved?: Duration
}

// https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/bonuses/circular-progress/App.tsx
export default ({ progress, goal, achieved }: ArcPogressProps) => {
	const circumference = r * A
	const α = interpolate(progress, [0, 1], [0, A])
	const strokeDashoffset = multiply(α, r)

	return (
		<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Svg width={size} height={r}>
				<Defs>
					<LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
						<Stop offset="0" stopColor={dichotomousHippopotamus} />
						<Stop offset="1" stopColor={dichotomousHippopotamus} />
						{/* <Stop offset="0" stopColor="#f7cd46" />
                        <Stop offset="1" stopColor="#ef9837" /> */}
					</LinearGradient>
				</Defs>
				<Path
					stroke="url(#grad)"
					fill="none"
					strokeDasharray={`${circumference}, ${circumference}`}
					{...{ d, strokeWidth: strokeWidth - 1 }}
				/>
				<AnimatedPath
					// stroke="#f18f35"
					stroke="#3d2204"
					fill="none"
					strokeDasharray={`${circumference}, ${circumference}`}
					{...{ d, strokeDashoffset, strokeWidth }}
				/>
				<TextPath
					x={'50%'}
					y={'80%'}
					textAnchor="middle"
					fontSize={50}
					fill={'white'}
					fontFamily={'objektiv-semi-bold'}>
					{`${achieved?.hours ?? 0}:${(achieved?.minutes ?? 0).toString().padStart(2, '0')}`}
				</TextPath>
			</Svg>
			<View>
				{/* <Text style>
                    Testing
                </Text> */}
			</View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginTop: 10
				}}>
				<Text
					style={{
						fontFamily: 'objektiv-semi-bold',
						width: '30%',
						textAlign: 'center',
						paddingRight: '3%'
					}}>
					0:00
				</Text>
				<Text style={{ textAlign: 'center', flex: 1, flexGrow: 1 }}>Daily Time</Text>
				{(progress ?? 0) >= 1.0 ? (
					<Text style={{ textAlign: 'center', width: '30%' }}>Goal Met!</Text>
				) : (
					<Text
						style={{
							fontFamily: 'objektiv-semi-bold',
							width: '30%',
							textAlign: 'center',
							paddingLeft: '3%'
						}}>{`${goal?.hours ?? 0}:${(goal?.minutes ?? 0).toString().padStart(2, '0')}`}</Text>
				)}
			</View>
		</View>
	)
}
