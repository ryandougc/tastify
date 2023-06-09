export interface IArtist {
    genres: Array<string>;
    href: string;
    id: string;
    name: string;
    popularity: number;
}

export interface IArtistEntry extends IArtist {
    count: number;
}

export interface IArtists extends Array<IArtist> {}

export interface IArtistMap extends Map<string, IArtistEntry> {}