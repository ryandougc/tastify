import axios from "axios";
import { ITrack, ITrackEntry, ITracklist } from "../interfaces/ITrack";
import { Track, TrackEntry } from '../models/Track'
import { pushTrackToMapAsTrackEntry } from "../lib/utils";

import { getLikedTracksService } from "./getLikedTracks";
import { getPlaylistTracksService } from "./getPlaylistTracks";

export default async function getCurrentUserTracksService(accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
    axios.defaults.responseType = "json";

    // Get all tracks
    let likedTracks: Array<Track> = await getLikedTracksService()
    let playlistTracks: Array<Track> = await getPlaylistTracksService()

    // Sort the arrays of tracks into a map
    const allTracksMap: Map<string, TrackEntry> = new Map()

    pushTrackToMapAsTrackEntry(likedTracks, allTracksMap)

    pushTrackToMapAsTrackEntry(playlistTracks, allTracksMap)

    return allTracksMap;
}