import React from 'react'
import ReferFriend from '../../components/ReferFriend'
import { setIsOnboarded } from '../../core/GlobalState'
import { update } from '../../core/services/user'
import { useShareReferral } from '../../hooks/useShareReferral'
import { OnboardingTabScreenProps } from '../../types'

function OnboardReferFriend({ navigation }: OnboardingTabScreenProps<'OnboardReferFriend'>) {
	const onShare = useShareReferral('referral-share-link-onboarding')

	return (
		<ReferFriend
			showSkip={true}
			onSkip={() => {
				update({ metadata: { hasOnboarded: true } }).then(() => setIsOnboarded(true, true))
			}}
			onInviteContact={() => navigation.navigate('OnboardContacts')}
			onShare={onShare}
		/>
	)
}

export default OnboardReferFriend
