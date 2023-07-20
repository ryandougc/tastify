/*
* @group unit
*/

import { getPlaylistTracksService } from "../getPlaylistTracks";

import samplePlaylistResponse1of2 from './sample_response_data/sample_playlist_response_1of2.json'
import samplePlaylistResponse2of2 from './sample_response_data/sample_playlist_response_2of2.json'
import samplePlaylistTracksResponse1of2 from './sample_response_data/sample_playlistTracks_response_1of2.json'
import samplePlaylistTracksResponse2of2 from './sample_response_data/sample_playlistTracks_response_2of2.json'


// Mock Axios
import axios from "axios";
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

const fakeUserId: string = '123456789'


describe('getPlaylistTracksService()', () => {
    it('should return an array of tracks if a valid user ID is provided', async () => {
        mockedAxios.get.mockImplementation((url) => {
            switch(url) {
                case 'https://api.spotify.com/v1/me/playlists?offset=0&limit=20': 
                    return Promise.resolve({ 
                        data: {
                            next: null,
                            total: 1,
                            items: [  
                                {      
                
                                    id: "43qbv1VHc5c73tJdS1PHNP",   
                                    name: "Chills",     
                                    tracks: {       
                                        href: "https://api.spotify.com/v1/playlists/43qbv1VHc5c73tJdS1PHNP/tracks",  
                                        total: 33    
                                    },   
                                    type: "playlist",    
                                }
                            ]
                        }
                    })
                case 'https://api.spotify.com/v1/playlists/43qbv1VHc5c73tJdS1PHNP/tracks?fields=next%2C+offset%2C+total%2C+items.track.name%2C+items.track.id%2C+items.track.artists.id%2C+items.track.artists.name%2C+items.track.artists.href%2C+items.track.href%2C+items.track.popularity%2C+items.track.type':
                    return Promise.resolve({
                        data:  {    
                            next: null,
                            offset: 0,  
                            total: 1,  
                            items: [ 
                                {
                                    track: {        
                                        artists: [          
                                            {            
                                                href: "https://api.spotify.com/v1/artists/6eSdhw46riw2OUHgMwR8B5",            
                                                id: "6eSdhw46riw2OUHgMwR8B5",            
                                                name: "Odiseo"          
                                            }        
                                        ],        
                                        href: "https://api.spotify.com/v1/tracks/4rzfv0JLZfVhOhbSQ8o5jZ",        
                                        id: "4rzfv0JLZfVhOhbSQ8o5jZ",        
                                        name: "Api",        
                                        popularity: 2,        
                                        type: "track"      
                                    }    
                                }
                            ]
                        }
                    })
            }
        })
        
        const response = await getPlaylistTracksService()

        expect(response).toEqual([
            {
                track: {        
                    artists: [          
                        {            
                            href: "https://api.spotify.com/v1/artists/6eSdhw46riw2OUHgMwR8B5",            
                            id: "6eSdhw46riw2OUHgMwR8B5",            
                            name: "Odiseo"          
                        }        
                    ],        
                    href: "https://api.spotify.com/v1/tracks/4rzfv0JLZfVhOhbSQ8o5jZ",        
                    id: "4rzfv0JLZfVhOhbSQ8o5jZ",        
                    name: "Api",        
                    popularity: 2,        
                    type: "track"      
                }    
            }   
        ])
        expect(mockedAxios.get).toHaveBeenCalledTimes(2)
    })
    it('should return an array of tracks if a valid user ID is provided and 2 requests are made for playlists are made', async () => {
        mockedAxios.get.mockImplementation((url) => {
            switch(url) {
                case 'https://api.spotify.com/v1/me/playlists?offset=0&limit=20': 
                    return Promise.resolve({ 
                        data: samplePlaylistResponse1of2
                    })
                case 'https://api.spotify.com/v1/users/whitekidfromtheblock/playlists?offset=1&limit=1': 
                    return Promise.resolve({ 
                        data: samplePlaylistResponse2of2
                    })
                case 'https://api.spotify.com/v1/playlists/41sIXy3jbeVjWwxglpMsDi/tracks?fields=next%2C+offset%2C+total%2C+items.track.name%2C+items.track.id%2C+items.track.artists.id%2C+items.track.artists.name%2C+items.track.artists.href%2C+items.track.href%2C+items.track.popularity%2C+items.track.type':
                    return Promise.resolve({
                        data: samplePlaylistTracksResponse1of2
                    })
                case 'https://api.spotify.com/v1/playlists/41sIXy3jbeVjWwxglpMsDi/tracks?offset=1&limit=1&fields=id,%20next,%20offset,%20total,%20items.track.name,%20items.track.id,%20items.track.artists.id,%20items.track.artists.name,%20items.track.artists.href,%20items.track.href,%20items.track.popularity,%20items.track.type&market=CA&locale=en-US,en;q=0.5':
                    return Promise.resolve({
                        data: samplePlaylistTracksResponse2of2
                    })
                case 'https://api.spotify.com/v1/playlists/7oibm62uANzc5CliEBdcMr/tracks?fields=next%2C+offset%2C+total%2C+items.track.name%2C+items.track.id%2C+items.track.artists.id%2C+items.track.artists.name%2C+items.track.artists.href%2C+items.track.href%2C+items.track.popularity%2C+items.track.type':
                    return Promise.resolve({
                        data: samplePlaylistTracksResponse2of2
                    })
            }
        })
        
        const response = await getPlaylistTracksService()

        expect(response[1]).toEqual({
            track: {
                artists: [
                    {
                        href: "https://api.spotify.com/v1/artists/1rHOtdmGNr5vcYNw5v7QGC",
                        id: "1rHOtdmGNr5vcYNw5v7QGC",
                        name: "Kenny Beats"
                    }
                ],
                href: "https://api.spotify.com/v1/tracks/1rOKAsJZJDIikOKDeUfPRV",
                id: "1rOKAsJZJDIikOKDeUfPRV",
                name: "Last Words",
                popularity: 65,
                type: "track"
            }
        })
        expect(mockedAxios.get).toHaveBeenCalledTimes(5)
    })
    it('should return an empty array given that a user has no playlists', async () => {
        mockedAxios.get.mockResolvedValue({ data: {
            items: [],
            next: ""
        }})
        
        const response = await getPlaylistTracksService(fakeUserId)

        expect(response).toEqual([])
        expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    })
    it('should return undefined given there is an error returning data from the API', async () => {
        mockedAxios.get.mockResolvedValue(undefined)
        
        const response = await getPlaylistTracksService(fakeUserId)

        expect(response).toEqual(undefined)
        expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    })
})