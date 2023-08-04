import axios from 'axios'

import { Top50 } from '../lib/types';
import { Genre } from './Genre'

import { getUserGenreBreakdownService } from '../services/getUserGenreBreakdown'
import { getTop50Service } from '../services/getTop50';

export interface Analysis {
    genres: Array<Genre>,
    top50: Top50
}


export class Analysis implements Analysis {
    constructor(genres: Array<Genre> = null) {
        this.genres = genres
    }

    async generateAnalysis(): Promise<Analysis> {
        try {
            this.genres = await getUserGenreBreakdownService()
            this.top50 = await getTop50Service()

            return this
        } catch(error) {
            throw new Error(error.message)
        }
    }
}