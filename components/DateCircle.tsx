import React from 'react'
import { Dimensions } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { dichotomousHippopotamus } from '../constants/Colors'

export default function DateCircle({
	progress,
	lineWidth,
	widthPercent,
	widthPixels,
	includeShadow,
	colorOverride,
	goalProgress
}: {
	progress: number
	lineWidth: number
	includeShadow?: boolean
	widthPercent?: number
	widthPixels?: number
	colorOverride?: string
	goalProgress?: number
}) {
	if (widthPercent === undefined && widthPixels === undefined) {
		throw 'Must specify either `widthPercent` or `widthPixels`.'
	}

	progress = progress * 100
	const adjustedValue = Math.min(100, goalProgress ? goalProgress : progress)
	const size = widthPixels || Dimensions.get('window').width * (widthPercent || 0)
	const r = size * 0.4
	const circumference = r * 2 * Math.PI
	return (
		<Svg
			width={size}
			height={size}
			style={[
				{ transform: [{ rotate: '270deg' }] },
				adjustedValue >= 100
					? {
							shadowColor: dichotomousHippopotamus,
							shadowOffset: { width: 0, height: 0 },
							shadowRadius: r * 0.3,
							shadowOpacity: 0.8
					  }
					: {}
			]}>
			{includeShadow !== false && (
				<Circle
					stroke={'#3d2204'}
					strokeWidth={lineWidth}
					r={r}
					cx={size / 2}
					cy={size / 2}
					strokeDasharray={[circumference]}
					strokeDashoffset={0}
				/>
			)}
			<Circle
				stroke={colorOverride || dichotomousHippopotamus}
				strokeWidth={lineWidth}
				r={r}
				cx={size / 2}
				cy={size / 2}
				strokeDasharray={[circumference]}
				strokeDashoffset={circumference - (adjustedValue / 100) * circumference}
				strokeLinecap={'round'}
			/>
		</Svg>
	)
}
