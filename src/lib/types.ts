import { Track } from '../models/Track'
import { Artist } from '../models/Artist'

export type Top50 = { 
    tracks: Array<Track>
    artists: Array<Artist>
}

export type TrackEntry = {
    count: number
    track: Track
}

export type ArtistEntry = {
    count: number,
    artist: Artist
}

export type ArtistResponse = {
    external_urls: {
        spotify: string
    }
    followers: {
        href: string,
        total: number
    }
    genres: Array<string>
    href: string
    id: string
    images: Array<{
        url: string,
        height: number,
        width: number
    }>
    name: string
    popularity: number
    type: "artist" | 'Artist'
    uri: string
}