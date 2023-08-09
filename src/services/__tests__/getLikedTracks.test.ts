/*
* @group unit
* @group service
*/

import { Track } from "../../models/Track";
import { Artist } from "../../models/Artist";

import { getLikedTracksService } from "../getLikedTracks";

import sampleLikedTracksNoNext from './sample_response_data/sample_likedTracks_response_noNext.json';
import sampleLikedTracks1of2 from './sample_response_data/sample_likedTracks_response_1of2.json';
import sampleLikedTracks2of2 from './sample_response_data/sample_likedTracks_response_2of2.json';
import sampleLikedTracksNoData from './sample_response_data/sample_likedTracks_noData.json';

// Mock Axios
import axios from "axios";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getLikedTracksService()', () => {
    it('should return an array of tracks given a valid User ID', async () => {
        mockedAxios.get.mockImplementation((url) => {
            switch(url) {
                case "https://api.spotify.com/v1/me/tracks?offset=0&limit=50":
                    return Promise.resolve({
                        data: sampleLikedTracksNoNext
                    })
            }
        })

        const result: Array<Track> = await getLikedTracksService()

        expect(result[0]).toEqual({
            artists: [
                new Artist(
                    [],
                    "https://api.spotify.com/v1/artists/0wyMPXGfOuQzNR54ujR9Ix",
                    "0wyMPXGfOuQzNR54ujR9Ix",
                    "Caamp",
                    null
                )
            ],
            href: "https://api.spotify.com/v1/tracks/1oWnDC5OoMPPosVY2cdXgT",
            id: "1oWnDC5OoMPPosVY2cdXgT",
            name: "Lavender Girl",
            type: "track",
            genres: []
        })
    })
    it('should return an array of all tracks given a valid user ID when multiple requests for tracks needs to be made', async () => {
        mockedAxios.get.mockImplementation((url) => {
            switch(url) {
                case "https://api.spotify.com/v1/me/tracks?offset=0&limit=50":
                    return Promise.resolve({
                        data: sampleLikedTracks1of2
                    })
                case "https://api.spotify.com/v1/me/tracks?offset=10&limit=10":
                    return Promise.resolve({
                        data: sampleLikedTracks2of2
                    })
            }
        })

        const result: Array<Track> = await getLikedTracksService()

        expect(result[10]).toEqual({
            artists: [
                new Artist(
                    [],
                    "https://api.spotify.com/v1/artists/7mnBLXK823vNxN3UWB7Gfz",
                    "7mnBLXK823vNxN3UWB7Gfz",
                    "The Black Keys",
                    null
                )
            ],
            href: "https://api.spotify.com/v1/tracks/1pwWrPxonLIE12WWu9NzgU",
            id: "1pwWrPxonLIE12WWu9NzgU",
            name: "Turn Blue",
            type: "track",
            genres: []
        })
    })
    it('should return an empty array when a user has no liked songs', async () => {
        mockedAxios.get.mockImplementation((url) => {
            switch(url) {
                case "https://api.spotify.com/v1/me/tracks?offset=0&limit=50":
                    return Promise.resolve({
                        data: sampleLikedTracksNoData
                    })
            }
        })

        const result: Array<Track> = await getLikedTracksService()

        expect(result).toEqual([])
    })
})