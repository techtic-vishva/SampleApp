import { withInfoPlist, InfoPlist, withAndroidManifest, AndroidConfig } from '@expo/config-plugins'
import { ExpoConfig } from '@expo/config-types'

// https://github.com/Rapsssito/react-native-background-actions/blob/master/INSTALL.md
export default (expoConfig: ExpoConfig) => {
	expoConfig = withBackgroundActionsInfoPlist(expoConfig)
	expoConfig = withBackgroundActionsAndroidManifest(expoConfig)

	return expoConfig
}

const withBackgroundActionsInfoPlist = (expoConfig: ExpoConfig) => {
	return withInfoPlist(expoConfig, (config) => {
		config.modResults = addTaskScheduler(config.modResults)
		return config
	})
}

const addTaskScheduler = (infoPlist: InfoPlist) => {
	if (!Array.isArray(infoPlist.BGTaskSchedulerPermittedIdentifiers)) {
		infoPlist.BGTaskSchedulerPermittedIdentifiers = []
	}

	infoPlist.BGTaskSchedulerPermittedIdentifiers.push('$(PRODUCT_BUNDLE_IDENTIFIER)')

	return infoPlist
}

const withBackgroundActionsAndroidManifest = (expoConfig: ExpoConfig) => {
	return withAndroidManifest(expoConfig, (config) => {
		config.modResults = addAndroidPermissions(config.modResults)
		config.modResults = addAndroidServices(config.modResults)
		return config
	})
}

const addAndroidPermissions = (androidManifest: AndroidConfig.Manifest.AndroidManifest) => {
	addAndroidPermission(androidManifest, 'FOREGROUND_SERVICE')
	addAndroidPermission(androidManifest, 'WAKE_LOCK')

	return androidManifest
}

const addAndroidPermission = (androidManifest: AndroidConfig.Manifest.AndroidManifest, permission: string) => {
	if (!Array.isArray(androidManifest.manifest['uses-permission'])) {
		androidManifest.manifest['uses-permission'] = []
	}

	if (
		!androidManifest.manifest['uses-permission'].find(
			(item) => item.$['android:name'] === `android.permission.${permission}`
		)
	) {
		androidManifest.manifest['uses-permission']?.push({
			$: {
				'android:name': `android.permission.${permission}`
			}
		})
	}
}

const addAndroidServices = (androidManifest: AndroidConfig.Manifest.AndroidManifest) => {
	if (!Array.isArray(androidManifest.manifest.application)) {
		throw new Error('Could not find application config in AndroidManifest.xml')
	}

	if (androidManifest.manifest.application.length !== 1) {
		throw new Error('Expecting a single application in AndroidManifest.xml')
	}

	const application = androidManifest.manifest.application[0]

	addAndroidService(application, 'com.asterinet.react.bgactions.RNBackgroundActionsTask')

	return androidManifest
}

const addAndroidService = (application: AndroidConfig.Manifest.ManifestApplication, serviceName: string) => {
	if (!Array.isArray(application.service)) {
		application.service = []
	}

	if (!application.service.find((item) => item.$['android:name'] === serviceName)) {
		application.service?.push({
			$: {
				'android:name': serviceName
			}
		})
	}
}
