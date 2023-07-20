import { Top50 } from '../lib/types';
import { Genre } from './Genre'

import { getUserGenreBreakdownService } from '../services/getUserGenreBreakdown'
import { getTop50Service } from '../services/getTop50';

export interface Analysis {
    genres: Map<string, Genre>,
    top50: Top50
}


export class Analysis implements Analysis {
    constructor(genres: Map<string, Genre> = new Map()) {
        this.genres = genres;
    }

    async generateAnalysis(profileId: string): Promise<Analysis> {
        // Call service to get data from Spotify API

        this.genres = await getUserGenreBreakdownService()
        this.top50 = await getTop50Service()

        return this
    }
}