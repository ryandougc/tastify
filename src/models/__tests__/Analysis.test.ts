/*
* @group unit
* @group model
*/

import { Analysis } from '../Analysis'

describe('class Analysis', () => {
    it('should create a class instance holding the genres property', () => {
        const testGenres = new Map()

        const analysisClassResult = new Analysis(testGenres)

        expect(analysisClassResult).toHaveProperty('genres')
    })
})