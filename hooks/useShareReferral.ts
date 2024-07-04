import { Linking, Platform, Share } from 'react-native'
import { logAction } from '../core/services/tracking'
import { useUser } from '../core/services/user'

function getSMSDivider(): string {
	return Platform.OS === 'ios' ? '&' : '?'
}

function buildMessage(referralCode: string): string {
	return `Get a free Aro Home device and membership discount when you join with my link: \nhttps://checkout.goaro.com/r/${referralCode}`
}

export function useShareReferral(trackingCode: string) {
	const { data } = useUser()

	return () => {
		if (!data?.referralInviteCode) return

		Share.share({
			message: buildMessage(data?.referralInviteCode)
		}).then((result) => {
			if (result.action !== Share.dismissedAction) {
				logAction({ code: trackingCode, metadata: {} }).catch(() => {})
			}
		})
	}
}

export function useSmsReferral(trackingCode: string) {
	const { data } = useUser()

	return (phoneNumber?: string) => {
		if (!data?.referralInviteCode) return
		if (!phoneNumber) return

		Linking.openURL(`sms:${phoneNumber}${getSMSDivider()}body=${buildMessage(data?.referralInviteCode)}`).then(() => {
			logAction({ code: trackingCode, metadata: {} }).catch(() => {})
		})
	}
}
