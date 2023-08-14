import axios from "axios";

import { Track } from '../models/Track'
import { Artist } from "../models/Artist";

export async function getLikedTracksService(): Promise<Array<Track>> {
    try {
        let tracksRemaining: boolean = true;
        let likedTracksURL: string = "https://api.spotify.com/v1/me/tracks?limit=50&offset=0";

        let tracklist: Array<Track> = []
        while (tracksRemaining) {
            // Get tracks
            console.log("Here")
            const { data } = await axios.get(likedTracksURL);

            console.log(data)


            const myTracksResponse = data

            // Remove excess data
            for(let i=0; i < myTracksResponse.items.length; i++) {
                const track = myTracksResponse.items[i].track

                const trackArtists: Array<Artist> = track.artists.map(artist => {
                    return new Artist(
                        [],
                        artist.href,
                        artist.id,
                        artist.name
                    )
                })

                const trackPlaceholder: Track = {
                    artists: trackArtists,
                    href: track.href,
                    id: track.id,
                    name: track.name,
                    type: track.type,
                    genres: []
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
    } catch(error) {
        console.log(error)
        throw new Error("Error while getting user's liked tracks")
    }
}