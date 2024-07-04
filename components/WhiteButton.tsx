import OrangeButton, { ButtonProps } from './OrangeButton'

export default function (props: ButtonProps) {
	return (
		<OrangeButton
			{...props}
			textColorOverride="white"
			outterStyle={Object.assign({ backgroundColor: 'transparent', borderColor: 'white' }, props.outterStyle || {})}
		/>
	)
}
