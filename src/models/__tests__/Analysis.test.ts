/*
* @group unit
* @group model
*/

import { Analysis } from '../Analysis'

describe('class Analysis', () => {
    it('should create a class instance holding the genres property', () => {
        const testGenres = []

        const analysisClassResult = new Analysis(testGenres)

        expect(analysisClassResult).toHaveProperty('genres')
    })
    it('should generate an analysis for the user whos profileId was provided', async () => {
        const testProfileId = '1234567890'
        const testAnalysis = new Analysis()

        const analysisClassResult = await testAnalysis.generateAnalysis(testProfileId)

        expect(analysisClassResult).toBeInstanceOf(Analysis)
    })
})