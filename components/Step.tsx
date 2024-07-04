import React from 'react'
import { View } from 'react-native'

export default function Step(active: number, total: number = ONBOARDING_STEPS, style: {}) {
	const step = active - 1 // 0 based indexing
	return (
		<View style={[{ flexDirection: 'row' }, style]}>
			{Array.from(Array(total)).map((_, i) => {
				const active = step === i
				return (
					<View
						key={i}
						style={{
							width: active ? 60 : 5,
							borderRadius: 5,
							backgroundColor: 'white',
							height: active ? 3 : 5,
							marginHorizontal: 5,
							opacity: active ? undefined : 0.5,
							marginTop: active ? 1 : 0
						}}
					/>
				)
			})}
		</View>
	)
}

export const ONBOARDING_STEPS = 4
