import axios from "axios";

import { Track } from '../models/Track'

export async function getLikedTracksService(): Promise<Array<Track>> {
    try {
        let tracksRemaining: boolean = true;
        let likedTracksURL: string = "https://api.spotify.com/v1/me/tracks?offset=0&limit=50";

        let tracklist: Array<Track> = []

        while (tracksRemaining) {
            // Get tracks
            const { data :myTracksResponse } = await axios.get(likedTracksURL);

            // Remove excess data
            for(let i=0; i < myTracksResponse.items.length; i++) {
                const track = myTracksResponse.items[i]

                const trackPlaceholder: Track = {
                    artists: track.artists,
                    href: track.href,
                    id: track.id,
                    name: track.name,
                    type: track.type
                }

                tracklist.push(trackPlaceholder)
            }

            // Check if there is a next url to run to get more tracks
            if (myTracksResponse.next) {
                likedTracksURL = myTracksResponse.next;
            } else {
                tracksRemaining = false;
            }
        }

        // Return master array of all liked tracks
        return tracklist
    } catch(err) {
        console.log("Error while getting liked tracks")

        return []
    }
}