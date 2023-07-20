import axios from "axios";
import { Track } from '../models/Track'

// This interface models incoming data from the Spotify API. It is only here for type safety and code clarity
interface PlaylistItem {
    collaborative: boolean,
    description: string,
    external_urls: Object,
    href: string,
    id: string,
    images: Array<Object>,
    name: string,
    owner: Object,
    public: boolean,
    snapshot_id: string,
    tracks: Object,
    type: string,
    uri: string
}


export async function getPlaylistTracksService(userId?: string): Promise<Array<Track>> {
    try {
        let playlistUrls: string = ""

        if (userId) {
            playlistUrls = `https://api.spotify.com/v1/users/${userId}/playlists?offset=0&limit=20`;
        } else {
            playlistUrls = "https://api.spotify.com/v1/me/playlists?offset=0&limit=20";
        }

        // Get all playlists
        let allPlaylists: Array<PlaylistItem> | [] = [];

        allPlaylists = await getPlaylists(playlistUrls, allPlaylists);

        if(allPlaylists.length === 0) return []

        // Get all playlist track entries
        let allPlaylistTracks: Array<Track> = [];

        for(let i=0; i < allPlaylists.length; i++) {
            const playlistEntry: PlaylistItem = allPlaylists[i]

            const playlistId: string = playlistEntry.id

            const filteredPlaylistTrackUrl: string = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=next%2C+offset%2C+total%2C+items.track.name%2C+items.track.id%2C+items.track.artists.id%2C+items.track.artists.name%2C+items.track.artists.href%2C+items.track.href%2C+items.track.popularity%2C+items.track.type`


            await getPlaylistTrackEntries(filteredPlaylistTrackUrl, allPlaylistTracks)
        }

        // Return an array of all playlist tracks combined
        return allPlaylistTracks
    } catch(error) {
        console.log("Error when getting playlist tracks")

        return undefined
    }
}

async function getPlaylists(url, playlists) {
    // This is a new url to use to only get the playlist track data we need. We would have to put the playlist id into this link
    const { data: playlistsResponse } = await axios.get(url)

    playlists = [
        ...playlists,
        ...playlistsResponse.items,
    ]

    const nextUrl: string = playlistsResponse.next

    if (nextUrl) {
        return await getPlaylists(nextUrl, playlists)
    }

    return playlists
}

async function getPlaylistTrackEntries(filteredPlaylistTrackUrl, playlistTrackEntries) {

    const { data :playlistTrackEntriesResponse } = await axios.get(filteredPlaylistTrackUrl)

    playlistTrackEntries.push(
        ...playlistTrackEntriesResponse.items
    )

    const nextUrl: string = playlistTrackEntriesResponse.next

    if (nextUrl) {
        return await getPlaylistTrackEntries(
            nextUrl,
            playlistTrackEntries
        )
    }

    return playlistTrackEntries
}