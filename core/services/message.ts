import { delete_, get } from './http'
import { useQuery } from 'react-query'

type IconTypes =
	| 'feather'
	| 'fontAwesome'
	| 'materialIcon'
	| 'antDesign'
	| 'entypo'
	| 'evilIcons'
	| 'fontisto'
	| 'fontAwesome5'
	| 'foundation'
	| 'ionicons'
	| 'materialCommunityIcons'
	| 'octicons'
	| 'simpleLineIcons'
	| 'zocial'

export type Message = {
	id: number
	userid: string
	type: number
	message: string
	icon: string
	iconType: IconTypes
}

export function useMessage(type?: string) {
	return useQuery(['user-messages', type], () => get<Message[]>(`/message/${type}`))
}

export function deleteMessage(id: number) {
	return delete_(`/message/${id}`)
}
