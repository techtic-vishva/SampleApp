import { get } from './http'
import { useQuery } from 'react-query'

export type Media = {
    uri: string,
    aspectRatio: number
}

export function useMedia() {
    return useQuery('media', () => get<Media>('/media/gif'))
}

export function useVideo(slug: string) {
    return useQuery(['video', slug], () => get<{
        url: string
    }>(`/media/video/${slug}`))
}