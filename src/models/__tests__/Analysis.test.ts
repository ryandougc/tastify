/*
* @group unit
* @group model
*/

import { Analysis } from '../Analysis'

describe('class Analysis', () => {
    it('should create a class instance holding the genres property', () => {
        const analysisClassResult = new Analysis()

        expect(analysisClassResult).toHaveProperty('genres')
    })
})