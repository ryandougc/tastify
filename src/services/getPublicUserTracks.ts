import axios from "axios";
import { ITrackEntry, ITracklist } from "../interfaces/ITrack";
import { Track, TrackEntry } from '../models/Track'
import { pushTrackToMapAsTrackEntry } from "../lib/utils";

import { getPlaylistTracksService } from "./getPlaylistTracks";

export async function getPublicUserTracksService(accessToken, userId) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    axios.defaults.responseType = "json";

    // Get all tracks
    let playlistTracks: Array<Track> = await getPlaylistTracksService()

    // Sort the arrays of tracks into a map
    const allTracksMap: Map<string, TrackEntry> = new Map()

    pushTrackToMapAsTrackEntry(playlistTracks, allTracksMap)

    return allTracksMap;
}
