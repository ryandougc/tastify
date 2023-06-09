/*
* @group unit
* @group model
*/

import { Track } from '../Track'

describe('class Track', () => {
    it('should create a Track class instance with the given Artist Array, href, id, name, and type that has the corresponding properties', () => {
        const testArtistArray = []
        const testHref = 'https://ryancarr.ca/song'
        const testId = '0987654321'
        const testName = 'Test Track'
        const testType = 'track'

        const trackClassResult = new Track(testArtistArray, testHref, testId, testName, testType)

        expect(trackClassResult).toHaveProperty('artists')
        expect(trackClassResult).toHaveProperty('href')
        expect(trackClassResult).toHaveProperty('id')
        expect(trackClassResult).toHaveProperty('name')
        expect(trackClassResult).toHaveProperty('type')
    })
    it('should create a Track class instance with a name that matches the name provided', () => {
        const testArtistArray = []
        const testHref = 'https://ryancarr.ca/song'
        const testId = '0987654321'
        const testName = 'Test Track'
        const testType = 'track'

        const trackClassResult = new Track(testArtistArray, testHref, testId, testName, testType)

        expect(trackClassResult.name).toBe(testName)  
    })
})