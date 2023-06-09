import axios from "axios";

import { ITrackEntry } from "../interfaces/ITrack"
import { IArtistEntry, IArtist } from '../interfaces/IArtist'

export async function getArtistsFromTracksService(mapOfTracks: Map<string, ITrackEntry>): Promise<Map<string, IArtistEntry>> {
    try {
        // Create map of top tracks primary artists
        const mapOfArtists: Map<string, IArtistEntry> = new Map();

        for (const value of mapOfTracks.values()) {
            const currentTrackPrimaryArtist: IArtist = value.artists[0];

            if (!mapOfArtists.has(currentTrackPrimaryArtist.id)) {
                const newArtist: IArtistEntry = Object.assign(currentTrackPrimaryArtist, { count: 1 });

                mapOfArtists.set(currentTrackPrimaryArtist.id, newArtist);
            } else {
                mapOfArtists.get(currentTrackPrimaryArtist.id).count += 1;
            }
        }

        return mapOfArtists
    } catch(err) {
        return undefined
    }
}