import { Artist } from './Artist'

type TrackType = 'track' | 'Track' 

export interface Track {
    artists: Array<Artist>
    href: string
    id: string
    name:  string
    type: TrackType
    genres: Array<string>
}

export class Track implements Track {
    constructor(artists: Array<Artist>, href: string, id: string, name: string, type: TrackType) {
        this.artists = artists
        this.href = href
        this.id = id
        this.name = name
        this.type = type
        this.genres = []
    }
}