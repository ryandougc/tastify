import { Genre } from './Genre'

export interface Analysis {
    genres: Array<Genre>
}


export class Analysis implements Analysis {
    constructor(genres: Array<Genre> = []) {
        this.genres = genres;
    }

    async generateAnalysis(profileId: string): Promise<Analysis> {
        // Call service to get data from Spotify API

        this.genres = []

        return this
    }
}