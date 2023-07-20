export interface Artist {
    genres: Array<string>
    href: string
    id: string
    name: string
    popularity: number
}

export class Artist implements Artist {
    constructor(genres: Array<string>, href: string, id: string, name: string, popularity?: number) {
        this.genres = genres
        this.href = href
        this.id = id
        this.name = name
        this.popularity = popularity || null
    }
}