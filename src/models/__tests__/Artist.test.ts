/*
* @group unit
* @group model
*/

import { Artist } from '../Artist'

describe('class Artist', () => {
    it('should create a class instance with the given properties genres, href, id, name, and popularity', () => {
        const testGenres = ["Country", "Pop", "Hip hop"]
        const testHref = 'https://ryancarr.ca'
        const testId = '1234567890'
        const testName = "Artist"
        const testPopularity = 81

        const artistClassResult = new Artist(testGenres, testHref, testId, testName, testPopularity)

        expect(artistClassResult).toHaveProperty('genres')
        expect(artistClassResult).toHaveProperty('href')
        expect(artistClassResult).toHaveProperty('id')
        expect(artistClassResult).toHaveProperty('name')
        expect(artistClassResult).toHaveProperty('popularity')
    })
    it('should create a class instance a name that matches the name provided', () => {
        const testGenres = ["Country", "Pop", "Hip hop"]
        const testHref = 'https://ryancarr.ca'
        const testId = '1234567890'
        const testName = "Song Name"
        const testPopularity = 81

        const artistClassResult = new Artist(testGenres, testHref, testId, testName, testPopularity)

        expect(artistClassResult.name).toBe(testName)
    })
})