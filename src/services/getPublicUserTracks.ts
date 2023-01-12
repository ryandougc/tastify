import axios                        from "axios"

import { getPlaylistTracksService } from "./getPlaylistTracks"

export async function getPublicUserTracksService(accessToken, userId) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    axios.defaults.responseType = 'json'

    // Get all tracks
    const { playlistTracksMap, playlistArtistsMap } = await getPlaylistTracksService(userId)

    return playlistTracksMap
}