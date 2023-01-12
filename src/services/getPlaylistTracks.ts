import axios                    from 'axios'

export async function getPlaylistTracksService(userId?: string) {
    try {
        let myPlaylistsUrl = 'https://api.spotify.com/v1/me/playlists?offset=0&limit=20'

        if(userId) { myPlaylistsUrl = `https://api.spotify.com/v1/users/${userId}/playlists?offset=0&limit=20` }


        // Get all playlists
        let playlists = []

        playlists = await getMyPlaylists(myPlaylistsUrl, playlists) 

        async function getMyPlaylists(url, playlistTrackArr) {
            const myPlaylistsResponse = await axios.get(url)

            playlistTrackArr = [...playlistTrackArr, ...myPlaylistsResponse.data.items]

            const nextUrl = myPlaylistsResponse.data.next

            if(nextUrl) {
                return await getMyPlaylists(nextUrl, playlistTrackArr)
            }
            
            return playlistTrackArr
        }


        // Get all playlist track entries
        let playlistTrackEntries = []

        for(let i=0; i < playlists.length; i++) {
            const playlistUrl = playlists[i].tracks.href

            await getPlaylistTrackEntries(playlistUrl, playlistTrackEntries)

            async function getPlaylistTrackEntries(url, playlistTrackEntriesArr) {
                const playlistTrackEntriesResponse = await axios.get(url)

                playlistTrackEntries.push(...playlistTrackEntriesResponse.data.items)

                const nextUrl = playlistTrackEntriesResponse.data.next

                if(nextUrl) {
                    return await getPlaylistTrackEntries(nextUrl, playlistTrackEntries)
                }

                return playlistTrackEntriesArr
            }
        }


        // Push all tracks into playlistTracksMap, and all artists into playlistArtistsMap
        let playlistTracksMap = new Map()
        let playlistArtistsMap = new Map()
        
        for(let i=0; i < playlistTrackEntries.length; i++) {

            if(playlistTrackEntries[i].track.type === 'track') {
                const song = playlistTrackEntries[i].track

                if(!playlistTracksMap.has(song.id)) {
                    // Add track to map
                    const newTrack = {
                            count: 1,
                            artists: song.artists,  // Adjust what properties get saved to cut down on useless data
                            duration: song.duration_ms,
                            href: song.href,
                            name: song.name,
                            popularity: song.popularity,
                            explicit: song.explicit
                    }
        
                    playlistTracksMap.set(song.id, newTrack)
    
                    // Add track artist to artistMap
                    if(!playlistTracksMap.has(song.artists[0].id)) {
                            const newArtist = {
                                    count: 1,
                                    name:  song.artists[0].name,
                                    href: song.artists[0].href,
                                    genres: [],
                                    id: song.artists[0].id
                            }
    
                            playlistArtistsMap.set(song.artists[0].id, newArtist)
                    } else {
                            playlistArtistsMap.get(song.artists[0].id).count += 1
                    }
    
                } else {
                    playlistTracksMap.get(song.id).count += 1
                }
            }
        }

        // Get artist genres and append to playlistTracksMap
        let arrayOfArtistIds = Array.from(playlistArtistsMap.keys())
        const numOfArtistsPerReq = 50
        const numOfApiCalls = arrayOfArtistIds.length / numOfArtistsPerReq

        for(let i=0; i<numOfApiCalls; i++) {
                const rangeOfArtistIds = arrayOfArtistIds.slice(i*numOfArtistsPerReq, (i+1)*numOfArtistsPerReq)

                const rangeOfArtistIdsString = rangeOfArtistIds.toString()

                const artistRepsonse = await axios.get(`https://api.spotify.com/v1/artists?ids=${rangeOfArtistIdsString}`)

                // Push artist data to playlistArtistsMap
                artistRepsonse.data.artists.forEach(artist => {
                    playlistArtistsMap.get(artist.id).genres = artist.genres
                    playlistArtistsMap.get(artist.id).popularity = artist.popularity
                })

        }

        // Add the primary artists genre to a track in the trackMap
        for (const trackData of playlistTracksMap.values()) {
            const primaryArtist = trackData.artists[0]

            if(playlistArtistsMap.has(primaryArtist.id)) {
                    trackData.genres = playlistArtistsMap.get(primaryArtist.id).genres
            }
        }
    
        
        return { playlistTracksMap, playlistArtistsMap }
    } catch(err) { 
        console.log(err)
    }
}