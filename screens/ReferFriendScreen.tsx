import ReferFriend from '../components/ReferFriend'
import { useShareReferral } from '../hooks/useShareReferral'
import { SettingsTabScreenProps } from '../types'

export default function ReferFriendScreen({ navigation }: SettingsTabScreenProps<'ReferFriend'>) {
	const onShare = useShareReferral('referral-share-link')

	return <ReferFriend onInviteContact={() => navigation.navigate('Contacts')} onShare={onShare} />
}
