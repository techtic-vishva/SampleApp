import { View } from '../../components/Themed'
import { fill } from '../../constants/Colors'

export default function SettingGroup({
	children,
	isDev
}: {
	children: React.ReactChild[] | React.ReactChild
	isDev?: boolean
}) {
	return (
		<View
			style={[
				{
					marginBottom: 30,
					backgroundColor: fill,
					borderRadius: 15,
					paddingHorizontal: 20,
					paddingVertical: 5,
					width: '100%'
				},
				isDev ? { marginTop: 30, opacity: 0.3 } : {}
			]}>
			{children}
		</View>
	)
}
