import axios from "axios";

import { Top50 } from '../lib/types'

import { Track } from "../models/Track";
import { Artist } from "../models/Artist";



export async function getTop50Service(): Promise<Top50> {
    const newTop50: Top50 = {
        tracks: await getTop50TracksService(),
        artists: await getTop50ArtistsService()
    }

    return newTop50
}

async function getTop50TracksService(): Promise<Track[]> {
    try {
        let tracksRemaining: boolean = true;
        let url: string = "https://api.spotify.com/v1/me/top/tracks?offset=0&limit=50&time_range=medium_term";

        let tracklist: Array<Track> = []


        while (tracksRemaining) {
            // Get top tracks
            const { data :myTopTracksResponse } = await axios.get(url);

            // Remove excess data
            for(let i=0; i < myTopTracksResponse.items.length; i++) {
                const track = myTopTracksResponse.items[i]

                const trackArtist: Artist = new Artist(
                    [],
                    track.artists[0].href,
                    track.artists[0].id,
                    track.artists[0].name
                )

                const trackPlaceholder: Track = {
                    artists: [trackArtist],
                    href: track.href,
                    id: track.id,
                    name: track.name,
                    type: track.type,
                    genres: []
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
        throw new Error(`Error while fetching user's top 50 tracks`)
    }
}

async function getTop50ArtistsService(): Promise<Artist[]> {
    try {
        let artistsRemaining: boolean = true;
        let url: string = "https://api.spotify.com/v1/me/top/artists?offset=0&limit=50&time_range=medium_term";

        let artistList: Array<Artist> = []


        while (artistsRemaining) {
            // Get top artists
            const { data :myTopTracksArtists } = await axios.get(url);

            // Remove excess data
            for(let i=0; i < myTopTracksArtists.items.length; i++) {
                const artist = myTopTracksArtists.items[i]

                const artistPlaceholder: Artist = {
                    genres: artist.genres,
                    href: artist.href,
                    id: artist.id,
                    name: artist.name,
                    popularity: artist.popularity
                }

                artistList.push(artistPlaceholder)
            }

            // Check if there is a next url to run to get more artists
            if (myTopTracksArtists.next) {
                url = myTopTracksArtists.next;
            } else {
                artistsRemaining = false;
            }
        }

        return artistList
    } catch(err) {
        throw new Error(`Error while fetching user's top 50 artists`)
    }
}