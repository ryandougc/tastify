import { ITrackEntry } from "../interfaces/ITrack"
import { IArtistEntry, IArtist } from '../interfaces/IArtist'

export async function appendGenresToTracksService(mapOfTracks: Map<string, ITrackEntry>, mapOfArtists: Map<string, IArtistEntry>): Promise<Map<string, ITrackEntry>> {
    try {
         for (const trackData of mapOfTracks.values()) {
            const primaryArtist = trackData.artists[0];

            if (mapOfArtists.has(primaryArtist.id)) {
                trackData.artists[0].genres = mapOfArtists.get(
                    primaryArtist.id
                ).genres;
            }
        }

        return mapOfTracks
    } catch(err) {
        return undefined
    }
}