/*
* @group unit
* @group model
*/

import { Genre } from '../Genre'

describe('class Genre', () => {
    it('should create a class instance with the given properties name, count, tracks, and artists', () => {
        const testName = "Genre Name"
        const testCount = 0
        const testTracks = []
        const testArtists = []

        const genreClassResult = new Genre(testName, testCount, testTracks, testArtists)

        expect(genreClassResult).toHaveProperty('name')
        expect(genreClassResult).toHaveProperty('count')
        expect(genreClassResult).toHaveProperty('tracks')
        expect(genreClassResult).toHaveProperty('artists')
    })
    it('should create a class instance with a name that matches the name provided', () => {
        const testName = "Genre Name"
        const testCount = 14
        const testTracks = []
        const testArtists = []

        const genreClassResult = new Genre(testName, testCount, testTracks, testArtists)

        expect(genreClassResult.name).toBe(testName)
    })
})