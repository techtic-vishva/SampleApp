import { AndroidConfig, withStringsXml } from '@expo/config-plugins'
import { ExpoConfig } from '@expo/config-types'

/*
    Android Beacons service that runs on boot expects 2 resource strings.
    This config fixes Aro app crashes on boot.
    https://github.com/martinmanzo/react-native-beacons-manager/blob/master/android/src/main/java/com/mackentoch/beaconsandroid/BeaconsAndroidTransitionService.java#L29
*/
export default (expoConfig: ExpoConfig) => {
	return withStringsXml(expoConfig, (modConfig) => {
		modConfig.modResults = AndroidConfig.Strings.setStringItem(
			[
				// XML represented as JSON
				// <string name="notification_channel_name" translatable="false">value</string>
				{ $: { name: 'notification_channel_name', translatable: 'false' }, _: 'Aro' },
				{ $: { name: 'notification_channel_description', translatable: 'false' }, _: 'Aro notifications' }
			],
			modConfig.modResults
		)
		return modConfig
	})
}
