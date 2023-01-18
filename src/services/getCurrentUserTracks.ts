import axios from "axios";

import { getLikedSongsService } from "./getLikedSongs";
import { getPlaylistTracksService } from "./getPlaylistTracks";

export async function getCurrentUserTracksService(accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    axios.defaults.responseType = "json";

    // Get all tracks
    let { likedTracksMaps } = await getLikedSongsService();
    let { playlistTracksMap } = await getPlaylistTracksService();

    // Abstracting actions - merge all tracks and artists into their maps
    
    // Create map of all tracks
    // Create map of all artists
            // if (!likedTracksMaps.has(song.id)) {
            //     // Add track to map
            //     const newTrack = {
            //         count: 1,
            //         artists: song.artists, // Adjust what properties get saved to cut down on useless data
            //         duration: song.duration_ms,
            //         href: song.href,
            //         name: song.name,
            //         popularity: song.popularity,
            //         explicit: song.explicit,
            //     };

            //     likedTracksMaps.set(song.id, newTrack);

            //     // Add track artist to artistMap
            //     if (!likedTracksMaps.has(song.artists[0].id)) {
            //         const newArtist = {
            //             count: 1,
            //             name: song.artists[0].name,
            //             href: song.artists[0].href,
            //             genres: [],
            //             id: song.artists[0].id,
            //         };

            //         likedTracksArtistMap.set(song.artists[0].id, newArtist);
            //     } else {
            //         likedTracksArtistMap.get(song.artists[0].id).count += 1;
            //     }

    // Return tracks map and artists map

    const allTracksMap = new Map([...likedTracksMaps, ...playlistTracksMap]);

    return allTracksMap;
}
