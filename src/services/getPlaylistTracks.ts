import axios from "axios";
import { IPlaylistItem } from "../interfaces/IPlaylists";
import { ITracklist } from "../interfaces/ITrack";
import { Track } from '../models/Track'

export async function getPlaylistTracksService(userId?: string): Promise<Array<Track>> {
    try {
        let playlistUrls: string = ""

        if (userId) {
            playlistUrls = `https://api.spotify.com/v1/users/${userId}/playlists?offset=0&limit=20`;
        } else {
            playlistUrls = "https://api.spotify.com/v1/me/playlists?offset=0&limit=20";
        }

        // Get all playlists
        let allPlaylists: Array<IPlaylistItem> | [] = [];

        allPlaylists = await getPlaylists(playlistUrls, allPlaylists);

        if(allPlaylists.length === 0) return[]

        // Get all playlist track entries
        let allPlaylistTracks: Array<Track> = [];

        for(let i=0; i < allPlaylists.length; i++) {
            const playlistEntry: IPlaylistItem = allPlaylists[i]

            const playlistUrl: string = playlistEntry.href

            await getPlaylistTrackEntries(playlistUrl, allPlaylistTracks)
        }

        // Return an array of all playlist tracks combined
        return allPlaylistTracks
    } catch(error) {
        console.log("Error when getting playlist tracks")

        return []
    }
}

async function getPlaylists(url, playlists) {
    const { data: playlistsResponse } = await axios.get(url);

    playlists = [
        ...playlists,
        ...playlistsResponse.items,
    ];

    const nextUrl: string = playlistsResponse.next;

    if (nextUrl) {
        return await getPlaylists(nextUrl, playlists);
    }

    return playlists;
}

async function getPlaylistTrackEntries(url, playlistTrackEntries) {
    const { data :playlistTrackEntriesResponse } = await axios.get(url);

    playlistTrackEntries.push(
        ...playlistTrackEntriesResponse.items
    );

    const nextUrl: string = playlistTrackEntriesResponse.next;

    if (nextUrl) {
        return await getPlaylistTrackEntries(
            nextUrl,
            playlistTrackEntries
        );
    }

    return playlistTrackEntries;
}