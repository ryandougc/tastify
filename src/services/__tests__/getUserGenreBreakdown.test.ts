import { ArtistEntry } from '../../lib/types'

import { Artist } from "../../models/Artist"
import { Track } from '../../models/Track';

import { getUserGenreBreakdownService } from "../getUserGenreBreakdown";
import { getPlaylistTracksService } from '../getPlaylistTracks';
import { getLikedTracksService } from '../getLikedTracks';

import sampleLikedTracksNoNext from './sample_response_data/sample_likedTracks_response_noNext.json'
import samplePlaylistTracksNoNext from './sample_response_data/sample_playlistTracks_response_noNext.json'
import sampleArtistMultiResponseSpecifiedArtists from './sample_response_data/sample_artist_multi_response_specifiedArtists.json'

// Mock Axios
import axios from "axios";
import { Genre } from '../../models/Genre';
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../lib/utils', () => {
    return {
        generateUserId: jest.fn(() => {
            return '1a2b3c4d5e'
        })
    }
})
jest.mock('../getLikedTracks', () => {
    return {
        getLikedTracksService: jest.fn()
    }
})

jest.mock('../getPlaylistTracks', () => {
    return {
        getPlaylistTracksService: jest.fn()
    }
})


describe('getUserGenreBreakdownService()', () => {
    it('should return a map of the genres of tracks from the response data provided', async () => {
        jest.mocked(getLikedTracksService).mockImplementation(() => {
            return new Promise((resolve, reject) => {
                const likedTracksResponseArray = sampleLikedTracksNoNext.items
                const likedTracksArray: Array<Track> = []

                likedTracksResponseArray.forEach(trackResponse => {
                    const trackData = trackResponse.track
            
                    const newTrack = new Track(
                        [new Artist(
                            [], //genres
                            trackData.artists[0].href,
                            trackData.artists[0].id,
                            trackData.artists[0].name
                        )],
                        trackData.href,
                        trackData.id,
                        trackData.name,
                        "track"
                    )
            
                    likedTracksArray.push(newTrack)
                })

                resolve(likedTracksArray)
            })
        })

        jest.mocked(getPlaylistTracksService).mockImplementation(() => {
            return new Promise((resolve, reject) => {
                const playlistTracksResponseArray = samplePlaylistTracksNoNext.items
                const playlistTracksArray: Array<Track> = []
    
                playlistTracksResponseArray.forEach(trackResponse => {
                    const trackData = trackResponse.track
            
                    const newTrack = new Track(
                        [new Artist(
                            [], //genres
                            trackData.artists[0].href,
                            trackData.artists[0].id,
                            trackData.artists[0].name
                        )],
                        trackData.href,
                        trackData.id,
                        trackData.name,
                        "track"
                    )
            
                    playlistTracksArray.push(newTrack)
                })

                resolve(playlistTracksArray)
            })
        })

        mockedAxios.get.mockImplementation((url) => {
            if(url.match(/^https:\/\/api\.spotify.com\/v1\/artists\?ids=.*/)) {
                return Promise.resolve({ 
                    data: sampleArtistMultiResponseSpecifiedArtists
                })
            }
        })

        const result = await getUserGenreBreakdownService()

        expect(getLikedTracksService).toHaveBeenCalled()
        expect(getPlaylistTracksService).toHaveBeenCalled()
        expect(result).toBeInstanceOf(Map<string, Genre>)
    })
    it("should return breakdown even if there are no liked songs", async () => {
        jest.mocked(getLikedTracksService).mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve([])
            })
        })

        jest.mocked(getPlaylistTracksService).mockImplementation(() => {
            return new Promise((resolve, reject) => {
                const playlistTracksResponseArray = samplePlaylistTracksNoNext.items
                const playlistTracksArray: Array<Track> = []
    
                playlistTracksResponseArray.forEach(trackResponse => {
                    const trackData = trackResponse.track
            
                    const newTrack = new Track(
                        [new Artist(
                            [], //genres
                            trackData.artists[0].href,
                            trackData.artists[0].id,
                            trackData.artists[0].name
                        )],
                        trackData.href,
                        trackData.id,
                        trackData.name,
                        "track"
                    )
            
                    playlistTracksArray.push(newTrack)
                })

                resolve(playlistTracksArray)
            })
        })

        mockedAxios.get.mockImplementation((url) => {
            if(url.match(/^https:\/\/api\.spotify.com\/v1\/artists\?ids=.*/)) {
                return Promise.resolve({ 
                    data: sampleArtistMultiResponseSpecifiedArtists
                })
            }
        })

        const result = await getUserGenreBreakdownService()

        expect(getLikedTracksService).toHaveBeenCalled()
        expect(getPlaylistTracksService).toHaveBeenCalled()
        expect(result).toBeInstanceOf(Map<string, Genre>)
    })
    it("should return breakdown even if there are no playlist songs", async () => {
        jest.mocked(getLikedTracksService).mockImplementation(() => {
            return new Promise((resolve, reject) => {
                const likedTracksResponseArray = sampleLikedTracksNoNext.items
                const likedTracksArray: Array<Track> = []

                likedTracksResponseArray.forEach(trackResponse => {
                    const trackData = trackResponse.track
            
                    const newTrack = new Track(
                        [new Artist(
                            [], //genres
                            trackData.artists[0].href,
                            trackData.artists[0].id,
                            trackData.artists[0].name
                        )],
                        trackData.href,
                        trackData.id,
                        trackData.name,
                        "track"
                    )
            
                    likedTracksArray.push(newTrack)
                })

                resolve(likedTracksArray)
            })
        })

        jest.mocked(getPlaylistTracksService).mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve([])
            })
        })

        mockedAxios.get.mockImplementation((url) => {
            if(url.match(/^https:\/\/api\.spotify.com\/v1\/artists\?ids=.*/)) {
                return Promise.resolve({ 
                    data: sampleArtistMultiResponseSpecifiedArtists
                })
            }
        })

        const result = await getUserGenreBreakdownService()

        expect(getLikedTracksService).toHaveBeenCalled()
        expect(getPlaylistTracksService).toHaveBeenCalled()
        expect(result).toBeInstanceOf(Map<string, Genre>)
    })
    it("should throw an error if there are no playlist tracks or liked tracks", async () => {
        jest.mocked(getLikedTracksService).mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve([])
            })
        })

        jest.mocked(getPlaylistTracksService).mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve([])
            })
        })

        const result = async () => await getUserGenreBreakdownService()

        expect(result).rejects.toThrow("This user does not have any liked tracks or playlit tracks")
    })
})