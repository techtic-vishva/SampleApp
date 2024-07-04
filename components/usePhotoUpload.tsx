import { launchCamera, launchImageLibrary, MediaType, PhotoQuality } from 'react-native-image-picker'
import { uploadProfilePhoto } from '../core/services/user'
import { mark } from '../core/services/achievement'
import { uploadGroupPhoto } from '../core/services/group'

export type Options = {
	photoType: 'household' | 'profile'
	groupId?: string
}

const defaultOptions: Options = { photoType: 'profile' }

export function usePhotoUpload(onSuccess: () => {} | void) {
	return async (type: 'select' | 'camera', options = defaultOptions) => {
		const config = {
			mediaType: 'photo' as MediaType,
			maxWidth: 400,
			maxHeight: 400,
			quality: 0.7 as PhotoQuality
		}
		const result = type === 'select' ? await launchImageLibrary(config) : await launchCamera(config)
		if (result.assets === undefined || result.assets[0] === undefined) {
			if (result.errorCode || result.errorMessage) console.log(result)
			return
		}

		const asset = result.assets[0]
		if (typeof asset?.fileName === 'string' && typeof asset?.uri === 'string' && typeof asset?.type === 'string') {
			if (options.photoType === 'household' && options.groupId) {
				await uploadGroupPhoto({ fileName: asset.fileName, uri: asset.uri, type: asset.type, groupId: options.groupId })
			} else if (options.photoType === 'profile') {
				await uploadProfilePhoto({ fileName: asset.fileName, uri: asset.uri, type: asset.type })
				await mark('profile-photo')
			} else {
				// Unknown photo type
			}

			onSuccess()
		}
	}
}
