import { useQuery } from 'react-query'
import { get, post } from './http'

export type Content = {
	id: number
	title: string
	description: string
	authorId: number
	authorName: string
	thumbnailUrl: string
	mediaUrl: string
	duration: Duration
	insertedOn: string
	updatedOn: string
	voidedOn: string
	name: string
	type: string
}
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

export type PlayList = {
	id: number
	title: string
	description: string
	author: number
	thumbnailUrl: string
	mediaUrl: string
	duration: Duration
	insertedOn: string
	updatedOn: string
	voidedOn: string
	icon: string
	iconType: IconTypes
	shortTitle: string
	sort: string
}

export type SocialMediaLinks = {
	fb: string
	li: string
}

export type Author = {
	id: number
	title: string
	description: string
	links: { [key: string]: any }
	name: string
	tagline: string
	thumbnail: string
	updatedOn: string
	voidedOn: string
}

export type PlayListType = {
	type: string
	contents: Content[]
	playlist: PlayList
}

export async function getAuthorById(id: number) {
	return get<Author>(`/content/author/${id}`)
}

export function useAuthorById(id: number) {
	return useQuery(['author', id], () => getAuthorById(id))
}

export async function getAuthorContent(authorId?: number) {
	return get<Content[]>(`/content?authorId=${authorId}`)
}

export function useAuthorContent(authorId?: number) {
	return useQuery(['author-content', authorId], () => getAuthorContent(authorId))
}

export async function getPlayListById(id: number) {
	return get<PlayList>(`/content/playlist/${id}`)
}

export function usePlaylistById(id: number) {
	return useQuery(['playlist', id], () => getPlayListById(id))
}

export function usePlayListContent(id: number) {
	return useQuery(['playlist-content', id], () => getPlayListContent(id))
}

export async function getPlayListContent(id: number) {
	return get<Content[]>(`/content/playlist/${id}/content`)
}

export function useContent(videoId: number) {
	return useQuery(['content', videoId], () => getContent(videoId))
}

export async function getContent(videoId: number) {
	return get<Content>(`/content/${videoId}`)
}

export function useRelatedContent(videoId: number) {
	return useQuery(['related-content', videoId], () => getRelatedContent(videoId))
}

export async function getRelatedContent(videoId: number) {
	return get<Content[]>(`/content/${videoId}/related`)
}

export async function getAuthorList() {
	return get<Author[]>(`/content/author`)
}

export function useAuthorList() {
	return useQuery(['author-list'], () => getAuthorList())
}

export function markContent(videoId: number) {
	return post(`/content/${videoId}/views`)
}

export async function getAuthor() {
	return get<Author[]>(`/content/author`)
}

export function useAuthor() {
	return useQuery(['author'], () => getAuthor())
}

export async function getPlayListOfType(typeCode: string) {
	return get<PlayListType>(`/content/playlist-type/${typeCode}`)
}

export function usePlaylistOfType(typeCode: string) {
	return useQuery(['playlist-type', typeCode], () => getPlayListOfType(typeCode))
}

export async function getPlayList(typeCode?: string) {
	return get<PlayList[]>(typeCode ? `/content/playlist?typeCode=${typeCode}` : `/content/playlist`)
}

export function usePlaylist(typeCode?: string) {
	return useQuery(['playlist', typeCode], () => getPlayList(typeCode))
}
