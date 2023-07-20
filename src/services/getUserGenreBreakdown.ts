 /*

An analysis object is Analysis {
    genres: []
}

*/

import axios from "axios";

import { ArtistResponse, TrackEntry } from "../lib/types"
import { ArtistEntry } from "../lib/types";

import { Track } from '../models/Track'
import { Genre } from '../models/Genre'
import { Artist } from '../models/Artist'

// Put these functions directly into this 
import { getLikedTracksService } from './getLikedTracks'
import { getPlaylistTracksService } from './getPlaylistTracks'

// THIS IS WHERE THE FAKE ACCESS TOKEN IS COMING FROM
const FAKE_ACCESS_TOKEN = 'THIS IS A FAKE ACCESS TOKEN'

export async function getUserGenreBreakdownService(): Promise<Map<string, Genre>> {
    axios.defaults.headers.common["Authorization"] = `Bearer ${FAKE_ACCESS_TOKEN}`
    axios.defaults.responseType = "json";

    // Get all tracks in arrays
    let likedTracks: Array<Track> = await getLikedTracksService()
    let playlistTracks: Array<Track> = await getPlaylistTracksService()

    if(likedTracks.length === 0 && playlistTracks.length === 0) throw new Error("This user does not have any liked tracks or playlit tracks")

    // Sort the arrays of tracks into a map of all tracks
    const allTracksMap: Map<string, TrackEntry> = new Map()

    await pushArrayOfTracksToMap(likedTracks, allTracksMap)

    await pushArrayOfTracksToMap(playlistTracks, allTracksMap)

    // Get map of artists from tracks map
    const allArtistsMap: Map<string, ArtistEntry> = await getArtistsFromAllTracksMap(allTracksMap)
    
    // Pull artist data from Spotify for each unique artist
    const artistResponseData: Array<ArtistResponse> = await getArtistGenres(allArtistsMap)

    // Append artist data to the artists and tracks maps
    await appendGenresToArtists(allArtistsMap, artistResponseData)

    await appendGenresToTracks(allTracksMap, allArtistsMap)

    // Create a map of genres from tracks map & add the tracks to each genre
    const allGenresMap: Map<string, Genre> = await createMapOfGenres(allTracksMap)   

    return allGenresMap
}

export async function pushArrayOfTracksToMap(tracks: Array<Track>, allTracksMap: Map<string, TrackEntry>): Promise<void> {
    try {
        if(tracks.length === 0) return

        tracks.forEach(track => {
            if(track.type === "track") {
                if (!allTracksMap.has(track.id)) {
                    const trackEntry: TrackEntry = Object.assign(track, { count: 1, track: track })
        
                    allTracksMap.set(trackEntry.track.id, trackEntry); 
                } else {
                    allTracksMap.get(track.id).count += 1;
                }
            }
        })
    } catch(error) {
        console.log(error)

        throw new Error('An error occurred while pushing tracks to a map')
    }
}

export async function getArtistsFromAllTracksMap(mapOfTracks: Map<string, TrackEntry>): Promise<Map<string, ArtistEntry>> {
    try {
        // Create map of top tracks primary artists
        const mapOfArtists: Map<string, ArtistEntry> = new Map();

        for (const value of mapOfTracks.values()) {
            const currentTrackPrimaryArtist: Artist = new Artist(
                [],
                value.track.artists[0].href,
                value.track.artists[0].id,
                value.track.artists[0].name
            )

            if (mapOfArtists.has(currentTrackPrimaryArtist.id) ) {
                mapOfArtists.get(currentTrackPrimaryArtist.id).count += 1
            } else {
                const newArtist: ArtistEntry = { count: 1, artist: currentTrackPrimaryArtist }

                mapOfArtists.set(currentTrackPrimaryArtist.id, newArtist)
            }
        }

        return mapOfArtists
    } catch(error) {
        console.log(error)

        throw new Error('An error occurred while creating a map of artists from the map of all tracks')
    }
}

export async function getArtistGenres(allArtistsMap: Map<string, ArtistEntry>): Promise<Array<ArtistResponse>> {
    try {
        let arrayOfArtistIds = Array.from(allArtistsMap.keys())

        let artistResponses: Array<ArtistResponse> = []
        
        let artistsRemaining = true
        let leftMarker = 0
        let rightMarker = 50

        while(artistsRemaining) {
            const newStringSection: string = arrayOfArtistIds.slice(leftMarker, rightMarker).toString()

            const artistResponse = await axios.get(
                `https://api.spotify.com/v1/artists?ids=${newStringSection}`
            )

            artistResponses.push(...artistResponse.data.artists)

            if(rightMarker >= arrayOfArtistIds.length) { 
                artistsRemaining = false 
                continue
            }

            leftMarker += 50
            rightMarker += 50
        }        

        return artistResponses
    } catch(error) {
        console.log(error)

        throw new Error("An error occurred while fetching artist data from Spotify API")
    }
}

export async function appendGenresToArtists(allArtistsMap: Map<string, ArtistEntry>, artistResponses: Array<ArtistResponse>): Promise<void> {
    try {
        artistResponses.forEach(artistData => {
            if(allArtistsMap.has(artistData.id)) {
                allArtistsMap.get(artistData.id).artist.genres = artistData.genres
            }

        })
    } catch(error) {
        console.log(error)
        throw new Error("An error occurred while appending genres to artists map")
    }
}

export async function appendGenresToTracks(allTracksMap: Map<string, TrackEntry>, allArtistsMap: Map<string, ArtistEntry>): Promise<void> {
    try {
        for (const trackEntry of allTracksMap.values()) {
            const track = trackEntry.track

            track.genres = allArtistsMap.get(track.artists[0].id).artist.genres
        }
    } catch(error) {
        console.log(error)
        throw new Error("An Error occurred while appending genres to tracks")
    }
}

export async function createMapOfGenres(allTracksMap: Map<string, TrackEntry>): Promise<Map<string, Genre>> {
    try {
        const allGenresMap: Map<string, Genre> = new Map()

        for (const trackData of allTracksMap.values()) {
            trackData.track.genres.forEach(genre => {
                if(allGenresMap.has(genre)) {
                    allGenresMap.get(genre).count += 1

                    allGenresMap.get(genre).tracks.push(trackData.track)
                } else {
                    const newGenre = new Genre(
                        genre,
                        1,
                        [trackData.track],
                        [trackData.track.artists[0]]
                    )

                    allGenresMap.set(genre, newGenre)
                }
            })
        }

        return allGenresMap
    } catch(error) {
        console.log(error)

        throw new Error("An error occurred while creating a map of all genres")
    }
}