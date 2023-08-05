/*
* @group unit
* @group service
*/

import { Artist } from "../../models/Artist"
import { Track } from "../../models/Track"
import { getTop50Service } from "../getTop50"

import sampleTop50TracksNoNext from './sample_response_data/sample_top50Tracks_response_noNext.json'
import sampleTop50ArtistsNoNext from './sample_response_data/sample_top50Artists_response_noNext.json'
import sampleTop50Tracks1of2 from './sample_response_data/sample_top50Tracks_response_1of2.json'
import sampleTop50Tracks2of2 from './sample_response_data/sample_top50Tracks_response_2of2.json'
import sampleTop50Artists1of2 from './sample_response_data/sample_top50Artists_response_1of2.json'
import sampleTop50Artists2of2 from './sample_response_data/sample_top50Artists_response_2of2.json'

// Mock Axios
import axios from "axios";
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getTop50Service()', () => {
    it("should return an object containing 2 arrays for top50 tracks and top50 artists", async () => {
        mockedAxios.get.mockImplementation((url) => {
            switch(url) {
                case "https://api.spotify.com/v1/me/top/tracks?offset=0&limit=50&time_range=medium_term":
                    return Promise.resolve({
                        data: sampleTop50TracksNoNext
                    })
                case "https://api.spotify.com/v1/me/top/artists?offset=0&limit=50&time_range=medium_term":
                    return Promise.resolve({
                        data: sampleTop50ArtistsNoNext
                    })
            }
        })

        const result: { tracks: Array<Track>, artists: Array<Artist> } = await getTop50Service()

        expect(result.tracks[0]).toEqual(new Track(
            [new Artist(
                [],
                "https://api.spotify.com/v1/artists/0nnYdIpahs41QiZ9MWp5Wx", 
                "0nnYdIpahs41QiZ9MWp5Wx", 
                "Holly Humberstone"
            )],
            "https://api.spotify.com/v1/tracks/7yuecadXy2rAgc6Id2D6Qw",
            "7yuecadXy2rAgc6Id2D6Qw",
            "Vanilla (Stairwell Version)",
            "track"
        ))
        expect(result.artists[0]).toEqual(new Artist(
            [
                "dfw rap",
                "melodic rap",
                "pop",
                "rap"
            ],
            "https://api.spotify.com/v1/artists/246dkjvS1zLTtiykXe5h60",
            "246dkjvS1zLTtiykXe5h60",
            "Post Malone",
            88
        ))
    })

    it("should return an object containing 2 arrays for top50 tracks and top50 artists when making multiple requests for tracks and multiple requests for artists", async () => {
        mockedAxios.get.mockImplementation((url) => {
            switch(url) {
                case "https://api.spotify.com/v1/me/top/tracks?offset=0&limit=50&time_range=medium_term":
                    return Promise.resolve({
                        data: sampleTop50Tracks1of2
                    })
                case "https://api.spotify.com/v1/me/top/tracks?limit=1&offset=2":
                    return Promise.resolve({
                        data: sampleTop50Tracks2of2
                    })
                case "https://api.spotify.com/v1/me/top/artists?offset=0&limit=50&time_range=medium_term":
                    return Promise.resolve({
                        data: sampleTop50Artists1of2
                    })
                case "https://api.spotify.com/v1/me/top/artists?limit=1&offset=2":
                    return Promise.resolve({
                        data: sampleTop50Artists2of2
                    })
            }
        })

        const result: { tracks: Array<Track>, artists: Array<Artist> } = await getTop50Service()

        expect(result.tracks[1]).toEqual(new Track(
            [new Artist(
                [],
                "https://api.spotify.com/v1/artists/40ZNYROS4zLfyyBSs2PGe2",
                "40ZNYROS4zLfyyBSs2PGe2",
                "Zach Bryan",
            )],
            "https://api.spotify.com/v1/tracks/5jfhLCSIFUO4ndzNRh4w4G",
            "5jfhLCSIFUO4ndzNRh4w4G",
            "Burn, Burn, Burn",
            "track"
        ))
        expect(result.artists[0]).toEqual(new Artist(
            [
                "argentine ambient",
                "latin classical",
                "latin soundtrack",
                "orchestral soundtrack",
                "soundtrack"
            ],
            "https://api.spotify.com/v1/artists/4W3fa7tiXGVXl3KilbACqt",
            "4W3fa7tiXGVXl3KilbACqt",
            "Gustavo Santaolalla",
            64,
        ))
    })
})