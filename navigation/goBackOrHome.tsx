export type Nav = {
	canGoBack: () => boolean
	goBack: () => void
	navigate: (path: string) => void
}

export default function goBackOrHome(navigation: Nav, path: string = 'Root') {
	if (!navigation) return
	if (navigation.canGoBack()) navigation.goBack()
	else navigation.navigate(path)
}
