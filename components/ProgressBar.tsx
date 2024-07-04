import { chattanoogaTapWater, dichotomousHippopotamus, green } from '../constants/Colors'
import { View } from './Themed'

export default function ({ count, max }: { count: number; max: number }) {
	const isComplete = count >= max
	return (
		<View
			style={{
				marginVertical: 3,
				backgroundColor: chattanoogaTapWater,
				height: 5,
				width: '100%',
				borderRadius: 20,
				flexDirection: 'row'
			}}>
			<View
				style={{
					width: `${(count / max) * 100}%`,
					backgroundColor: isComplete ? green : dichotomousHippopotamus,
					borderRadius: 20
				}}></View>
		</View>
	)
}
