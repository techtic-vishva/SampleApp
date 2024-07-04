const colors = ['red', 'blue', 'green', 'white', 'purple', 'orange', 'yellow']

export function debugBorder() {
	return {
		borderWidth: 1,
		borderColor: colors[Math.floor(Math.random() * colors.length)]
	}
}
