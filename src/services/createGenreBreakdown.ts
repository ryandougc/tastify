export async function createGenreBreakdownService(allTracksMap) {
    // Creation genre map
    let allGenresMap = new Map();

    for (const trackData of allTracksMap.values()) {
        trackData.genres.forEach((genre) => {
            // Test this function O(n^2) vs. a function of O(n)time
            // Implement an algorithm to merge similar genres together (eg: concious hiphop + hiphop + psychedlic hiphop)
            if (!allGenresMap.has(genre)) {
                const newGenre = {
                    count: 1,
                    tracks: [
                        {
                            trackId: trackData.id,
                            trackName: trackData.name,
                            artistId: trackData.artists[0].id,
                            artistName: trackData.artists[0].id.name,
                        },
                    ],
                };

                allGenresMap.set(genre, newGenre);
            } else {
                allGenresMap.get(genre).count += 1;
                allGenresMap.get(genre).tracks.push({
                    trackId: trackData.id,
                    trackName: trackData.name,
                    artistId: trackData.artists[0].id,
                    artistName: trackData.artists[0].id.name,
                });
            }
        });
    }

    return allGenresMap;
}
