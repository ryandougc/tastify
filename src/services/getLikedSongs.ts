import axios from "axios";

/**
 * @return {object[]}
 */

export async function getLikedSongsService() {
    let tracksRemaining = true;
    let url = "https://api.spotify.com/v1/me/tracks?offset=0&limit=50";
    let likedTracksMaps = new Map();
    let likedTracksArtistMap = new Map();
    let likedTracksArray = []

    while (tracksRemaining) {
        // Get tracks
        const myTracksResponse = await axios.get(url);

        // Remove excess data ???

        // Push to single array
        // likedTracksArray.push(...myTracksResponse.data)

        // Check for next URL to run to get all of the tracks
    }

// Return master array of all liked tracks

    while (tracksRemaining) {
        const myTracksResponse = await axios.get(url);

        // Push tracks to hash
        // allTracksHash = pushToHash(myTracksResponse.data.items, allTracksHash)
        myTracksResponse.data.items.forEach((item) => {
            const song = item.track;

            if (!likedTracksMaps.has(song.id)) {
                // Add track to map
                const newTrack = {
                    count: 1,
                    artists: song.artists, // Adjust what properties get saved to cut down on useless data
                    duration: song.duration_ms,
                    href: song.href,
                    name: song.name,
                    popularity: song.popularity,
                    explicit: song.explicit,
                };

                likedTracksMaps.set(song.id, newTrack);

                // Add track artist to artistMap
                if (!likedTracksMaps.has(song.artists[0].id)) {
                    const newArtist = {
                        count: 1,
                        name: song.artists[0].name,
                        href: song.artists[0].href,
                        genres: [],
                        id: song.artists[0].id,
                    };

                    likedTracksArtistMap.set(song.artists[0].id, newArtist);
                } else {
                    likedTracksArtistMap.get(song.artists[0].id).count += 1;
                }
            } else {
                likedTracksMaps.get(song.id).count += 1;
            }
        });

        // Check if there is a next url to run to get more tracks
        if (myTracksResponse.data.next) {
            url = myTracksResponse.data.next;
        } else {
            tracksRemaining = false;
        }
    }

    // split artist IDs into strings
    let arrayOfArtistIds = Array.from(likedTracksArtistMap.keys());
    const numOfArtist = 50;
    const numOfApiCalls = arrayOfArtistIds.length / numOfArtist;

    for (let i = 0; i < numOfApiCalls; i++) {
        const rangeOfArtistIds = arrayOfArtistIds.slice(
            i * numOfArtist,
            (i + 1) * numOfArtist
        );

        const rangeOfArtistIdsString = rangeOfArtistIds.toString();

        const artistRepsonse = await axios.get(
            `https://api.spotify.com/v1/artists?ids=${rangeOfArtistIdsString}`
        );

        // Push artist data to the artist map
        artistRepsonse.data.artists.forEach((artist) => {
            likedTracksArtistMap.get(artist.id).genres = artist.genres;
            likedTracksArtistMap.get(artist.id).popularity = artist.popularity;
        });
    }

    // Add the primary artists genre to a track in the trackMap
    for (const trackData of likedTracksMaps.values()) {
        const primaryArtist = trackData.artists[0];

        if (likedTracksArtistMap.has(primaryArtist.id)) {
            trackData.genres = likedTracksArtistMap.get(
                primaryArtist.id
            ).genres;
        }
    }

    return { likedTracksMaps, likedTracksArtistMap };
}
