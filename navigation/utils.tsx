import { navigationRef } from '.'


export function navigateTo(name: string, params: any) {
	if (navigationRef.isReady()) {
		// @ts-ignore
		navigationRef.navigate(name, params)
	}
}
