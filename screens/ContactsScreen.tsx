import { SettingsTabScreenProps } from '../types'
import { useSmsReferral } from '../hooks/useShareReferral'
import ContactsComponent from '../components/ContactsComponent'

export default function ContactsScreen({ navigation }: SettingsTabScreenProps<'Contacts'>) {
	const onShare = useSmsReferral('referral-share-contact')

	return <ContactsComponent onShare={onShare} />
}
