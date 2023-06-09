import axios from "axios";

import { ITrack, ITracklist } from "../interfaces/ITrack"
import { Track } from "../models/Track";

export async function getTop50TracksService(): Promise<Track[]> {
    console.log("We shouldn't be reaching this")
    try {
        let tracksRemaining: boolean = true;
        let url: string = "https://api.spotify.com/v1/me/top/tracks?offset=0&limit=50&time_range=medium_term";

        let tracklist: ITracklist = []


        while (tracksRemaining) {
            // Get top tracks
            const { data :myTopTracksResponse } = await axios.get(url);

            // Remove excess data
            for(let i=0; i < myTopTracksResponse.items.length; i++) {
                const track = myTopTracksResponse.items[i]

                const trackPlaceholder: ITrack = {
                    artists: track.artists,
                    href: track.href,
                    id: track.id,
                    name: track.name,
                    type: track.type
                }

                tracklist.push(trackPlaceholder)
            }

            // Check if there is a next url to run to get more tracks
            if (myTopTracksResponse.next) {
                url = myTopTracksResponse.next;
            } else {
                tracksRemaining = false;
            }
        }

        // Return master array of top 50 tracks
        return tracklist
    } catch(err) {
        return undefined
    }
}
