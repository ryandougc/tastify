import axios                        from "axios"

import { getLikedSongsService }     from "./getLikedSongs"
import { getPlaylistTracksService } from "./getPlaylistTracks"

export async function getCurrentUserTracksService(accessToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    axios.defaults.responseType = 'json'

    // Get all tracks
    let { likedTracksMaps } = await getLikedSongsService()
    let { playlistTracksMap } = await getPlaylistTracksService()

    const allTracksMap = new Map([...likedTracksMaps, ...playlistTracksMap])

    return allTracksMap
}