import { Artist } from './Artist'

type TrackType = 'track' | 'Track' 

export interface Track {
    artists: Array<{ name: string, id: string }>
    href: string
    id: string
    name:  string
    type: TrackType
}

export interface TrackEntry {
    count: number
    track: Track
}

export class Track implements Track {
    constructor(artists: Array<{ name: string, id: string }>, href: string, id: string, name: string, type: TrackType) {
        this.artists = artists
        this.href = href
        this.id = id
        this.name = name
        this.type = type
    }
}