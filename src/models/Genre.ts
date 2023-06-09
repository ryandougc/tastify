import { Track } from './Track'
import { Artist } from './Artist'

export interface Genre {
    name: string;
    count: number;
    tracks: Array<Track>
    artists: Array<Artist>
}


export class Genre implements Genre {
    constructor(name: string, count: number, tracks: Array<Track>, artists: Array<Artist>) {
        this.name = name;
        this.count = count;
        this.tracks = tracks;
        this.artists = artists
    }
}