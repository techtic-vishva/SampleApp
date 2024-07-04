import React from 'react'
import ContactsComponent from '../../components/ContactsComponent'
import { useSmsReferral } from '../../hooks/useShareReferral'
import { OnboardingTabScreenProps } from '../../types'

function OnboardContacts({ navigation }: OnboardingTabScreenProps<'OnboardContacts'>) {
	const onShare = useSmsReferral('referral-share-contact-onboarding')

	return <ContactsComponent onShare={onShare} />
}

export default OnboardContacts
